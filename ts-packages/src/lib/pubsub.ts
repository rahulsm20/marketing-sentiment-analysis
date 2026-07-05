/**
 * This module provides a simple interface for publishing and subscribing to Google Cloud Pub/Sub topics.
 * It uses the Google Cloud Pub/Sub client library to interact with the Pub/Sub service.
 */

//-----------------------------------------------------------------------------------

import { config } from "@/config";
import { PubSub } from "@google-cloud/pubsub";
import dotenv from "dotenv";
dotenv.config();

//-----------------------------------------------------------------------------------

const pubSubClient = new PubSub({
  projectId: config.GOOGLE_PUBSUB_PROJECT_ID,
  apiKey: config.GOOGLE_API_KEY,
  apiEndpoint:
    config.NODE_ENV === "production"
      ? "pubsub.googleapis.com"
      : 'http://localhost:8085"',
});

export const pubSub = {
  publish: async (topic: string, data: any) => {
    const messageBuffer = Buffer.from(JSON.stringify(data));
    try {
      const topicObj = pubSubClient.topic(topic);

      //   await topicObj.create().catch((err) => {
      //   if (err.code === 6) {
      //     // Topic already exists, ignore the error
      //     console.log(`Topic ${topic} already exists.`);
      //   } else {
      //     throw err;
      //   }
      // });
      //
      await topicObj.publishMessage({ data: messageBuffer });
      console.log(`Published message to ${topic}:`, data);
    } catch (err: any) {
      console.error("Publish failed: ", JSON.stringify(err));
      console.error("cause:", err.cause);
      console.error("errors:", err.errors);

      if (err.cause) {
        console.error({
          code: err.cause.code,
          details: err.cause.details,
          message: err.cause.message,
          metadata: err.cause.metadata,
        });
      }
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
