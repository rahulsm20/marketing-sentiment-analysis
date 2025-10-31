import { eq } from "drizzle-orm";
import { ConversationStatusType } from "../../types";
import { conversationsTable } from "../lib/db/schema";
import { db } from "../lib/db/tracking";

export const conversationController = {
  getById: async (id: string) => {
    const conv = await db
      .select()
      .from(conversationsTable)
      .where(eq(conversationsTable.id, id));
    return conv;
  },
  createUpdate: async ({
    id,
    query,
    status = "pending",
    userId,
  }: {
    id?: string;
    query: string;
    status?: ConversationStatusType;
    userId: string;
  }) => {
    if (id) {
      const conv = await db
        .update(conversationsTable)
        .set({
          query,
          status,
          userId,
        })
        .where(eq(conversationsTable.id, id))
        .returning();
      return conv;
    }

    const conv = await db
      .insert(conversationsTable)
      .values({
        query,
        status,
        userId,
      })
      .returning();
    return conv;
  },
  delete: async () => {},
};
