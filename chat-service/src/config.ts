import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  OPEN_AI_MODEL: process.env.OPEN_AI_MODEL || "gpt-5-nano",
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || "",
  AUTH0_BASE_URL: process.env.AUTH0_BASE_URL || "",
  SERVICE_NAME: process.env.SERVICE_NAME || "chat_service",
  CLIENT_URL: process.env.CLIENT_URL || "",
};
