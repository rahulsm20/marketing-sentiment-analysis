import openai from "openai";
import { config } from "../utils/config";

export const openaiClient = new openai.OpenAI({
  apiKey: config.OPENAI_API_KEY,
});
