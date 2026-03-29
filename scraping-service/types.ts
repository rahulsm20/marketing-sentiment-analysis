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

export type CardType = {
  cardURL: string;
  productName: string;
  sponsored: string;
  badge: string;
  price: string;
  basePrice: string;
  rating: string;
  ratingsNumber: string;
  boughtPastMonth: string;
  query: string;
  reviews?: string[];
  ratingsCount?: number;
};
