import { getProducts } from "@/shared/src/lib/methods";

/**
 * Use to search products from postgresql db
 * @param query
 * @param sortBy
 * @returns
 */
export const searchProductsTool = async (
  query: string,
  sortBy?: "createdAt" | "price" | "name",
) => {
  return await getProducts({ query, sortBy });
};

export const getMostLikedProducts = async (take = 10) => {
  return await getProducts({ sortBy: "name", take });
};
