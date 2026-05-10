import { searchProductsVectors } from "@/shared/src/lib/pinecode";
import { Request, Response } from "express";

export const fillMissingDataInVectors = async (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Query is required" });
  const vectors = await searchProductsVectors(query as string);
  const reviews = vectors.map((vector) => vector.review);
  return res.status(200).json({ reviews, count: reviews.length });
};
