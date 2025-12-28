// Vector store utilities for semantic search using native PostgreSQL pgvector
import { PrismaClient, Prisma } from '@prisma/client';
import { generateEmbedding } from './openai';

const prisma = new PrismaClient();

export async function saveToContextMemory(
  userId: string,
  contentType: string,
  contentText: string,
  metadata?: Record<string, any>
) {
  try {
    const embeddingVector = await generateEmbedding(contentText);

    // Use raw SQL to insert vector data since Prisma support is experimental
    await prisma.$executeRaw`
      INSERT INTO "ContextMemory" ("id", "userId", "contentType", "contentText", "embedding", "metadata", "createdAt")
      VALUES (
        gen_random_uuid()::text,
        ${userId},
        ${contentType},
        ${contentText},
        ${embeddingVector}::vector,
        ${metadata}::jsonb,
        NOW()
      )
    `;

    return { success: true };
  } catch (error) {
    console.error('Error saving to context memory:', error);
    throw error;
  }
}

export async function searchContextMemory(
  userId: string,
  query: string,
  contentType?: string,
  limit: number = 5
) {
  try {
    const queryEmbedding = await generateEmbedding(query);
    const vectorString = `[${queryEmbedding.join(',')}]`;

    // Use raw SQL for cosine similarity search
    // The <-> operator returns the cosine distance (0 = identical, 2 = opposite)

    // Construct the query parts safely
    const contentTypeClause = contentType
      ? Prisma.sql`AND "contentType" = ${contentType}`
      : Prisma.empty;

    const memories = await prisma.$queryRaw`
      SELECT 
        id, 
        "contentType", 
        "contentText", 
        metadata, 
        1 - (embedding <=> ${vectorString}::vector) as similarity
      FROM "ContextMemory"
      WHERE "userId" = ${userId}
      ${contentTypeClause}
      ORDER BY embedding <=> ${vectorString}::vector ASC
      LIMIT ${limit}
    `;

    return memories as Array<{
      id: string;
      contentType: string;
      contentText: string;
      metadata: any;
      similarity: number;
    }>;
  } catch (error) {
    console.error('Error searching context memory:', error);
    return [];
  }
}
