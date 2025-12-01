from dotenv import load_dotenv
import os

load_dotenv()

config = {"REDIS_URL": os.getenv("REDIS_URL")}
