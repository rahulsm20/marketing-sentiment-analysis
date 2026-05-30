"""
Conversation processing mutex backed by Redis.

Prevents duplicate pipeline runs for the same conversation by holding a
distributed lock and tracking the active processing stage.

Key layout
----------
  conversation:lock:{id}    – mutex lock (NX, TTL-guarded)
  conversation:status:{id}  – current pipeline stage (no TTL; updated as work progresses)

Usage
-----
    from lib.mutex import acquire, release, get_status, set_status, is_processing

    if not acquire("conv-123"):
        raise RuntimeError("already processing")

    set_status("conv-123", "SCRAPING")
    ...
    set_status("conv-123", "COMPLETED")
    release("conv-123")
"""

from typing import Optional

from py_packages.lib import redis
# Default lock TTL in seconds. Guards against a service crashing without
# releasing the lock.
DEFAULT_LOCK_TTL = 300  # 5 minutes

_LOCK_PREFIX = "conversation:lock:"
_STATUS_PREFIX = "conversation:status:"


def _lock_key(conversation_id: str) -> str:
    return f"{_LOCK_PREFIX}{conversation_id}"


def _status_key(conversation_id: str) -> str:
    return f"{_STATUS_PREFIX}{conversation_id}"


# ---------------------------------------------------------------------------
# Mutex helpers
# ---------------------------------------------------------------------------


def is_processing(conversation_id: str) -> bool:
    """Return True if a lock is currently held for *conversation_id*."""
    return redis.exists(_lock_key(conversation_id))


def acquire(conversation_id: str, ttl: int = DEFAULT_LOCK_TTL) -> bool:
    """
    Attempt to acquire the processing lock for *conversation_id*.

    Returns True if the lock was acquired (i.e. no other process holds it),
    False if the conversation is already being processed.
    """
    return redis.set_nx(_lock_key(conversation_id), "1", ex=ttl)


def release(conversation_id: str) -> None:
    """Release the processing lock for *conversation_id*."""
    redis.delete(_lock_key(conversation_id))


def get_lock(conversation_id: str) -> Optional[str]:
    """
    Return the current pipeline stage for *conversation_id*, or None if no
    status has been recorded (conversation not yet started or already cleaned up).
    """
    return redis.get(_lock_key(conversation_id))


def set_lock(conversation_id: str, status: str) -> None:
    """
    Update the pipeline stage for *conversation_id*.

    *status* should be one of the conversationStatus enum values defined in
    ts-packages/src/lib/schema.ts:
        PENDING | IN_PROGRESS | COMPLETED | SCRAPING | GENERATION | EMBEDDING
    """
    redis.set(_lock_key(conversation_id), status)

# ---------------------------------------------------------------------------
# Status helpers
# ---------------------------------------------------------------------------


def get_status(conversation_id: str) -> Optional[str]:
    """
    Return the current pipeline stage for *conversation_id*, or None if no
    status has been recorded (conversation not yet started or already cleaned up).
    """
    return redis.get(_status_key(conversation_id))


def set_status(conversation_id: str, status: str, ttl: Optional[int] = None) -> None:
    """
    Update the pipeline stage for *conversation_id*.

    *status* should be one of the conversationStatus enum values defined in
    ts-packages/src/lib/schema.ts:
        PENDING | IN_PROGRESS | COMPLETED | SCRAPING | GENERATION | EMBEDDING
    """
    redis.set(_status_key(conversation_id), status, ttl)


def clear_status(conversation_id: str) -> None:
    """Remove the status entry for *conversation_id*."""
    redis.delete(_status_key(conversation_id))
