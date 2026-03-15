import type {
  conversationsTable,
  messagesTable,
  pdfDocumentsTable,
  productReviewsTable,
  productsTable,
  usersTable,
} from "./schema";

// ---------------------------------------------------------------------------
// Row types (inferred from Drizzle schema)
// ---------------------------------------------------------------------------

export type User = typeof usersTable.$inferSelect;
export type Conversation = typeof conversationsTable.$inferSelect;
export type Message = typeof messagesTable.$inferSelect;
export type PdfDocument = typeof pdfDocumentsTable.$inferSelect;
export type Product = typeof productsTable.$inferSelect;
export type ProductReview = typeof productReviewsTable.$inferSelect;

// ---------------------------------------------------------------------------
// Return types for methods.ts
// ---------------------------------------------------------------------------

// Products
export type GetProductsResult = Promise<Product[]>;
export type GetProductByIdResult = Promise<Product | undefined>;
export type GetProductReviewsResult = Promise<ProductReview[]>;
export type CreateProductResult = Promise<Product | undefined>;
export type CreateProductReviewResult = Promise<ProductReview | undefined>;

// Users
export type GetUserByIdResult = Promise<User | undefined>;
export type GetUserByEmailResult = Promise<User | undefined>;
export type CreateUserResult = Promise<User | undefined>;

// Conversations
export type GetConversationsResult = Promise<Conversation[]>;
export type GetConversationByIdResult = Promise<Conversation | undefined>;
export type CreateConversationResult = Promise<Conversation | undefined>;
export type UpdateConversationResult = Promise<Conversation | undefined>;

// Messages
export type GetMessagesResult = Promise<Message[]>;
export type CreateMessageResult = Promise<Message | undefined>;

// PDF Documents
export type GetPdfDocumentsResult = Promise<PdfDocument[]>;
export type CreatePdfDocumentResult = Promise<PdfDocument | undefined>;

export type Auth0User = {
  sub: string;
  given_name: string;
  email: string;
  nickname: string;
  picture: string;
};
