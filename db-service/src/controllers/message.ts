import { and, eq, sql } from "drizzle-orm";
import { Request, Response } from "express";
import { conversationsTable, messagesTable } from "../lib/db/schema";
import { db } from "../lib/db/tracking";

export const messageController = {
  getMessagesByConversationId: async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const userId = req.user?.login;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const messages = await db
      .select()
      .from(messagesTable)
      .where(
        and(
          eq(messagesTable.conversationId, conversationId),
          eq(messagesTable.userId, userId)
        )
      )
      .orderBy(sql`created_at ASC`);
    return messages;
  },
  addMessage: async (req: Request, res: Response) => {
    console.log("hiii");
    let { conversationId, content, role } = req.body;
    const userId = req.user?.login;
    console.log({ reqBody: req.body, userId });
    // if (!userId) return res.status(401).json({ error: "Unauthorized" });

    if (!conversationId) {
      const title = content.slice(0, 20);
      const newConversation = await db
        .insert(conversationsTable)
        .values({ userId, query: title })
        .returning();
      conversationId = newConversation[0].id;
    }
    const [newMessage] = await db
      .insert(messagesTable)
      .values({
        conversationId,
        userId,
        content,
        role,
      })
      .returning();
    return newMessage;
  },
};
