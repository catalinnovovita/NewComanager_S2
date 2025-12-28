import { getServerSession } from 'next-auth';
import { streamTechnicalChat } from '@/lib/agents/technical-agent';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { NextResponse } from 'next/server';
import { StreamingTextResponse } from 'ai';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { messages } = await req.json();

        const stream = await streamTechnicalChat(messages);

        return new StreamingTextResponse(stream);
    } catch (error) {
        console.error('Technical Chat Error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
