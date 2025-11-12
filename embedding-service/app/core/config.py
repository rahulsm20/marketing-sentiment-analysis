from dotenv import load_dotenv
import os


def load_config():
    load_dotenv()
    return {
        "GEMINI_API_KEY": os.getenv("GEMINI_API_KEY"),
        "PROMPT": os.getenv("PROMPT"),
        "PORT": int(os.getenv("PORT", 8000)),
        "PINECONE_API_KEY": os.getenv("PINECONE_API_KEY"),
        "MONGO_URI": os.getenv("MONGO_URI"),
        "MONGO_DB_NAME": os.getenv("MONGO_DB_NAME"),
        "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY"),
        "DB_SERVICE_URL": os.getenv("DB_SERVICE_URL"),
    }


config = load_config()
