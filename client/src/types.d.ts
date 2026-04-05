export type ProductData = {
  cardURL: string;
  productName: string;
  price: string;
  rating: string;
  reviews: string[];
  basePrice: string;
  ratingsCount: number;
};

export type MessageType = {
  content: string;
  role: string;
  id: string;
  conversationId: string;
};

export type ConversationItem = {
  id: string;
  query: string;
  status: "pending" | "completed" | "failed";
  messages: MessageType[];
};
