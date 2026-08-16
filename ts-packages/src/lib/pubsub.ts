/**
 * This module provides a simple interface for publishing and subscribing to Google Cloud Pub/Sub topics.
 * It uses the Google Cloud Pub/Sub client library to interact with the Pub/Sub service.
 */

//-----------------------------------------------------------------------------------

import { config } from "@/config";
import { PubSub } from "@google-cloud/pubsub";

function createPubSubClient() {
  if (config.NODE_ENV === "production") {
    return new PubSub({
      projectId: config.GOOGLE_PUBSUB_PROJECT_ID,
    });
  }
  return new PubSub({
    projectId: config.GOOGLE_PUBSUB_PROJECT_ID,
    apiKey: config.GOOGLE_API_KEY,
    apiEndpoint:
      config.NODE_ENV === "production"
        ? "pubsub.googleapis.com"
        : "http://localhost:8085",
  });
}

let pubSubClient = createPubSubClient();

export const pubSub = {
  publish: async (
    topic: string,
    data: unknown,
    _retried = false,
  ): Promise<string> => {
    try {
      const topicObj = pubSubClient.topic(topic);
      // const [exists] = await topicObj.exists();
      // console.log("Pub/Sub topic exists:", exists);
      const messageId = await topicObj.publishMessage({
        data: Buffer.from(JSON.stringify(data)),
      });
      return messageId;
    } catch (err: any) {
      console.log({
        NODE_ENV: config.NODE_ENV,
        GOOGLE_PUBSUB_PROJECT_ID: config.GOOGLE_PUBSUB_PROJECT_ID,
      });
      console.error(
        "Pub/Sub publish failed:",
        JSON.stringify({
          projectId: config.GOOGLE_PUBSUB_PROJECT_ID,
          err,
          topic,
          name: err?.name,
          message: err?.message,
          code: err?.code,
          details: err?.details,
          cause: err?.cause,
          causeMessage: err?.cause?.message,
          causeCode: err?.cause?.code,
          stack: err?.stack,
          errors: err?.errors,
        }),
      );

      throw err;
    }
  },
  subscribe: async (topic: string, callback: (data: any) => void) => {
    const topicObj = pubSubClient.topic(topic);
    await topicObj.create().catch((err) => {
      if (err.code === 6) {
        console.log(`Topic ${topic} already exists.`);
      } else {
        throw err;
      }
    });

    try {
      const subObj = topicObj.subscription(`${topic}-sub`);
      let subscription;
      // await subscription.create();
      const [exists] = await subObj.exists();
      if (!exists) {
        [subscription] = await subObj.create();
      }
      [subscription] = await subObj.get();
      if (!subscription) {
        console.error("Failed to create subscription");
        return;
      }

      subscription.on("message", (message) => {
        console.log(`Received message for ${topic}:`, message.data.toString());
        callback(JSON.parse(message.data.toString()));
        message.ack();
      });
    } catch (error) {
      console.error("Error subscribing to topic:", error);
    }
  },

  unsubscribe: (topic: string) => {
    const subscription = pubSubClient.subscription(topic);
    subscription.close();
    console.log(`Unsubscribed from ${topic}`);
  },
};
