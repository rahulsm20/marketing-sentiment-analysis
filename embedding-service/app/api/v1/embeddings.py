from datetime import datetime
import json
from re import search
import stat
from app.core.db import pc
from langchain_pinecone import PineconeEmbeddings

# from app.lib.db_service import db_service
from py_packages.lib.pubsub import publish
from py_packages.lib.methods import get_products 
from app.core.db import pc
from fastapi.responses import JSONResponse
from app.db_service.db_service_client.api.default_api import (
    DefaultApi as db_service,
)

# --------------------------------------------------------------------------

embeddings = PineconeEmbeddings(model="llama-text-embed-v2")
index_name = "market-sentience-product-embeddings"

# ---------------------------------------------------------------------------


async def embed_text(text: str) -> list[float]:
    return embeddings.embed_query(text)


# ---------------------------------------------------------------------------


async def embed(query: str = None):
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
        if pc:
            index = pc.Index(name=index_name)
            search_with_text = index.search(
                namespace="__default__",
                query={"inputs": {"text": query}, "top_k": 4},
                fields=["query", "title", "review", "price", "url"],
                rerank={
                    "model": "bge-reranker-v2-m3",
                    "top_n": 2,
                    "rank_fields": ["review"],
                },
            )
            if (
                search_with_text["result"]["hits"]
                and len(search_with_text["result"]["hits"]) > 0
            ):
                hits = [
                    {
                        "id": hit.fields.get("product_id", ""),
                        "title": hit.fields.get("title", ""),
                        "score": hit._score,
                        "review": hit.fields.get("review", []),
                        "price": int("".join(hit.fields.get("price", "0").split(","))),
                        "url": hit.fields.get("url", ""),
                    }
                    for hit in search_with_text["result"]["hits"]
                ]
                message = (
                    '{"message": "Embeddings found.", "data": ' + json.dumps(hits) + "}"
                )
                end = datetime.now()
                duration = end - start
                publish(
                    message=f"{message}",
                    query=f"{query}".encode("utf-8"),
                    embedded_count=f"{len(hits)}".encode("utf-8"),
                    duration=f"{duration.total_seconds()}".encode("utf-8"),
                )
                return JSONResponse(
                    content={"message": "Embeddings found.", "data": hits},
                    status_code=200,
                )
            return JSONResponse(
                content={"message": "No embeddings found."},
                status_code=404,
            )
        products = await get_products(query=query)
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
                        "product_id": str(product["_id"]),
                        "title": product["productName"],
                        "review": review,
                        "price": product.get("price", 0),
                        "url": product.get("productUrl", ""),
                    },
                }
            )

        index = pc.Index(name=index_name)
        index.upsert(vectors)

        end = datetime.now()
        duration = end - start
        publish(
            message=f"Embedded {len(vectors)} products for query {query}.",
            query=query,
            embedded_count=len(vectors),
            duration=duration.total_seconds(),
        )

        return {
            "message": f"Embedded {len(vectors)} products for query {query}.",
            "duration": duration.total_seconds(),
            "embedded_count": len(vectors),
        }


# async def truncate_embeddings():
#     if pc:
#         index = pc.Index(name=index_name)
#         index.delete(delete_all=True, namespace="__default__")
#         return {"message": "All embeddings deleted from the index."}
#     return {"message": "Pinecone client not initialized."}
