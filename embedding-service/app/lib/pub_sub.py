from google.cloud import pubsub_v1
from app.core.config import config


class PubSubClient:
    def __init__(self, project_id, topic_name):
        self.publisher = pubsub_v1.PublisherClient()
        self.topic_path = self.publisher.topic_path(project_id, topic_name)

    def publish_message(self, message, **attributes):
        print("sending message to pubsub: ", type(message.encode("utf-8")))
        future = self.publisher.publish(
            self.topic_path, message.encode("utf-8"), **attributes
        )
        return future.result()


pubsub_client = PubSubClient(
    project_id=config["GOOGLE_CLOUD_PROJECT_ID"],
    topic_name="market_sentience_generation",
)
