import express, { Request, Response } from "express";
import { config } from "./config";
import { chatRouter } from "./routes/chatRoutes";

const app = express();
const port = config.PORT || 3000;

app.use(express.json());

app.use("/chat", chatRouter);
app.get("/", async (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Service running",
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

app.get("*", async (req: Request, res: Response) => {
  return res.status(404).json({ error: "Invalid route" });
});

app.listen(port, () => {
  console.log(`Chat service is running on port ${port}`);
});
