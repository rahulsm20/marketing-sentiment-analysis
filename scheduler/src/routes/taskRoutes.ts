/**
 * Routes for managing tasks in the task queue.
 * @module taskRoutes
 */
//-----------------------------------------------------------------------------------

import express from "express";
import { addTaskToQueue } from "../controllers/index";
import { rabbitMQ } from "../lib/rabbitmq";

const router = express.Router();

// ----------------------------------------------------------------------------------

router.post("/", addTaskToQueue);

router.get("/", async (_req, res) => {
  try {
    const rabbitMQJobs = await rabbitMQ.getJobs();
    return res.status(200).json({ rabbitMQJobs });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

// ----------------------------------------------------------------------------------

export { router as taskRoutes };
