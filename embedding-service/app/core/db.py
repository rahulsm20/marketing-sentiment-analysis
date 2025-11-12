from pinecone import Pinecone
from app.core.config import config

pc = Pinecone(api_key=config["PINECONE_API_KEY"])
