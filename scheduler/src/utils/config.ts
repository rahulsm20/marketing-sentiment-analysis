import { config as dotenvConfig } from "dotenv";
dotenvConfig();

export const config = {
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/marketing",
  RABBITMQ_URL: process.env.RABBITMQ_URL || "amqp://localhost",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  PORT: process.env.PORT || 3000,
  AUTH0_AUDIENCE:
    process.env.AUTH0_AUDIENCE || "https://dev-123456.us.auth0.com/api/v2/",
  AUTH0_BASE_URL:
    process.env.AUTH0_BASE_URL || "https://dev-123456.us.auth0.com/",
  GOOGLE_PUBSUB_TOPIC: process.env.GOOGLE_PUBSUB_TOPIC || "taskQueue",
  GOOGLE_PUBSUB_PROJECT_ID:
    process.env.GOOGLE_PUBSUB_PROJECT_ID || "my-project",
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "your-google-api-key",
  MONGO_URI:
    process.env.MONGO_URI || "mongodb://localhost:27017/market-sentience",
};
