import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { config as appConfig } from "../../utils/config";

config({ path: ".env" });

const sql = neon(appConfig.DATABASE_URL!);
export const db = drizzle({ client: sql });
