import { and, eq } from "drizzle-orm";
import { ConversationStatusType } from "../../types";
import { conversationsTable } from "../lib/db/schema";
import { db } from "../lib/db/tracking";
import { openaiClient } from "../lib/openai";

/**
 * Controller for managing conversations in the database.
 * Includes methods for retrieving, creating, updating, and deleting conversations.
 */
export const conversationController = {
  /**
   * Function to get a conversation by its ID and user ID.
   * @param id The ID of the conversation to retrieve.
   * @param userId
   * @returns
   */
  getById: async (id: string, userId: string) => {
    const conv = await db
      .select()
      .from(conversationsTable)
      .where(
        and(
          eq(conversationsTable.userId, userId),
          eq(conversationsTable.id, id)
        )
      );
    return conv;
  },
  /**
   * Function to create or update a conversation.
   * @param id Optional ID of the conversation to update.
   * @param query The query string for the conversation.
   * @param status The status of the conversation (default is "pending").
   * @param userId The ID of the user associated with the conversation.
   * @returns
   */
  create: async ({
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
    const openai_conversation = await openaiClient.conversations.create();
    if (!openai_conversation.id) {
      throw new Error("Failed to create OpenAI conversation");
    }
    const conv = await db
      .insert(conversationsTable)
      .values({
        query,
        status,
        userId,
        openai_convId: openai_conversation.id,
      })
      .returning();
    return conv;
  },
  update: async ({
    id,
    status,
    userId,
  }: {
    id: string;
    status: ConversationStatusType;
    userId: string;
  }) => {
    if (id) {
      const conv = await db
        .update(conversationsTable)
        .set({
          status,
        })
        .where(
          and(
            eq(conversationsTable.id, id),
            eq(conversationsTable.userId, userId)
          )
        )
        .returning();
      return conv;
    }
  },
  delete: async () => {},
};
