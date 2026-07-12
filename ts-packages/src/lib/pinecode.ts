import { config } from "@/config";
import { Pinecone } from "@pinecone-database/pinecone";

const EMBEDDING_INDEX_NAME = "market-sentience-product-embeddings";

const pc = new Pinecone({ apiKey: config.PINECONE_API_KEY });

const pineconeIndex = pc.index({ name: EMBEDDING_INDEX_NAME });

export async function searchProductsVectors(query: string) {
  if (!query) return [];
  const [company, category] = query.split("+");

  const response = await pineconeIndex.searchRecords({
    namespace: "__default__",
    query: {
      inputs: {
        text: query, // same as Python
      },
      filter: {
        company: { $eq: company },
        category: { $eq: category },
      },
      topK: 4,
    },
    fields: [
      "company",
      "title",
      "review",
      "category",
      "price",
      "url",
      "product_id",
    ],
    rerank: {
      model: "bge-reranker-v2-m3",
      topN: 2,
      rankFields: ["company"],
    },
  });
  const goodRecords = response.result.hits.filter((r: any) => {
    const review = r.fields?.review || "";
    return review && review.trim() !== "";
  });
  // const badRecords = response.result.hits.filter((r: any) => {
  //   const review = r.fields?.review || "";
  //   return !review || review.trim() === "";
  // });

  const hits =
    goodRecords.map((hit: any) => ({
      id: hit.fields?.product_id || "",
      title: hit.fields?.title || "",
      score: hit._score,
      review: hit.fields?.review || "",
      price: hit.fields?.price || 0,
      url: hit.fields?.url || "",
    })) || [];

  return hits;
}
