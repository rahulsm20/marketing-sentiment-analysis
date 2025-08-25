const { connect } = require("amqplib");
const { config } = require("../../utils/config");
const { scrapeProducts } = require("../../controllers/scrape");

/**
 * RabbitMQClient class
 * Handles connection to RabbitMQ and sending messages to a queue
 */
class RabbitMQClient {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await connect(config.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      this.channel.on("error", (error) => {
        console.error("RabbitMQ channel error:", error);
      });

      console.log(">> Scraping service connected to RabbitMQ");
      await this.channel.assertQueue(config.RABBITMQ_TOPIC.SCRAPING, {
        durable: true, // survives broker restarts
      });

      this.channel.consume(config.RABBITMQ_TOPIC.SCRAPING, async (msg) => {
        try {
          const input = JSON.parse(msg.content.toString());
          console.log("Received message:", input);
          await scrapeProducts(input);
          console.log("Processed message:", input);
          await rabbitMQ.sendToQueue(
            config.RABBITMQ_TOPIC.EMBEDDING,
            JSON.stringify(input)
          );
          // Process the message here
          this.channel.ack(msg);
        } catch (err) {
          return this.channel.nack(msg);
        }
      });
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
    }
  }
  async sendToQueue(queue, message) {
    try {
      this.channel.sendToQueue(queue, Buffer.from(message), {
        persistent: true,
      });
      console.log("Message sent to queue:", message);
    } catch (error) {
      console.error("Error sending message to queue:", error);
    }
  }
  async getFromQueue(queue) {
    try {
      const message = await this.channel.get(queue, { noAck: false });
      if (message) {
        console.log("Message received from queue:", message.content.toString());
        this.channel.ack(message);
        return message.content.toString();
      }
    } catch (error) {
      console.error("Error receiving message from queue:", error);
    }
  }
}

const rabbitMQ = new RabbitMQClient();

module.exports = { rabbitMQ };
