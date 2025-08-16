/**
 * Scheduler Service
 * This service is responsible for scheduling tasks and managing their execution.
 * It uses RabbitMQ for message queuing.
 * The service exposes a REST API for creating, updating, and deleting tasks.
 */
//---------------------------------------------------------

import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { db } from "./lib/db/mongo";
import { rabbitMQ } from "./lib/rabbitmq";
import { checkUser } from "./middleware";
import { conversationRoutes } from "./routes/conversationRoutes";
import { taskRoutes } from "./routes/taskRoutes";
import { config } from "./utils/config";
dotenv.config();

//----------------------------------------------------------

const app = express();
const port = config.PORT;

const jwtCheck = auth({
  audience: config.AUTH0_AUDIENCE,
  issuerBaseURL: config.AUTH0_BASE_URL,
  tokenSigningAlg: "RS256",
});

app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
  })
);

//----------------------------------------------------------

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(jwtCheck);
app.use(checkUser);
app.use("/v1/tasks", taskRoutes);
app.use("/v1/conversation", conversationRoutes);
app.get("/", async (_req: Request, res: Response) => {
  return res.status(200).json({ message: "Service running", status: "ok" });
});

//----------------------------------------------------------

try {
  db.connect(config.MONGO_URL)
    .then(() => console.log(">> Connected to MongoDB"))
    .catch((err) => console.log(err));

  rabbitMQ
    .connect()
    .then(() => {
      console.log(">> Connection to RabbitMQ established");
    })
    .catch((err) => {
      console.error(">> Failed to connect to RabbitMQ", err);
    });
} catch (err) {
  console.log(err);
}

app.get("*", async (_req: Request, res: Response) => {
  return res.status(404).json("Invalid route");
});

app.listen(port, () => {
  console.log(`>> Scheduler service is running at port ${port}`);
});

//----------------------------------------------------------
