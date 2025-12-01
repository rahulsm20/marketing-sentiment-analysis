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
    const products = await Product.find({
      query: joinedQuery,
    }).limit(10);
    await cacheData(key, JSON.stringify(products), 3600);
    return products;
  },
};
