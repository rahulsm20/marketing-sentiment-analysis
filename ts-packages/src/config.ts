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
};
