// /**
//  * Cron job to fetch and cache data every 5 minutes
//  * @file server.ts
//  * @description This file sets up a cron job that runs every 5 minutes to fetch and cache data using the cacheController.
//  * It uses the `cron` package to schedule the job and handles rate limiting by skipping execution if the previous job is still running.
//  */

// import { CronJob } from "cron";
// import { cacheCronJob } from "./jobs";

// //-----------------------------------------------------------------

// const job = new CronJob(
//   "0 */5 * * * *",
//   cacheCronJob,
//   null,
//   true,
//   "Australia/Melbourne"
// );

// //-----------------------------------------------------------------

import { config } from "@/utils/config";
import { Request, Response } from "express";
import { cacheCronJob } from "./jobs";

//-----------------------------------------------------------------

let isRunning = true;
process.on("SIGINT", () => {
  console.log("SIGINT received. Stopping cron job...");
  isRunning = false;
});
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Stopping cron job...");
  isRunning = false;
});

//-----------------------------------------------------------------
export async function startIntervalCron(req: Request, res: Response) {
  try {
    const message = req.body?.message;

    if (!message?.data) {
      return res.status(400).json("No data");
    }
    const decodedBuffer = Buffer.from(message.data, "base64").toString();
    const decoded = JSON.parse(decodedBuffer);

    if (
      decoded.job != "refresh" ||
      decoded.encryptionKey != config.ENCRYPTION_KEY
    ) {
      return res.status(400).json("Invalid message data");
    }

    res.status(200).json("Cron job started");
    const start = Date.now();
    console.log("Starting cron job at", new Date().toISOString());

    await cacheCronJob();

    const duration = Date.now() - start;
    console.log(`Finished in ${duration}ms\n`);
    console.log({
      duration: `${duration}ms`,
      status: "success",
      message: "Cron job finished successfully",
    });
    return;
  } catch (err) {
    console.error("Error in cron job loop:", err);
    if (err instanceof Error) {
      return res.status(500).json({
        status: "error",
        message: "Cron job encountered an error",
        error: err.message,
      });
    }
  }
}

//-----------------------------------------------------------------
