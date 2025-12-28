import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { PrismaClient } from '@prisma/client';
import { saveToContextMemory } from '@/lib/vector-store';
import { openai } from '@/lib/openai';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { objective, targetAudience, budget, deadline } = body;

    if (!objective || !targetAudience || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const userPrompt = `Generate a comprehensive marketing brief for:

Objective: ${objective}
Target Audience: ${targetAudience}
Budget: $${budget}
Deadline: ${deadline}

Provide strategy, recommended channels (as array), timeline, and measurable KPIs.`;

    // Using OpenAI SDK directly for JSON mode support
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system' as const,
          content: 'You are an expert marketing strategist. Generate comprehensive marketing briefs as JSON with: strategy (string), channels (array like ["meta","google","email"]), timeline (string), kpis (string). Return ONLY valid JSON.'
        },
        { role: 'user' as const, content: userPrompt }
      ],
      stream: true,
      max_tokens: 2000,
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    // Create a new stream that transforms OpenAI chunks and handles accumulation
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let fullResponse = '';

        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullResponse += content;
              // Send progress update to client
              const progressData = JSON.stringify({
                status: 'processing',
                message: 'Generating brief...',
                chunk: content // Optional: send partial content if needed
              });
              controller.enqueue(encoder.encode(`data: ${progressData}\n\n`));
            }
          }

          // Once complete, parse and save
          try {
            // Clean potential markdown code blocks if any (GPT-4o sometimes adds them despite json_object)
            const cleanJson = fullResponse.replace(/^```json\n|```$/g, '');
            const finalResult = JSON.parse(cleanJson);

            const briefData = {
              title: objective?.substring(0, 100) ?? 'Marketing Brief',
              objective,
              targetAudience,
              budget: parseFloat(budget),
              deadline: new Date(deadline),
              strategy: finalResult?.strategy ?? '',
              channels: finalResult?.channels ?? [],
              timeline: finalResult?.timeline ?? '',
              kpis: finalResult?.kpis ?? '',
              status: 'draft',
              userId: (session.user as any).id,
            };

            const brief = await prisma.marketingBrief.create({
              data: briefData,
            });

            await saveToContextMemory(
              (session.user as any).id,
              'brief',
              `${objective} - ${targetAudience}`,
              { briefId: brief.id }
            );

            const finalEvent = JSON.stringify({
              status: 'completed',
              result: finalResult,
              briefId: brief.id
            });
            controller.enqueue(encoder.encode(`data: ${finalEvent}\n\n`));
          } catch (e) {
            console.error('Error parsing/saving brief:', e);
            const errorData = JSON.stringify({
              status: 'error',
              message: 'Failed to save generated brief'
            });
            controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          }

        } catch (error) {
          console.error('Stream error:', error);
          const errorData = JSON.stringify({
            status: 'error',
            message: 'Stream interruption'
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Brief generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate brief' },
      { status: 500 }
    );
  }
}
