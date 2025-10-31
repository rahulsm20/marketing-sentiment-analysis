import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { config as appConfig } from "./src/utils/config";
config({ path: ".env" });

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: appConfig.DATABASE_URL!,
  },
});
