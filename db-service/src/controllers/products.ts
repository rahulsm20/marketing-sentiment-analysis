import { productsTable } from "@/lib/db/schema";
import { db } from "@/lib/db/tracking";
import { ilike } from "drizzle-orm/sql/expressions/conditions";
import { Product } from "../lib/models/product.model";
import { CACHE_KEY } from "../utils/constants";
import { cacheData, getCachedData } from "../utils/redis";

export const productController = {
  getById: async (id: string) => {
    const product = await Product.findById(id);
    return product;
  },
  getByQuery: async (query: string) => {
    if (!query) {
      throw new Error("Query parameter is required");
    }
    const joinedQuery = query.split(" ").join("+");
    const key = CACHE_KEY.PRODUCT_QUERY(joinedQuery);
    const cachedData = await getCachedData(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    const products = await db
      .select()
      .from(productsTable)
      .where(ilike(productsTable.query, joinedQuery))
      .limit(50);
    await cacheData(key, JSON.stringify(products), 3600);
    return products;
  },
};
