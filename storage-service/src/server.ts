import { config } from "@/utils/config";
import cors from "cors";
import express, { Request, Response } from "express";
import { fileRouter } from "./routes/file";
const app = express();
const port = config.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/file", fileRouter);
app.get("/", async (_req: Request, res: Response) => {
  return res
    .status(200)
    .json({ message: "storage service running", status: "ok" });
});

app.get("*", async (req: Request, res: Response) => {
  return res.status(404).json("Invalid route");
});

app.listen(port, () => {
  console.log(`>> Server is running at port ${port}`);
});
