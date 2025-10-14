import pika
import json
from app.api.v1.embeddings import embed

import pika
import threading


class RabbitMQConsumer:
    def __init__(self, queue_name: str, host: str = "localhost", durable: bool = True):
        self.queue_name = queue_name
        self.host = host
        self.durable = durable
        self.connection = None
        self.channel = None

    def connect(self):
        """Establish a connection and channel."""
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(self.host))
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=self.queue_name, durable=self.durable)
        self.channel.basic_qos(prefetch_count=1)

    def start_consuming(self, callback):
        """Start consuming messages in a blocking loop."""
        if not self.connection or self.connection.is_closed:
            self.connect()

        self.channel.basic_consume(queue=self.queue_name, on_message_callback=callback)

        print(f" [*] Listening for messages on '{self.queue_name}'...")
        try:
            self.channel.start_consuming()
        except KeyboardInterrupt:
            self.close()

    def close(self):
        if self.connection and not self.connection.is_closed:
            self.connection.close()


def handle_embedding_task(ch, method, properties, body):
    try:
        data = json.loads(body)
        conversation_id = data.get("conversation_id")
        if conversation_id:
            print(f" [x] Received embedding task for conversation_id={conversation_id}")

            # Call your existing async embed() logic in a thread-safe way
            import asyncio

            asyncio.run(embed(conversation_id))

            print(f" [✓] Finished embedding for conversation_id={conversation_id}")
            ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        print(f" [!] Error processing message: {e}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
