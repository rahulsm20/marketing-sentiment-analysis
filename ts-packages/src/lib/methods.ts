import { db } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import {
  conversationsTable,
  ConversationStatus,
  messagesTable,
  pdfDocumentsTable,
  productReviewsTable,
  productsTable,
  usersTable,
} from "./schema";
import type {
  CreateConversationResult,
  CreateMessageResult,
  CreatePdfDocumentResult,
  CreateProductResult,
  CreateProductReviewResult,
  CreateUserResult,
  GetConversationByIdResult,
  GetConversationsResult,
  GetMessagesResult,
  GetPdfDocumentsResult,
  GetProductByIdResult,
  GetProductReviewsResult,
  GetProductsResult,
  GetUserByIdResult,
  UpdateConversationResult,
} from "./types";

type ConversationStatusType =
  (typeof ConversationStatus)[keyof typeof ConversationStatus];

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function getProducts(filters?: {
  query?: string;
  company?: string;
  category?: string;
}): GetProductsResult {
  const rows = await db.select().from(productsTable);
  if (!filters) return rows;
  return rows.filter((p) => {
    if (filters.query && p.query !== filters.query) return false;
    if (filters.company && p.company !== filters.company) return false;
    if (filters.category && p.category !== filters.category) return false;
    return true;
  });
}

export async function getProductById(id: string): GetProductByIdResult {
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id));
  return rows[0];
}

export async function getProductReviews(
  productId: string,
): GetProductReviewsResult {
  return db
    .select()
    .from(productReviewsTable)
    .where(eq(productReviewsTable.productId, productId));
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function getUserById(id: string): GetUserByIdResult {
  const rows = await db.select().from(usersTable).where(eq(usersTable.id, id));
  return rows[0];
}

// ---------------------------------------------------------------------------
// Conversations
// ---------------------------------------------------------------------------

export async function getConversations(
  userId?: string,
): GetConversationsResult {
  if (userId) {
    return db
      .select()
      .from(conversationsTable)
      .where(eq(conversationsTable.userId, userId));
  }
  return db.select().from(conversationsTable);
}

export async function getConversationById(
  id: string,
): GetConversationByIdResult {
  const rows = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.id, id));
  return rows[0];
}

export async function deleteConversation(id: string) {
  const rows = await db
    .delete(conversationsTable)
    .where(eq(conversationsTable.id, id));
  return rows;
}
// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export async function getMessages(conversationId: string): GetMessagesResult {
  return db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, conversationId));
}

// ---------------------------------------------------------------------------
// PDF Documents
// ---------------------------------------------------------------------------

export async function getPdfDocuments(
  conversationId: string,
): GetPdfDocumentsResult {
  return db
    .select()
    .from(pdfDocumentsTable)
    .where(eq(pdfDocumentsTable.conversationId, conversationId))
    .orderBy(desc(pdfDocumentsTable.updatedAt));
}

// ---------------------------------------------------------------------------
// Create / Update — Products
// ---------------------------------------------------------------------------

export async function createProduct(data: {
  name?: string;
  url?: string;
  price?: number;
  query?: string;
  company?: string;
  category?: string;
}): CreateProductResult {
  const [row] = await db.insert(productsTable).values(data).returning();
  return row;
}

export async function createProductReview(data: {
  productId: string;
  reviewText?: string;
}): CreateProductReviewResult {
  const [row] = await db.insert(productReviewsTable).values(data).returning();
  return row;
}

// ---------------------------------------------------------------------------
// Create — Users
// ---------------------------------------------------------------------------

export async function createUser(data: {
  id: string;
  email: string;
}): CreateUserResult {
  const [row] = await db.insert(usersTable).values(data).returning();
  return row;
}

// ---------------------------------------------------------------------------
// Create / Update — Conversations
// ---------------------------------------------------------------------------

export async function createConversation(data: {
  query: string;
  userId: string;
  status?: ConversationStatusType;
  openai_convId?: string;
}): CreateConversationResult {
  const [row] = await db
    .insert(conversationsTable)
    .values({ ...data, status: data.status ?? ConversationStatus.PENDING })
    .returning();
  return row;
}

export async function updateConversation(data: {
  id: string;
  status: ConversationStatusType;
  userId?: string;
}): UpdateConversationResult {
  const conditions = [eq(conversationsTable.id, data.id)];
  const [row] = await db
    .update(conversationsTable)
    .set({ status: data.status })
    .where(conditions.length === 1 ? conditions[0] : conditions[0])
    .returning();
  return row;
}

// ---------------------------------------------------------------------------
// Create — Messages
// ---------------------------------------------------------------------------

export async function createMessage(data: {
  conversationId: string;
  userId?: string;
  content: string;
  role?: "user" | "assistant";
}): CreateMessageResult {
  const [row] = await db
    .insert(messagesTable)
    .values({ ...data, role: data.role ?? "user" })
    .returning();
  return row;
}

// ---------------------------------------------------------------------------
// Create — PDF Documents
// ---------------------------------------------------------------------------

export async function createPdfDocument(data: {
  conversationId: string;
  fileName?: string;
  filePath?: string;
}): CreatePdfDocumentResult {
  const [row] = await db.insert(pdfDocumentsTable).values(data).returning();
  return row;
}
