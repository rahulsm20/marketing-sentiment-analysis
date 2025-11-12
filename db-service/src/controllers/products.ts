import { Product } from "../lib/models/product.model";

export const productController = {
  getById: async (id: string) => {
    const product = await Product.findById(id);
    return product;
  },
  getByQuery: async (query: string) => {
    const joinedQuery = query.split(" ").join("+");
    const products = await Product.find({
      query: joinedQuery,
    });
    return products;
  },
};
