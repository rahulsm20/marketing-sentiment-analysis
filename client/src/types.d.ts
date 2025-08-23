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
  data: string;
  sender: string;
  _id: string;
};

export type ConversationItem = {
  _id: string;
  query: string;
  status: "pending" | "completed" | "failed";
  messages: MessageType[];
};
