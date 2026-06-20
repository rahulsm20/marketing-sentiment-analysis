import { delay } from "@/utils";
import { config } from "@/utils/config";
import { CATEGORIES, POPULAR_COMPANIES } from "@/utils/constants";
import { logger } from "./logger";

const RATE_LIMIT = 5; // per minute
const INTERVAL = Math.ceil(60000 / RATE_LIMIT); // delay between requests

/**
 * Pipeline for scraping and embedding data
 **/
export const runPipeline = async (): Promise<boolean> => {
  try {
    const allCombinations = POPULAR_COMPANIES.reduce(
      (acc: string[], company: string): string[] => {
        CATEGORIES.forEach((category) => {
          acc.push(`${company} ${category}`);
        });
        return acc;
      },
      [],
    );

    for (const combo of allCombinations) {
      const data = await fetch(config.SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: combo }),
      });
      if (!data || !data.ok) {
        logger.error("Failed to run pipeline for ", combo);
      }
      await delay(INTERVAL);
    }
    return true;
  } catch (err) {
    return false;
  }
};
