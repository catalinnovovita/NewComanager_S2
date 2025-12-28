import { getServerSession } from 'next-auth';
import { streamTechnicalChat } from '@/lib/agents/technical-agent';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { NextResponse } from 'next/server';
import { StreamingTextResponse } from 'ai';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { messages } = await req.json();

        // Safe cast as our auth options ensure id exists
        const stream = await streamTechnicalChat(messages, (session.user as any).id);

        return new StreamingTextResponse(stream);
    } catch (error) {
        console.error('Technical Chat Error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
