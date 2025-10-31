import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const ConversationStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  SCRAPING: "scraping",
  GENERATION: "generation",
  EMBEDDING: "embedding",
} as const;

const ConversationStatusEnum = [
  ConversationStatus.PENDING,
  ConversationStatus.IN_PROGRESS,
  ConversationStatus.COMPLETED,
  ConversationStatus.SCRAPING,
  ConversationStatus.GENERATION,
  ConversationStatus.EMBEDDING,
] as const;

export const usersTable = pgTable("users_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const conversationsTable = pgTable("conversations_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  query: text("query"),
  userId: uuid("user_id").references(() => usersTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  status: text({ enum: ConversationStatusEnum })
    .notNull()
    .default(ConversationStatus.PENDING),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const messagesTable = pgTable("messages_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").references(
    () => conversationsTable.id
  ),
  content: text("content"),
  role: text("role"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});
