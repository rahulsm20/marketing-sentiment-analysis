import express, { Request, Response } from "express";
import { config } from "./utils/config";

const app = express();
const port = config.PORT;

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  return res.status(200).json({ message: "DB Service running", status: "ok" });
});

app.get("*", async (req: Request, res: Response) => {
  return res.status(404).json("Invalid route");
});

app.listen(port, () => {
  console.log(`DB Server is running at port ${port}`);
});
