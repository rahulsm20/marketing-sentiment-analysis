import {
  doublePrecision,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

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

const MessageRoleEnum = ["user", "assistant"] as const;

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const conversationsTable = pgTable(
  "conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    openai_convId: text("openai_conv_id").unique(),
    query: text("query"),
    userId: uuid("user_id").references(() => usersTable.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    status: text({ enum: ConversationStatusEnum })
      .notNull()
      .default(ConversationStatus.PENDING),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("conversations_openai_conv_id_index").on(table.openai_convId),
    index("conversations_user_id_index").on(table.userId),
  ]
);

export const messagesTable = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id").references(
      () => conversationsTable.id
    ),
    userId: uuid("user_id").references(() => usersTable.id),
    content: text("content"),
    role: text({ enum: MessageRoleEnum }).notNull().default("user"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("messages_conversation_id_index").on(table.conversationId),
    index("messages_user_id_index").on(table.userId),
  ]
);

export const pdfDocumentsTable = pgTable(
  "pdf_documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id").references(
      () => conversationsTable.id
    ),
    fileName: text("file_name"),
    filePath: text("file_path"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("pdf_documents_conversation_id_index").on(table.conversationId),
  ]
);

export const productsTable = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  url: text("url"),
  price: doublePrecision("price"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const productReviewsTable = pgTable(
  "product_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").references(() => productsTable.id),
    reviewText: text("review_text"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },

  (table) => [index("product_reviews_product_id_index").on(table.productId)]
);
