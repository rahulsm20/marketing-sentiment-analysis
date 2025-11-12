import os
from google.cloud import pubsub_v1

publisher = pubsub_v1.PublisherClient()
publish_topic_name = "projects/{project_id}/topics/{topic}".format(
    project_id=os.getenv("GOOGLE_CLOUD_PROJECT"),
    topic="GENERATION",  # Set this to something appropriate.
)
publisher.create_topic(name=topic_name)
future = publisher.publish(topic_name, b"My first message!", spam="eggs")
future.result()


class PubSubClient:
    def __init__(self, project_id, topic_name):
        self.publisher = pubsub_v1.PublisherClient()
        self.topic_path = self.publisher.topic_path(project_id, topic_name)

    def publish_message(self, message, **attributes):
        future = self.publisher.publish(
            self.topic_path, message.encode("utf-8"), **attributes
        )
        return future.result()
