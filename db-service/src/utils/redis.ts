import { createClient } from "redis";
import { config } from "./config";

export const redisClient = createClient({
  url: config.REDIS_URL,
});

redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("disconnect", () => console.log("Disconnected from Redis"));
redisClient.on("error", function (error) {
  console.error(error);
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export const disconnectRedis = async () => {
  if (redisClient.isOpen) {
    await redisClient.disconnect();
  }
};

export const cacheData = async (
  key: string,
  value: string,
  expirationInSec = 3600
) => {
  await connectRedis();
  await redisClient.setEx(key, expirationInSec, value);
};

export const getCachedData = async (key: string): Promise<string | null> => {
  await connectRedis();
  const data = await redisClient.get(key);
  return data;
};
