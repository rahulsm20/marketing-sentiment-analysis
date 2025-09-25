import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    cardURL: { type: String },
    company: { type: String },
    category: { type: String },
    productName: { type: String },
    sponsored: { type: String },
    badge: { type: String },
    price: { type: String },
    basePrice: { type: String },
    rating: { type: String },
    ratingsNumber: { type: String },
    boughtPastMonth: { type: String },
    reviews: [{ type: String }],
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);
