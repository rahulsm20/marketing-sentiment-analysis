"""
Embedding Service API
This service provides an API for generating embeddings from text inputs.
"""

import asyncio
import os
from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer

from app.api.v1.embeddings import embed
from py_packages.lib.pubsub import subscribe
from py_packages.lib.mutex import acquire, release, get_status, set_status, is_processing

_IS_LOCAL = os.getenv("NODE_ENV", "development") == "development"
# 
###################################

EMBEDDING_TOPIC = "market_sentience_embedding"

token_auth_scheme = HTTPBearer()


def _on_embedding_event(data: dict) -> None:
    """
    Handles an incoming embedding Pub/Sub event.
    Expected payload: { company, category, conversationId }
    """
    company = data.get("company", "")
    category = data.get("category", "")
    query = data.get("query") or f"{company}+{category}"
    id = data.get("id")
    if not query.strip("+"):
        print("Embedding event received with no query/company/category — skipping.")
        return
    if is_processing(id):
        print(f"Conversation {id}:{query} is already processing")
        return
    if acquire(id):
        print(f"Conversation {id}:{query} is already processing")
        return
    set_status(id, "EMBEDDING")
    print(f"Embedding event received for query: {query}")
    asyncio.run(embed(query, conversation_id=id))


@asynccontextmanager
async def lifespan(app: FastAPI):
    if _IS_LOCAL:
        subscribe(EMBEDDING_TOPIC, _on_embedding_event)
    yield


app = FastAPI(lifespan=lifespan)
app_router = APIRouter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


@app_router.get("/health")
async def health_check():
    """
    Health check endpoint to verify the service is running.
    """
    return {"status": "ok", "message": "Embedding Service is running."}


@app_router.get("/embed")
async def create_embedding(query: str):
    """
    Endpoint to create an embedding for a specific query.
    """
    response = await embed(query)
    return response


@app_router.get("/")
async def read_root():
    return {
        "message": "Embedding Service API",
        "version": "1.0.0",
        "documentation_url": "/docs",
    }


app.include_router(app_router)
