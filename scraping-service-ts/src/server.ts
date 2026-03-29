import { config, RABBITMQ_TOPIC } from "@/shared/config";
import { pubSub } from "@/shared/lib/pubsub";
import express, { Request, Response } from "express";
import { runScrape, scrapeProducts } from "./controllers/scrape";
import { logger } from "./lib/logger";

const app = express();
const port = process.env.PORT || 3002;

if (config.NODE_ENV === "development") {
  pubSub.subscribe(RABBITMQ_TOPIC.SCRAPING, async (data) => {
    await runScrape(data);
  });
}

app.use(express.json());
app.post("/scrape", scrapeProducts);
app.get("/", async (_req: Request, res: Response) => {
  return res
    .status(200)
    .json({ message: "Scraping Service running", status: "ok" });
});

app.get("*", async (_req: Request, res: Response) => {
  return res.status(404).json("Invalid route");
});

app.listen(port, () => {
  logger.info(`>> Scraping service is running at port ${port}`);
});
