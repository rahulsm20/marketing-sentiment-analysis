"""
Generic Redis client for use across Python services.
Mirrors the singleton pattern used in ts-packages/src/lib/db.ts.
"""

import os
from typing import Optional

import redis
from dotenv import load_dotenv

load_dotenv()

_REDIS_URL = os.getenv("REDIS_URL", "")

_pool: Optional[redis.ConnectionPool] = None
_client: Optional[redis.Redis] = None


def _get_client() -> redis.Redis:
    global _pool, _client
    if _client is None:
        if not _REDIS_URL:
            raise RuntimeError("REDIS_URL is not set in the environment")
        _pool = redis.ConnectionPool.from_url(_REDIS_URL)
        _client = redis.Redis(connection_pool=_pool)
    return _client


def get(key: str) -> Optional[str]:
    result = _get_client().get(key)
    return result.decode("utf-8") if result is not None else None


def set(key: str, value: str, ex: Optional[int] = None) -> bool:
    """Set *key* to *value*, optionally expiring after *ex* seconds."""
    return bool(_get_client().set(key, value, ex=ex))


def set_nx(key: str, value: str, ex: Optional[int] = None) -> bool:
    """Set *key* only if it does not already exist. Returns True on success."""
    client = _get_client()
    if ex is not None:
        return bool(client.set(key, value, nx=True, ex=ex))
    return bool(client.set(key, value, nx=True))


def delete(key: str) -> int:
    return _get_client().delete(key)


def exists(key: str) -> bool:
    return bool(_get_client().exists(key))


def close() -> None:
    global _pool, _client
    if _pool is not None:
        _pool.disconnect()
        _pool = None
        _client = None
