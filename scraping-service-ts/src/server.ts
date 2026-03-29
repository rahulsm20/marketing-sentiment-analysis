import express, { Request, Response } from "express";
import { scrapeProducts } from "./controllers/scrape";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.get("/scrape", scrapeProducts);
app.get("/", async (_req: Request, res: Response) => {
  return res
    .status(200)
    .json({ message: "Scraping Service running", status: "ok" });
});

app.get("*", async (_req: Request, res: Response) => {
  return res.status(404).json("Invalid route");
});

app.listen(port, () => {
  console.log(`Scraping server is running at port ${port}`);
});
