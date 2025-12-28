import { prisma } from '@/lib/prisma';
import { generateEmbedding } from '@/lib/openai';

/**
 * Stores a new piece of context memory.
 * Generates an embedding for the text and saves it to the database.
 */
export async function addMemory(
  userId: string,
  contentText: string,
  contentType: string,
  metadata: any = {}
) {
  try {
    const embedding = await generateEmbedding(contentText);

    // Prisma doesn't support vector types natively in the Client yet for writing easily
    // We use a raw query or just rely on the fact that we defined it as Unsupported
    // Wait, for creating we can't easily pass the vector string to standard create method if it's Unsupported
    // We must use $executeRaw for the insert to cast the vector.

    const embeddingString = `[${embedding.join(',')}]`;

    // Using raw query to insert vector data safely
    await prisma.$executeRaw`
      INSERT INTO "ContextMemory" ("id", "userId", "contentText", "contentType", "metadata", "embedding", "createdAt")
      VALUES (gen_random_uuid(), ${userId}, ${contentText}, ${contentType}, ${metadata}::jsonb, ${embeddingString}::vector, NOW());
    `;

    console.log(`Memory stored for user ${userId}: ${contentType}`);
    return true;
  } catch (error) {
    console.error('Error storing memory:', error);
    return false;
  }
}

/**
 * Finds relevant memories similar to the query text.
 * Uses Cosine Similarity (<=> operator in pgvector, or <-> for L2 distance).
 * We typically use <=> (cosine distance) for text embeddings.
 */
export async function findSimilarMemories(
  userId: string,
  queryText: string,
  limit: number = 5,
  similarityThreshold: number = 0.5 // Adjust based on needs
) {
  try {
    const queryEmbedding = await generateEmbedding(queryText);
    const vectorString = `[${queryEmbedding.join(',')}]`;

    // Perform vector similarity search
    // We select items where the distance is small (meaning high similarity)
    // Note: Cosine distance ranges from 0 (identical) to 2 (opposite).
    // We want distance < 1 - threshold basically.

    const results = await prisma.$queryRaw`
      SELECT id, "contentText", "contentType", "createdAt", 
             1 - ("embedding" <=> ${vectorString}::vector) as similarity
      FROM "ContextMemory"
      WHERE "userId" = ${userId}
      AND 1 - ("embedding" <=> ${vectorString}::vector) > ${similarityThreshold}
      ORDER BY similarity DESC
      LIMIT ${limit};
    `;

    return results as Array<{
      id: string;
      contentText: string;
      contentType: string;
      createdAt: Date;
      similarity: number;
    }>;

  } catch (error) {
    console.error('Error finding similar memories:', error);
    return [];
  }
}
