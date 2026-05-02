import { createLogger } from "@/shared/src/lib/logger";
import dotenv from "dotenv";
dotenv.config();

export const logger = createLogger("scheduler");
