import { Document, Types } from "mongoose";
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

export interface IUser extends Document {
  userId?: string | null | undefined;
  conversations: Types.ObjectId[]; // or Types.ObjectId[] if you only store IDs
  createdAt: Date;
  updatedAt: Date;
}
