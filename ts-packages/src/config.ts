import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 4004,
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/postgres",
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/marketing",
  REDIS_URL: process.env.REDIS_URL || "",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || "",
  AUTH0_BASE_URL: process.env.AUTH0_BASE_URL || "",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  AWS_REGION: process.env.AWS_REGION || "",
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
  GOOGLE_PUBSUB_PROJECT_ID: process.env.GOOGLE_PUBSUB_PROJECT_ID || "",
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
  NODE_ENV: process.env.NODE_ENV || "production",
  S3_BUCKET: process.env.AWS_S3_BUCKET_NAME || "market-sentience",
  PINECONE_API_KEY: process.env.PINECONE_API_KEY || "",
  SERVICE: process.env.SERVICE || "",
  LOKI_HOST: process.env.LOKI_HOST || "",
  LOKI_USER_ID: process.env.LOKI_USER_ID || "",
  LOKI_API_KEY: process.env.LOKI_API_KEY || "",
  RATE_LIMIT: parseInt(process.env.RATE_LIMIT || "0") || 10, // no of requests
  RATE_LIMIT_PERIOD: parseInt(process.env.RATE_LIMIT_PERIOD || "0") || 60, // in seconds
};

const isProduction = config.NODE_ENV === "production";

export const PUBSUB_TOPIC: { [key: string]: string } = {
  SCRAPING: "market_sentience_scraper",
  GENERATION: "market_sentience_generation",
  EMBEDDING: "market_sentience_embedding",
};

export const PUBSUB_TOPIC_MAP: { [key: string]: string } = {
  market_sentience_scraper: "Scraping",
  market_sentience_generation: "Generation",
  market_sentience_embedding: "Embedding",
};
