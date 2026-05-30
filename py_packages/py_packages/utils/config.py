from dotenv import load_dotenv
import os

CONFIG = {
    "SERVICE": os.getenv("SERVICE", "Unknown"),
    "PORT": os.getenv("PORT", 3000),
}