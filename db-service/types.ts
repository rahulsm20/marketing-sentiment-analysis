export enum LinkPrecedence {
  primary = "primary",
  secondary = "secondary",
}

export type Contact = {
  phoneNumber: string | null;
  email: string | null;
  linkPrecedence?: LinkPrecedence;
  createdAt?: Date;
  updatedAt?: Date;
  id?: number;
  linkedId?: number | null;
};

export type ConversationStatusType =
  | "pending"
  | "in_progress"
  | "completed"
  | "scraping"
  | "generation"
  | "embedding";
