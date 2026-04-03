import logging
import os
from datetime import datetime, timezone
from typing import Optional


class ElasticsearchHandler(logging.Handler):
    """
    Logging handler that indexes records directly into Elasticsearch.
    Silently skips if the `elasticsearch` package is not installed or if
    ELASTICSEARCH_URL is not set.
    """

    def __init__(self, service: str) -> None:
        super().__init__()
        self._client = None
        self._service = service
        self._index = f"logs-{service}"

        es_url = os.getenv("ELASTICSEARCH_URL")
        if not es_url:
            return

        try:
            from elasticsearch import Elasticsearch

            self._client = Elasticsearch(
                es_url,
                basic_auth=(
                    os.getenv("ELASTICSEARCH_USERNAME", "elastic"),
                    os.getenv("ELASTICSEARCH_PASSWORD", ""),
                ),
            )
        except ImportError:
            pass

    def emit(self, record: logging.LogRecord) -> None:
        if self._client is None:
            return
        try:
            self._client.index(
                index=self._index,
                document={
                    "@timestamp": datetime.now(timezone.utc).isoformat(),
                    "level": record.levelname.lower(),
                    "message": self.format(record),
                    "service": self._service,
                    "logger": record.name,
                },
            )
        except Exception:
            self.handleError(record)


def get_logger(service: str, level: Optional[str] = None) -> logging.Logger:
    """
    Returns a logger for the given service. Logs to stdout always; logs to
    Elasticsearch when ELASTICSEARCH_URL is set in the environment.

    Usage:
        from lib.logger import get_logger
        logger = get_logger("embedding-service")
        logger.info("hello")
    """
    log_level = getattr(
        logging,
        (level or os.getenv("LOG_LEVEL", "DEBUG" if os.getenv("ENV") != "production" else "INFO")).upper(),
        logging.DEBUG,
    )

    logger = logging.getLogger(service)
    if logger.handlers:
        # Already configured — return as-is to avoid duplicate handlers
        return logger

    logger.setLevel(log_level)

    fmt = logging.Formatter(
        fmt="[%(asctime)s] %(levelname)s (%(name)s): %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    console = logging.StreamHandler()
    console.setFormatter(fmt)
    logger.addHandler(console)

    es_handler = ElasticsearchHandler(service)
    es_handler.setFormatter(fmt)
    logger.addHandler(es_handler)

    return logger
