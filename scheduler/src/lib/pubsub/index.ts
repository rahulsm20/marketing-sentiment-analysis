/**
 * This module provides a simple interface for publishing and subscribing to Google Cloud Pub/Sub topics.
 * It uses the Google Cloud Pub/Sub client library to interact with the Pub/Sub service.
 */

//-----------------------------------------------------------------------------------

import { PubSub } from "@google-cloud/pubsub";
import dotenv from "dotenv";
dotenv.config();

//-----------------------------------------------------------------------------------

const pubSubClient = new PubSub({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  apiKey: process.env.GOOGLE_API_KEY,
});

export const pubSub = {
  publish: async (topic: string, data: any) => {
    const messageBuffer = Buffer.from(JSON.stringify(data));
    try {
      await pubSubClient.topic(topic).publish(messageBuffer);
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
