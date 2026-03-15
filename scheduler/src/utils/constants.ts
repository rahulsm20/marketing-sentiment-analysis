export const RABBITMQ_TOPIC: { [key: string]: string } = {
  SCRAPING: "market_sentience_scraper",
  GENERATION: "market_sentience_generation",
  EMBEDDING: "market_sentience_embedding",
};

export const RABBITMQ_TOPIC_MAP: { [key: string]: string } = {
  market_sentience_scraper: "Scraping",
  market_sentience_generation: "Generation",
  market_sentience_embedding: "Embedding",
};
