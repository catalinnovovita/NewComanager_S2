import { addMemory, findSimilarMemories } from '@/lib/vector-store';

/**
 * Saves a chat interaction (User + Agent) to long-term memory.
 */
export async function rememberInteraction(
    userId: string,
    userMessage: string,
    agentResponse: string,
    category: string = 'technical_chat'
) {
    // We store the pair nicely formatted so the AI understands context later
    const memoryContent = `
User Query: ${userMessage}
Agent Response: ${agentResponse}
`;

    await addMemory(userId, memoryContent.trim(), category, {
        timestamp: new Date().toISOString(),
        type: 'conversation_turn'
    });
}

/**
 * Recalls relevant past interactions or docs based on the current user query.
 * Returns a formatted string ready for injection into the prompt.
 */
export async function recallContext(userId: string, query: string): Promise<string> {
    const memories = await findSimilarMemories(userId, query, 3, 0.7); // High threshold for relevance

    if (memories.length === 0) return '';

    const contextStr = memories.map((m, i) => `
[MEMORY ${i + 1}] (${m.contentType} - ${new Date(m.createdAt).toLocaleDateString()})
${m.contentText}
`).join('\n');

    return `
=== RELEVANT PAST CONTEXT ===
The user and agent have discussed this before. Use this memory to maintain continuity:
${contextStr}
=============================
`;
}
