import dotenv from "dotenv";
dotenv.config();

export const config = {
  AWS_REGION: process.env.AWS_REGION || "us-east-1",
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || "my-default-bucket",
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 4006,
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
};
