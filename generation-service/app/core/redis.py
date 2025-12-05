import redis
from app.core.config import config
from app.utils.constants import CACHE_KEY


class RedisClient:
    def __init__(self):
        if not config["REDIS_URL"]:
            raise ValueError("REDIS_URL is not set in the configuration")
        self.connected = False
        self.client = redis.Redis(
            connection_pool=redis.ConnectionPool().from_url(config["REDIS_URL"])
        )

    def disconnect(self):
        # Simulate disconnecting from Redis server
        self.connected = False
        print("Disconnected from Redis")

    def connect(self):
        # Simulate connecting to Redis server
        self.connected = True
        print("Connected to Redis")

    def is_connected(self) -> bool:
        return self.connected

    def get(self, key: str):
        if not self.connected:
            # raise ConnectionError("Not connected to Redis")
            self.connect()
        # Simulate getting a value from Redis
        print(f"Getting value for key: {key}")
        res = self.client.get(key)
        return res

    def set(self, key: str, data: str):
        if not self.connected:
            self.connect()
        # Simulate getting a value from Redis
        print(f"Setting value for key: {key}")
        res = self.client.set(key, data)
        return res


redis_client = RedisClient()
