import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { streamMarketingChat } from '@/lib/agents/marketing-agent';
import { StreamingTextResponse } from 'ai';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { messages } = await req.json();

        // Safe cast as our auth options ensure id exists
        const stream = await streamMarketingChat(messages, (session.user as any).id);

        return new StreamingTextResponse(stream);
    } catch (error) {
        console.error('Marketing Chat Error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
