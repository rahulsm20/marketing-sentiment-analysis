import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  return res.status(200).json({ message: "Service running", status: "ok" });
});

app.get("*", async (req: Request, res: Response) => {
  return res.status(404).json("Invalid route");
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
