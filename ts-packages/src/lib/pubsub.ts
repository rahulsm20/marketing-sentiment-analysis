/**
 * This module provides a simple interface for publishing and subscribing to Google Cloud Pub/Sub topics.
 * It uses the Google Cloud Pub/Sub client library to interact with the Pub/Sub service.
 */

//-----------------------------------------------------------------------------------

import { config } from "@/config";
import { PubSub } from "@google-cloud/pubsub";

//-----------------------------------------------------------------------------------

let pubSubClient;

if (config.NODE_ENV === "production") {
  console.log("production!!!");
  pubSubClient = new PubSub();
} else {
  console.log("development!!!");
  pubSubClient = new PubSub({
    projectId: config.GOOGLE_PUBSUB_PROJECT_ID,
    apiKey: config.GOOGLE_API_KEY,
    apiEndpoint:
      config.NODE_ENV === "production"
        ? "pubsub.googleapis.com"
        : "http://localhost:8085",
  });
}
export const pubSub = {
  publish: async (topic: string, data: any) => {
    const messageBuffer = Buffer.from(JSON.stringify(data));
    try {
      console.log("publishing data: ", JSON.stringify(data), topic);
      const topicObj = pubSubClient.topic(topic);
      await topicObj.publishMessage({ data: messageBuffer });
    } catch (err: any) {
      console.error("Publish failed: ", JSON.stringify(err));
      console.error("cause:", JSON.stringify(err.cause));
      console.error("errors:", JSON.stringify(err.errors));

      if (err.cause) {
        console.error({
          code: err.cause.code,
          details: err.cause.details,
          message: err.cause.message,
          metadata: err.cause.metadata,
        });
      }
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
      console.log({ subscription });
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
