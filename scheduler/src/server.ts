/**
 * Scheduler Service
 * This service is responsible for scheduling tasks and managing their execution.
 * It uses PubSub for message queuing.
 * The service exposes a REST API for creating, updating, and deleting tasks.
 * Also for fetching, updating and deleting conversations.
 */
//---------------------------------------------------------

import { checkUser, jwtCheck } from "@/shared/src/middleware/user";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { logger } from "./lib/logger";
import { requestLogger } from "./middleware/loggerMiddleware";
import { rateLimiter } from "./middleware/ratelimiter";
import { conversationRoutes } from "./routes/conversationRoutes";
import { taskRoutes } from "./routes/taskRoutes";
import { config } from "./utils/config";
dotenv.config();

//----------------------------------------------------------

const app = express();
const port = config.PORT;
app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
  }),
);

console.log("NODE_ENV:", process.env.NODE_ENV);

//----------------------------------------------------------

app.use(express.json());

app.use(requestLogger);

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(jwtCheck as express.RequestHandler);
app.use(checkUser as express.RequestHandler);
if (config.NODE_ENV !== "development") {
  app.use(rateLimiter);
}
app.use("/v1/tasks", taskRoutes);
app.use("/v1/conversation", conversationRoutes);
app.get("/", async (_req: Request, res: Response) => {
  return res
    .status(200)
    .json({ message: "scheduler service running", status: "ok" });
});

//----------------------------------------------------------

app.get("*", async (_req: Request, res: Response) => {
  return res.status(404).json("Invalid route");
});

app.listen(port, () => {
  logger.info(`>> Scheduler service is running at port ${port}`);
});

//----------------------------------------------------------
