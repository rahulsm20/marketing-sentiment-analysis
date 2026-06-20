import dotenv from "dotenv";

dotenv.config();

export const config = {
  SERVER_URL: process.env.SERVER_URL || "http://localhost:4002/scrape",
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "your-encryption-key",
  SUBSCRIPTION_TOPIC:
    process.env.SUBSCRIPTION_TOPIC || "your-subscription-topic",
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || "your-auth0-client-id",
  AUTH0_CLIENT_SECRET:
    process.env.AUTH0_CLIENT_SECRET || "your-auth0-client-secret",
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN || "your-auth0-domain",
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || "your-auth0-audience",
  SERVICE_ACCOUNT_EMAIL:
    process.env.SERVICE_ACCOUNT_EMAIL || "your-auth0-email",
  SERVICE_ACCOUNT_PASS: process.env.SERVICE_ACCOUNT_PASS || "your-auth0-email",
};
