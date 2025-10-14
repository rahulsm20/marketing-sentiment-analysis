/**
 * Scraping Service
 * This service scrapes product data from a given URL and stores it in a MongoDB database.
 * It also connects to a RabbitMQ server for message queuing.
 */

//-------------------------------------------------------------

const express = require("express");
const scrapeProducts = require("./controllers/scrape");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { rabbitMQ } = require("./lib/rabbitmq");
const { config } = require("./utils/config");
require("dotenv").config();

//-------------------------------------------------------------

app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "market sentience scraping service", status: "ok" });
});

// app.get("/scrape", scrapeProducts);
app.get("*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

try {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log(">> Scraping service connected to MongoDB"))
    .catch((err) => console.log(err));
  rabbitMQ.connect();
} catch (err) {
  console.log(err);
}

app.listen(config.PORT, () =>
  console.log(`>> Scraping service is running on port ${config.PORT}`)
);
