from datetime import datetime
import json
from re import search
import stat

import aiohttp
import sqlmodel
from app.core.db import pc
from langchain_pinecone import PineconeEmbeddings

# from app.lib.db_service import db_service
from py_packages.lib.mutex import release
from py_packages.lib.pubsub import publish
from py_packages.lib.methods import get_products
from py_packages.lib.db import engine
from sqlmodel import Session
from app.core.db import pc
from fastapi.responses import JSONResponse

from py_packages.lib.methods import ConversationStatus, update_conversation
from py_packages.utils.constants import PUBSUB_TOPICS

# --------------------------------------------------------------------------
embeddings = PineconeEmbeddings(model="llama-text-embed-v2")
index_name = "market-sentience-product-embeddings"

# ---------------------------------------------------------------------------


async def embed_text(text: str) -> list[float]:
    return embeddings.embed_query(text)


# ---------------------------------------------------------------------------


async def embed(query: str = None, conversation_id: str = None):
    try:
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

            index = pc.Index(name=index_name)

        else:
            if pc:
                index = pc.Index(name=index_name)
                print(f"Searching for query: {query}")
                search_with_text = index.search(
                    namespace="__default__",
                    query={"inputs": {"text": query}, "top_k": 4},
                    fields=["query", "title", "review",
                            "price", "url", "product_id"],
                    rerank={
                        "model": "bge-reranker-v2-m3",
                        "top_n": 2,
                        "rank_fields": ["review"],
                    },
                )

                compnay, category = query.split("+")
                all_hits = search_with_text["result"]["hits"]
                filtered_hits = [x for x in all_hits if x.fields.get("company").lower() == compnay.lower() and x.fields.get("category").to_lower() == category.lower()]
                print("filtered_hits:", filtered_hits)
                if (
                    all_hits and 
                   len(filtered_hits) > 0
                ):
                    hits = [
                        {
                            "id": hit.fields.get("product_id", ""),
                            "title": hit.fields.get("title", ""),
                            "score": hit._score,
                            "review": hit.fields.get("review", []),
                            "price": hit.fields.get("price", 0),
                            "url": hit.fields.get("url", ""),
                        }
                        for hit in search_with_text["result"]["hits"]
                    ]
                    end = datetime.now()
                    duration = end - start
                    
                    with Session(engine) as session:
                        update_conversation(
                            session=session,
                            conversation_id=conversation_id,
                            status="generation",
                        )
                    publish(
                        topic=PUBSUB_TOPICS["GENERATION"],
                        data={
                            "query": query,
                            "id": conversation_id,
                        },
                    )
                    return JSONResponse(
                        content={"message": "Embeddings found.", "data": hits},
                        status_code=200,
                    ) 
                else:
                    with Session(engine) as session:
                        products = get_products(session, query=query)
                        if not products:
                            return {"message": "No new products to embed."}
                        vectors = []
                        print("products: ", products)
                        for product in products:
                            text = f"{product.name}"
                            review_text = None
                            for review in product.product_reviews:
                                review_text = review.review_text
                                if review_text:
                                    text += f"{review_text}"
                            vector = await embed_text(review_text)
                            # print("ingested: ", product.name)
                            if not product.product_reviews or len(product.product_reviews) == 0:
                                continue
                            metadata = {
                                "product_id": str(product.id),
                                "title": product.name,
                                "price": product.price,
                                "url": product.url,
                                "company": product.company,
                                "category": product.category,
                            }
                            if review_text:
                                metadata["review"] = review_text
                            vectors.append(
                                {
                                    "id": str(product.id),
                                    "values": vector,
                                    "metadata": metadata,
                                }
                            )

                    index = pc.Index(name=index_name)
                    index.upsert(vectors)

                    end = datetime.now()
                    duration = end - start
                    with Session(engine) as session:
                        update_conversation(
                            session=session,
                            conversation_id=conversation_id,
                            status="generation",
                        )
                    publish(
                        topic=PUBSUB_TOPICS["GENERATION"],
                        data={
                            "query": query,
                            "id": conversation_id,
                        },
                    )
                    release(conversation_id)
                    return JSONResponse({
                        "message": f"Embedded {len(vectors)} products for query {query}.",
                        "duration": duration.total_seconds(),
                        "embedded_count": len(vectors),
                    })
    except Exception as e:
        print(f"Error embedding: {e}")
        return JSONResponse(content={"message": "Error embedding."}, status_code=500)


# async def truncate_embeddings():
#     if pc:
#         index = pc.Index(name=index_name)
#         index.delete(delete_all=True, namespace="__default__")
#         return {"message": "All embeddings deleted from the index."}
#     return {"message": "Pinecone client not initialized."}
