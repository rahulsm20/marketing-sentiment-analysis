import { RABBITMQ_TOPIC } from "@/shared/config";
import { Channel, ChannelModel, connect } from "amqplib";
import { config } from "../../utils/config";

/**
 * RabbitMQClient class
 * Handles connection to RabbitMQ and sending messages to a queue
 */
class RabbitMQClient {
  private connection: ChannelModel | null;
  private channel: Channel | null;

  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await connect(config.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(RABBITMQ_TOPIC.SCRAPING, {
        durable: true,
      });
      console.log(">> Connected to RabbitMQ");
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
    }
  }
  async sendToQueue(queue: string, message: string) {
    try {
      if (!this.channel) {
        throw new Error("Channel is not initialized. Call connect() first.");
      }
      this.channel.sendToQueue(queue, Buffer.from(message), {
        persistent: true,
      });
      console.log({ queue });
      console.log("Message sent to queue from scheduler:", message);
    } catch (error) {
      console.error("Error sending message to queue:", error);
    }
  }
  async getJobs() {
    try {
      if (!this.channel) {
        throw new Error("Channel is not initialized. Call connect() first.");
      }
      const jobs = await this.channel.get(RABBITMQ_TOPIC.SCRAPING, {
        noAck: true,
      });
      if (!jobs) {
        console.log("No jobs in the queue");
        return [];
      }
      return jobs.content.toString();
    } catch (error) {
      console.error("Error getting jobs from queue:", error);
      return [];
    }
  }
}

export const rabbitMQ = new RabbitMQClient();
