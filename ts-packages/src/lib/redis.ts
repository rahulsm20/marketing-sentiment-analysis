// import { config } from "@/utils/config";
import { config } from "@/config";
import dotenv from "dotenv";
import { createClient } from "redis";
dotenv.config();

//-----------------------------------------------------------

export const redisClient = createClient({
  url: config.REDIS_URL,
});

//-----------------------------------------------------------

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

//-----------------------------------------------------------

/**
 * Function to cache data in Redis
 * @param key
 * @param data
 * @param lifetime
 * @returns Promise<string>
 */
export const cacheData = async (
  key: string,
  data: string,
  lifetime?: "5 mins" | "1 day" | "1 minute" | "1 hour" | number, // can be a number or a string, if number it is in seconds
) => {
  await connectRedis();
  const cached = await redisClient.set(key, data, {
    EX:
      !lifetime || lifetime == "1 hour"
        ? 60 * 60
        : typeof lifetime === "number"
          ? lifetime
          : lifetime == "5 mins"
            ? 60 * 5
            : lifetime == "1 minute"
              ? 60 * 1
              : 60 * 60 * 24,
  });
  return cached;
};

//-----------------------------------------------------------

/**
 * Retrieves cached data from Redis
 * @param key The key to retrieve the data from
 * @returns The cached data or null if not found
 */
export const retrieveCachedData = async (key: string) => {
  await connectRedis();
  const cached = await redisClient.get(key);
  return cached;
};

export const deleteCachedData = async (key: string) => {
  await connectRedis();
  const deleted = await redisClient.del(key);
  return deleted;
};
