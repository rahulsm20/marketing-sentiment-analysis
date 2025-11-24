import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { mongodb } from "./lib/db";
import { ConversationRoutes } from "./routes/conversation";
import { MessageRoutes } from "./routes/messages";
import { ProductRoutes } from "./routes/products";
import { config } from "./utils/config";
dotenv.config();
const app = express();
const port = config.PORT;

declare global {
  namespace Express {
    interface Request {
      user?: {
        login: string;
        scopes: string[];
      };
    }
  }
}

// app.use(jwtCheck);
app.use(express.json());
app.use(
  cors({
    origin: [config.CLIENT_URL || "", "https://market-sentience.vercel.app"],
    credentials: true,
  })
);

try {
  mongodb
    .connect(config.MONGO_URL)
    .then(() => console.log(">> DB Service connected to MongoDB"))
    .catch((err) => console.log(err));
} catch (err) {
  console.log(err);
}

app.use("/conversation", ConversationRoutes);
app.use("/products", ProductRoutes);
app.use("/messages", MessageRoutes);
app.get("/", async (_req: Request, res: Response) => {
  return res.status(200).json({ message: "DB Service running", status: "ok" });
});

app.get("*", async (_req: Request, res: Response) => {
  return res.status(404).json({ error: "Invalid route" });
});

app.listen(port, () => {
  console.log(`DB Server is running at port ${port}`);
});
