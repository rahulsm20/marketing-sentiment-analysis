import builtins
import logging
import os
from typing import Optional
from py_packages.utils.config import CONFIG
from dotenv import load_dotenv


def _make_formatter(service_name: str) -> logging.Formatter:
    class _Fmt(logging.Formatter):
        def format(self, record: logging.LogRecord) -> str:
            ts = self.formatTime(record, "%Y-%m-%d %H:%M:%S")
            return f"[{ts}] {record.levelname}: {record.getMessage()} {service_name}"

    return _Fmt()


def create_logger(service_name: str, level: Optional[str] = None) -> logging.Logger:
    """
    Creates a logger for the given service. Logs to console always (non-prod);
    logs to file always; logs to Grafana Loki when LOKI_HOST, LOKI_API_KEY and
    LOKI_USER_ID are set in the environment.

    Usage:
        from lib.logger import create_logger
        logger = create_logger("my-service")
        logger.info("hello")
    """
    load_dotenv()

    loki_host = os.getenv("LOKI_HOST", "")
    loki_user_id = os.getenv("LOKI_USER_ID", "")
    loki_api_key = os.getenv("LOKI_API_KEY", "")

    log_level = getattr(
        logging,
        (level or os.getenv("LOG_LEVEL", "INFO")).upper(),
        logging.INFO,
    )

    logger = logging.getLogger(service_name)
    if logger.handlers:
        return logger

    logger.setLevel(log_level)
    fmt = _make_formatter(service_name)

    error_handler = logging.FileHandler("error.log")
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(fmt)
    logger.addHandler(error_handler)

    combined_handler = logging.FileHandler("combined.log")
    combined_handler.setFormatter(fmt)
    logger.addHandler(combined_handler)

    if loki_host:
        try:
            import logging_loki

            loki_handler = logging_loki.LokiHandler(
                url=f"{loki_host}/loki/api/v1/push",
                tags={"service_name": service_name},
                auth=(loki_user_id, loki_api_key),
                version="1",
            )
            loki_handler.setFormatter(logging.Formatter("%(message)s"))
            logger.addHandler(loki_handler)
        except ImportError:
            pass
        except Exception as e:
            builtins.print(f"loki error: {e}")

    if os.getenv("ENV") != "production":
        console = logging.StreamHandler()
        console.setFormatter(fmt)
        logger.addHandler(console)

    builtins.print = lambda *args, **_: logger.info(" ".join(str(a) for a in args))  # type: ignore[assignment]

    return logger

logger = create_logger(CONFIG["SERVICE"])