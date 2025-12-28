// OpenAI API wrapper for AI COMANAGER
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured');
}

export const openai = new OpenAI({
  apiKey: apiKey,
});

export async function streamGPT4Response(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  systemPrompt?: string
) {
  try {
    const minifiedMessages = messages.map(m => ({
      role: m.role as 'system' | 'user' | 'assistant',
      content: m.content
    }));

    const allMessages = systemPrompt
      ? [{ role: 'system' as const, content: systemPrompt }, ...minifiedMessages]
      : minifiedMessages;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: allMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 3000,
    });

    // Convert OpenAI stream to Web Standard Stream
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('OpenAI streaming error:', error);
    throw error;
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Embedding generation error:', error);
    throw error;
  }
}

export const BRIEF_GENERATION_PROMPT = `You are an expert marketing strategist and AI assistant for AI COMANAGER. Generate comprehensive marketing briefs based on user inputs. Format as JSON with strategy, channels array, timeline, and kpis fields. Be creative and actionable.`;

export const CAMPAIGN_ANALYSIS_PROMPT = `You are an expert marketing analyst. Analyze campaign performance and provide insights, recommendations, and optimization opportunities. Be data-driven and actionable.`;

export const CONTENT_IDEAS_PROMPT = `You are a creative marketing strategist. Generate engaging content ideas as JSON with ideas array containing title, concept, platform, cta, and variations. Be creative and platform-specific.`;
