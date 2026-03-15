/**
 * This module provides a simple interface for publishing and subscribing to Google Cloud Pub/Sub topics.
 * It uses the Google Cloud Pub/Sub client library to interact with the Pub/Sub service.
 */

//-----------------------------------------------------------------------------------

import { config } from "@/utils/config";
import { PubSub } from "@google-cloud/pubsub";
import dotenv from "dotenv";
dotenv.config();

//-----------------------------------------------------------------------------------

const pubSubClient = new PubSub({
  projectId: config.GOOGLE_PUBSUB_PROJECT_ID,
  apiKey: config.GOOGLE_API_KEY,
  apiEndpoint:
    config.NODE_ENV === "development"
      ? "http://localhost:8085"
      : "pubsub.googleapis.com",
});

export const pubSub = {
  publish: async (topic: string, data: any) => {
    const messageBuffer = Buffer.from(JSON.stringify(data));
    try {
      const topicObj = pubSubClient.topic(topic);
      await topicObj.create().catch((err) => {
        if (err.code === 6) {
          // Topic already exists, ignore the error
          console.log(`Topic ${topic} already exists.`);
        } else {
          throw err;
        }
      });

      await topicObj.publishMessage({ data: messageBuffer });
      console.log(`Published message to ${topic}:`, data);
    } catch (error) {
      console.error(`Error publishing message to ${topic}:`, error);
    }
  },

  subscribe: (topic: string, callback: (data: any) => void) => {
    const subscription = pubSubClient.subscription(topic);
    subscription.on("message", (message) => {
      // console.log(`Received message from ${topic}:`, message.data.toString());
      callback(JSON.parse(message.data.toString()));
      message.ack();
    });
  },

  unsubscribe: (topic: string) => {
    const subscription = pubSubClient.subscription(topic);
    subscription.close();
    console.log(`Unsubscribed from ${topic}`);
  },
};
