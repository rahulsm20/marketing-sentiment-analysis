import winston from "winston";
import { ElasticsearchTransport } from "winston-elasticsearch";

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
  return `[${timestamp}] ${level}: ${message} ${metaString}`;
});

/**
 * Creates a logger for the given service. Logs to console always; logs to
 * Elasticsearch when ELASTICSEARCH_URL is set in the environment.
 *
 * Usage:
 *   import { createLogger } from "@/lib/logger";
 *   const logger = createLogger("my-service");
 *   logger.info("hello");
 */
export function createLogger(service: string): winston.Logger {
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    }),
  ];

  const esUrl = process.env.ELASTICSEARCH_URL;
  if (esUrl) {
    transports.push(
      new ElasticsearchTransport({
        level: "info",
        index: `logs-${service}`,
        clientOpts: {
          node: esUrl,
          auth: {
            username: process.env.ELASTICSEARCH_USERNAME ?? "elastic",
            password: process.env.ELASTICSEARCH_PASSWORD ?? "",
          },
        },
      })
    );
  }

  const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    defaultMeta: { service },
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    transports,
  });

  // Override console so existing console.log calls also flow through winston
  console.log = (...args) => logger.info(args.join(" "));
  console.error = (...args) => logger.error(args.join(" "));
  console.warn = (...args) => logger.warn(args.join(" "));

  return logger;
}
