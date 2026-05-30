/**
 * Cron job to fetch and cache data every 5 minutes
 * @file index.ts
 * @description This file defines the cron job that fetches and caches data using the cacheController
 * and handles rate limiting to ensure it does not run concurrently.
 * It exports the cronJob function which can be scheduled using a cron library.
 */
import { cacheController } from "@/controllers";

//-----------------------------------------------------------------

let isRunning = false;

//-----------------------------------------------------------------

export const cacheCronJob = async () => {
  if (isRunning) {
    console.log(
      "Previous job still running, skipping this tick.",
      new Date().toISOString(),
    );
    return;
  }

  isRunning = true;
  const startTime = new Date();
  try {
    await cacheController();
  } catch (err) {
    console.error("Cron job error:", err);
  } finally {
    isRunning = false;
    const endTime = new Date();
    const duration = (endTime.getTime() - startTime.getTime()) / 1000; // in seconds
    console.log("Cron job finished at", new Date().toISOString());
    console.log(`⏱ Cron job duration: ${duration} seconds`);
  }
};

//-----------------------------------------------------------------
