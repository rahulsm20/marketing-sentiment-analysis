const dotenv = require("dotenv");
dotenv.config();

const config = {
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/scraping",
  RABBITMQ_URL: process.env.RABBITMQ_URL || "amqp://localhost",
  PORT: process.env.PORT || 5000,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  RABBITMQ_TOPIC: {
    SCRAPING: "scraping",
    GENERATION: "generation",
    EMBEDDING: "embedding",
  },
};

module.exports = { config };
