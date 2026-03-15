/**
 * Routes for managing tasks in the task queue.
 * @module taskRoutes
 */
//-----------------------------------------------------------------------------------

import express from "express";
import { addTaskToQueue } from "../controllers/index";

const router = express.Router();

// ----------------------------------------------------------------------------------

router.post("/", addTaskToQueue);

router.get("/", async (_req, res) => {
  try {
    return res.status(200).json({ message: "task root" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

// ----------------------------------------------------------------------------------

export { router as taskRoutes };
