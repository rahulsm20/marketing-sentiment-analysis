import { config } from "@/config";
import OpenAI from "openai";

export const openAIClient = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});
