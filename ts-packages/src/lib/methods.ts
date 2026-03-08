import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { ConversationStatus } from "./schema";

type ConversationStatusType = (typeof ConversationStatus)[keyof typeof ConversationStatus];
import {
  conversationsTable,
  messagesTable,
  pdfDocumentsTable,
  productReviewsTable,
  productsTable,
  usersTable,
} from "./schema";

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function getProducts(filters?: {
  query?: string;
  company?: string;
  category?: string;
}) {
  const rows = await db.select().from(productsTable);
  if (!filters) return rows;
  return rows.filter((p) => {
    if (filters.query && p.query !== filters.query) return false;
    if (filters.company && p.company !== filters.company) return false;
    if (filters.category && p.category !== filters.category) return false;
    return true;
  });
}

export async function getProductById(id: string) {
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id));
  return rows[0];
}

export async function getProductReviews(productId: string) {
  return db
    .select()
    .from(productReviewsTable)
    .where(eq(productReviewsTable.productId, productId));
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function getUserById(id: string) {
  const rows = await db.select().from(usersTable).where(eq(usersTable.id, id));
  return rows[0];
}

export async function getUserByEmail(email: string) {
  const rows = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  return rows[0];
}

// ---------------------------------------------------------------------------
// Conversations
// ---------------------------------------------------------------------------

export async function getConversations(userId?: string) {
  if (userId) {
    return db
      .select()
      .from(conversationsTable)
      .where(eq(conversationsTable.userId, userId));
  }
  return db.select().from(conversationsTable);
}

export async function getConversationById(id: string) {
  const rows = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.id, id));
  return rows[0];
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export async function getMessages(conversationId: string) {
  return db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, conversationId));
}

// ---------------------------------------------------------------------------
// PDF Documents
// ---------------------------------------------------------------------------

export async function getPdfDocuments(conversationId: string) {
  return db
    .select()
    .from(pdfDocumentsTable)
    .where(eq(pdfDocumentsTable.conversationId, conversationId));
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
}) {
  const [row] = await db.insert(productsTable).values(data).returning();
  return row;
}

export async function createProductReview(data: {
  productId: string;
  reviewText?: string;
}) {
  const [row] = await db.insert(productReviewsTable).values(data).returning();
  return row;
}

// ---------------------------------------------------------------------------
// Create — Users
// ---------------------------------------------------------------------------

export async function createUser(data: { name?: string; email: string }) {
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
}) {
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
}) {
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
}) {
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
}) {
  const [row] = await db.insert(pdfDocumentsTable).values(data).returning();
  return row;
}
