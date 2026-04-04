"""
Provides a simple interface for publishing and subscribing to Google Cloud Pub/Sub topics.
Mirrors the behaviour of ts-packages/src/lib/pubsub.ts.
"""

import json
import os
import threading
from typing import Any, Callable

from dotenv import load_dotenv
from google.api_core.exceptions import AlreadyExists
from google.cloud import pubsub_v1

load_dotenv()

_PROJECT_ID = os.getenv("GOOGLE_PUBSUB_PROJECT_ID", "")
_NODE_ENV = os.getenv("NODE_ENV", "development")
_EMULATOR_HOST = "localhost:8085"

if _NODE_ENV == "development":
    os.environ.setdefault("PUBSUB_EMULATOR_HOST", _EMULATOR_HOST)

_publisher = pubsub_v1.PublisherClient()

# Tracks open streaming-pull futures so unsubscribe() can cancel them.
_futures: dict[str, Any] = {}


def _subscription_path(topic: str) -> str:
    sub_key = f"{topic}-sub"
    return _publisher.subscription_path(_PROJECT_ID, sub_key)  # type: ignore[attr-defined]


def _topic_path(topic: str) -> str:
    return _publisher.topic_path(_PROJECT_ID, topic)


def _ensure_topic(topic: str) -> None:
    path = _topic_path(topic)
    try:
        _publisher.create_topic(name=path)
    except AlreadyExists:
        pass


def _ensure_subscription(topic: str) -> str:
    _ensure_topic(topic)
    sub_path = _subscription_path(topic)
    subscriber = pubsub_v1.SubscriberClient()
    try:
        subscriber.create_subscription(name=sub_path, topic=_topic_path(topic))
    except AlreadyExists:
        pass
    finally:
        subscriber.close()
    return sub_path


def publish(topic: str, data: Any) -> None:
    """Publish a JSON-serialisable payload to *topic*, creating it if needed."""
    _ensure_topic(topic)
    message_bytes = json.dumps(data).encode("utf-8")
    future = _publisher.publish(_topic_path(topic), message_bytes)
    try:
        future.result()
        print(f"Published message to {topic}:", data)
    except Exception as exc:
        print(f"Error publishing message to {topic}:", exc)


def subscribe(topic: str, callback: Callable[[Any], None]) -> None:
    """
    Subscribe to *topic* (creating the topic and subscription if needed) and
    invoke *callback* with the deserialised payload for every message received.

    The listener runs in a background daemon thread so it does not block the
    calling thread (equivalent to the non-blocking event-listener in the TS
    version).
    """
    sub_path = _ensure_subscription(topic)

    def _listen() -> None:
        subscriber = pubsub_v1.SubscriberClient()

        def _on_message(message: pubsub_v1.types.PubsubMessage) -> None:  # type: ignore[name-defined]
            try:
                print(f"Received message from {topic}:", message.data.decode())
                payload = json.loads(message.data.decode("utf-8"))
                callback(payload)
            except Exception as exc:
                print(f"Error handling message from {topic}:", exc)
            finally:
                message.ack()

        future = subscriber.subscribe(sub_path, callback=_on_message)
        _futures[topic] = future
        print(f"Subscribed to {topic} (subscription: {sub_path})")
        try:
            future.result()
        except Exception as exc:
            print(f"Subscription {topic} closed:", exc)
        finally:
            subscriber.close()

    thread = threading.Thread(target=_listen, daemon=True, name=f"pubsub-{topic}")
    thread.start()


def unsubscribe(topic: str) -> None:
    """Cancel the streaming-pull future for *topic*, if one exists."""
    future = _futures.pop(topic, None)
    if future is not None:
        future.cancel()
        print(f"Unsubscribed from {topic}")
