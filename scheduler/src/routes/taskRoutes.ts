/**
 * Routes for managing tasks in the task queue.
 * @module taskRoutes
 */
//-----------------------------------------------------------------------------------

import express from "express";
import { addTaskToQueue } from "../controllers/index";
import { taskQueue } from "../lib/bullmq";
import { rabbitMQ } from "../lib/rabbitmq";

const router = express.Router();

// ----------------------------------------------------------------------------------

router.post("/", addTaskToQueue);

router.get("/", async (_req, res) => {
  try {
    const jobs = await taskQueue.getJobs();
    const rabbitMQJobs = await rabbitMQ.getJobs();
    return res.status(200).json({ jobs, rabbitMQJobs });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

// ----------------------------------------------------------------------------------

router.get("/:id", async (req, res) => {
  try {
    const job = await taskQueue.getJob(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    return res.status(200).json(job);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

// ----------------------------------------------------------------------------------

export { router as taskRoutes };
