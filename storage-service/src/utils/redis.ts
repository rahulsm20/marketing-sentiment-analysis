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

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export const disconnectRedis = async () => {
  if (redisClient.isOpen) {
    await redisClient.disconnect();
  }
};

export const getKey = async (key: string) => {
  await connectRedis();
  const value = await redisClient.get(key);
  return value;
};

export const setKey = async (
  key: string,
  value: string,
  expireInSec?: number
) => {
  await connectRedis();
  if (expireInSec) {
    await redisClient.setEx(key, expireInSec, value);
  } else {
    await redisClient.set(key, value);
  }
};

export const deleteKey = async (key: string) => {
  await connectRedis();
  await redisClient.del(key);
};
