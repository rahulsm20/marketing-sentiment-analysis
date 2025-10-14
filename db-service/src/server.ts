import express, { Request, Response } from "express";
import { db } from "./lib/db";
import { config } from "./utils/config";

const app = express();
const port = config.PORT;

app.use(express.json());

try {
  db.connect(config.MONGO_URL)
    .then(() => console.log(">> DB Service connected to MongoDB"))
    .catch((err) => console.log(err));
} catch (err) {
  console.log(err);
}
app.get("/", async (_req: Request, res: Response) => {
  return res.status(200).json({ message: "DB Service running", status: "ok" });
});

app.get("*", async (_req: Request, res: Response) => {
  return res.status(404).json("Invalid route");
});

app.listen(port, () => {
  console.log(`DB Server is running at port ${port}`);
});
