"""
Embedding Service API
This service provides an API for generating embeddings from text inputs.
"""

from fastapi import APIRouter, FastAPI, FastAPI
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.embeddings import embed

token_auth_scheme = HTTPBearer()

app = FastAPI()
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
