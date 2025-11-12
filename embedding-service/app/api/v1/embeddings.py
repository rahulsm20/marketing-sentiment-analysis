from datetime import datetime
from app.core.db import pc
from langchain_pinecone import PineconeEmbeddings
from app.lib.db_service import db_service

# ---------------------------------------------------------------------------

embeddings = PineconeEmbeddings(model="llama-text-embed-v2")
index_name = "market-sentience-product-embeddings"

# ---------------------------------------------------------------------------


async def embed_text(text: str) -> list[float]:
    return embeddings.embed_query(text)


# ---------------------------------------------------------------------------


async def embed(query: str = None):
    print(f"Embedding products for query: {query}")
    start = datetime.now()
    if not query:
        """
        Function to create an index for embedding if it does not exist.
        """
        if not pc.has_index(index_name):
            index = pc.create_index_for_model(
                name=index_name,
                cloud="aws",
                region="us-east-1",
                embed={
                    "model": "llama-text-embed-v2",
                    "field_map": {"text": "chunk_text"},
                },
            )
            return {"message": "Embedding index created."}

        index = pc.Index(name=index_name)

        return {
            "message": "Embedding index already exists.",
            "stats": index.describe_index_stats().to_dict(),
        }
    else:
        products = await db_service.get_products_by_query(query)
        if "error" in products:
            return {"message": "Error fetching products.", "details": products}
        if not products:
            return {"message": "No new products to embed."}
        vectors = []

        for product in products:
            text = f"{product['productName']}"
            for review in product.get("reviews", []):
                text += f"{review}"
            vector = await embed_text(text)
            vectors.append(
                {
                    "id": str(product["_id"]),
                    "values": vector,
                    "metadata": {
                        "query": query,
                        "title": product["productName"],
                        "reviews": product.get("reviews", []),
                        "price": product.get("price", 0),
                        "url": product.get("productUrl", ""),
                    },
                }
            )

        index = pc.Index(name=index_name)
        index.upsert(vectors)

        end = datetime.now()
        duration = end - start

        return {
            "message": f"Embedded {len(vectors)} products for query {query}.",
            "duration": duration.total_seconds(),
            "embedded_count": len(vectors),
        }
