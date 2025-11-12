import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 4004,
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/postgres",
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/marketing",
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: process.env.REDIS_PORT || "6379",
  REDIS_PASS: process.env.REDIS_PASS || "",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || "",
  AUTH0_BASE_URL: process.env.AUTH0_BASE_URL || "",
};
