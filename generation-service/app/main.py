import asyncio
import base64
import json
import os
import re
from contextlib import asynccontextmanager
from fastapi.responses import JSONResponse
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from py_packages.lib.mutex import acquire, is_processing, set_status
from py_packages.lib.pubsub import subscribe
from app.core.generate import generate
from py_packages.lib.types import  PubSubEvent
from py_packages.utils.constants import PUBSUB_TOPICS

_IS_LOCAL = os.getenv("NODE_ENV", "development") == "development"

#########################################



load_dotenv()
gemini_model = genai.GenerativeModel("gemini-2.0-flash")


def _on_generation_event(data: dict) -> None:
    """
    Handles an incoming generation Pub/Sub event.
    Expected payload: { query, id }
    """

    id = data.get("id")
    query = data.get("query")

    if not query.strip("+"):
        print("Generation event received with no query/company/category — skipping.")
        return
    if is_processing(id):
        print(f"Conversation {id}:{query} is already processing")
        return
    set_status(id, "GENERATION", 500)
    print(f"Generation event received for query: {query}")
    asyncio.run(generate(query, id))

async def on_generation_event(data: dict) -> JSONResponse:
    """
    Handles an incoming generation Pub/Sub event.
    Expected payload: { query, id }
    """

    id = data.get("id")
    query = data.get("query")

    if not query.strip("+"):
        print("Generation event received with no query/company/category — skipping.")
        return
    if is_processing(id):
        print(f"Conversation {id}:{query} is already processing")
        return
    set_status(id, "GENERATION", 500)
    print(f"Generation event received for query: {query}")
    return await generate(query, id)


@asynccontextmanager
async def lifespan(app: FastAPI):
    if _IS_LOCAL:
        subscribe(PUBSUB_TOPICS["GENERATION"], _on_generation_event)
    yield


class LLM:
    def __init__(self, model_name):
        self.model = genai.GenerativeModel(model_name)

    def generate_text(self, text):
        response = self.model.generate_content(text)
        return response.text


token_auth_scheme = HTTPBearer()

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


@app.get("/")
async def read_root():
    return {"message": "Generation Service is up and running!"}


@app.post("/strategies")
async def generate_strategies(request: Request):
    body = await request.json()
    query = body.get("query")
    id = body.get("id")
    if not query:
        return JSONResponse(content={"message": "Query is required."}, status_code=400)
    company = query.split("+")[0]
    category = query.split("+")[1]
    if not company or not category:
        return JSONResponse(
            content={"message": "Company and category are required."}, status_code=400
        )
    return await generate(query, id)

@app.post("/trigger")
async def trigger_generation(event: PubSubEvent):
    """
    Endpoint to trigger an embedding for a specific query.
    """
    return await on_generation_event(event.model_dump())
