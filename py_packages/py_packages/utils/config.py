from dotenv import load_dotenv
import os

CONFIG = {
    "SERVICE": os.getenv("SERVICE", "Unknown"),
    "PORT": os.getenv("PORT", 3000),
    "GOOGLE_PUBSUB_PROJECT_ID": os.getenv("GOOGLE_PUBSUB_PROJECT_ID", "Unknown"),
    "GOOGLE_API_KEY": os.getenv("GOOGLE_API_KEY", "Unknown"),
    "NODE_ENV": os.getenv("NODE_ENV", "development"),
}