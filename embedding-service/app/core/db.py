from pinecone import Pinecone
from pymongo import MongoClient
from app.core.config import config

# Initialize MongoDB client
client = MongoClient(config["MONGO_URI"])
mongodb = client[config["MONGO_DB_NAME"]]

res = client.admin.command('ping')  # Check if the connection is successful

if res.get('ok') == 1:
    print(">> Successfully connected to MongoDB")

pc = Pinecone(api_key=config["PINECONE_API_KEY"])
