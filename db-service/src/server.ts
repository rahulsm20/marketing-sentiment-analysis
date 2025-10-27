import express, { Request, Response } from "express";
import { mongodb } from "./lib/db";
import { ConversationRoutes } from "./routes/conversation";
import { config } from "./utils/config";

const app = express();
const port = config.PORT;

app.use(express.json());

try {
  mongodb
    .connect(config.MONGO_URL)
    .then(() => console.log(">> DB Service connected to MongoDB"))
    .catch((err) => console.log(err));
} catch (err) {
  console.log(err);
}

app.use("/conversation", ConversationRoutes);
app.get("/", async (_req: Request, res: Response) => {
  return res.status(200).json({ message: "DB Service running", status: "ok" });
});

app.get("*", async (_req: Request, res: Response) => {
  return res.status(404).json("Invalid route");
});

app.listen(port, () => {
  console.log(`DB Server is running at port ${port}`);
});
