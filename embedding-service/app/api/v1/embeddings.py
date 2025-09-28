from app.core.db import mongodb, pc
from bson import ObjectId
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore

# ---------------------------------------------------------------------------

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
index_name = "market-sentience-product-embeddings"

# ---------------------------------------------------------------------------


async def embed_text(text: str) -> list[float]:
    return embeddings.embed_query(text)


# ---------------------------------------------------------------------------


async def embed(conversation_id: str = None):
    print(f"Embedding products for conversation ID: {conversation_id}")
    if not conversation_id:
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
        # fetch all query data related to the conversation_id
        print(f"Fetching conversation with ID: {conversation_id}")
        conversation = mongodb.conversations.find_one(
            {"_id": ObjectId(conversation_id)}
        )

        if not conversation:
            return {"error": "Conversation not found."}

        query = conversation.get("query", "")
        if not query:
            return {"message": "No query found for the conversation."}

        products = list(mongodb.products.find({"query": query.lower()}))
        # print(products)
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
                        "conversationId": conversation_id,
                        "title": product["productName"],
                    },
                }
            )

            # mark product as embedded in Mongo
            mongodb.products.update_one(
                {"_id": product["_id"]}, {"$set": {"embedded": True}}
            )

        index = pc.Index(name=index_name)
        # upsert all vectors to Pinecone
        index.upsert(vectors)

        return {
            "message": f"Embedded {len(vectors)} products for conversation {conversation_id}."
        }
