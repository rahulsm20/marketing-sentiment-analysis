from .utils import fetch_url
from app.core import config
from py_packages.lib.logger import logger

class DBService:
    def __init__(self, db_connection_string=config.config["DB_SERVICE_URL"]):
        self.db_connection_string = db_connection_string

    async def get_conversation_by_id(self, id):
        try:
            res = await fetch_url(self.db_connection_string + f"/conversations/{id}")
            return res
        except Exception as e:
            logger.error(f"Error fetching conversation by ID {id}: {e}")
            return None

    async def get_conversation_by_query(self, query):
        res = await fetch_url(
            self.db_connection_string + f"/conversations?query={query}"
        )
        return res

    async def update_conversation(self, data):
        try:
            res = await fetch_url(
                self.db_connection_string + "/conversations/",
                method="POST",
                json=data,
            )
            return res
        except Exception as e:
            logger.error(f"Error updating conversation: {e}")
            return None

    async def get_products_by_query(self, query):
        try:
            res = await fetch_url(
                self.db_connection_string + f"/products?query={query}"
            )
            return res
        except Exception as e:
            logger.error(f"Error fetching products for query {query}: {e}")
            return None


db_service = DBService()
