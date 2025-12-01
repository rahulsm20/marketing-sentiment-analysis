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
        "GOOGLE_CLOUD_PROJECT_ID": os.getenv("GOOGLE_CLOUD_PROJECT_ID"),
        "PUBSUB_TOPIC": os.getenv("PUBSUB_TOPIC"),
        "CORS_ORIGINS": (
            os.getenv("CORS_ORIGINS", "").split(",")
            if os.getenv("CORS_ORIGINS")
            else "*"
        ),
    }


config = load_config()
