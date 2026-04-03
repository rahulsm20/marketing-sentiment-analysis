// Handler for mutex locks

import { cacheData, retrieveCachedData } from "./redis";

const DEFAULT_TTL = "1 day";

const generateMutexKey = (key: string) => `mutex:${key}`;

export const mutex = async (
  key: string,
  callback: () => Promise<any>,
  ttl?: "5 mins" | "1 day" | "1 minute" | "1 hour",
) => {
  const mutexKey = generateMutexKey(key);
  const mutex = await retrieveCachedData(key);

  if (mutex) {
    console.log("Mutex already exists for key:", key);
    return;
  } else {
    await cacheData(mutexKey, "true", ttl || DEFAULT_TTL);
    await callback();
  }
  return;
};
