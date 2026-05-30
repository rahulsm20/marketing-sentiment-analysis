from .utils import fetch_url
from app.core import config
from py_packages.lib.logger import logger

class LoggingService:
    def __init__(self, db_connection_string=config.config["DB_SERVICE_URL"]):
        self.db_connection_string = db_connection_string

    async def send_log(self, level, message):
        try:
            res = await fetch_url(
                self.db_connection_string + f"/logs",
                method="POST",
                json={"level": level, "message": message},
            )
            return res
        except Exception as e:
            logger.error(f"Error sending log with level {level} and message {message}: {e}")
            return None


logging_service = LoggingService()
