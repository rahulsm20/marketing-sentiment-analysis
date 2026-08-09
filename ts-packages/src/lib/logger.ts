import dotenv from "dotenv";
import winston from "winston";
import LokiTransport from "winston-loki";
import { config } from "../config";
const { combine, printf, timestamp, colorize } = winston.format;

const logFormat = (service_name: string) =>
  printf(({ level, message, timestamp, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `[${timestamp}] ${level}: ${message} ${metaString} ${service_name}`;
  });

/**
 * Creates a logger for the given service. Logs to console always; logs to
 * Grafana Loki when LOKI_HOST, LOKI_API_KEY and LOKI_USER_ID is set in the environment.
 *
 * Usage:
 *   import { createLogger } from "@/lib/logger";
 *   const logger = createLogger("my-service");
 *   logger.info("hello");
 */
export function createLogger(service_name: string): winston.Logger {
  dotenv.config();
  const basicAuth = `${config.LOKI_USER_ID}:${config.LOKI_API_KEY}`;

  const logger = winston.createLogger({
    level: "info",
    format: combine(
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      logFormat(service_name),
    ),
    transports: [
      new winston.transports.File({ filename: "error.log", level: "error" }),
      new winston.transports.File({ filename: "combined.log" }),
    ],
  });

  if (process.env.NODE_ENV !== "production") {
    logger.add(
      new winston.transports.Console({
        format: combine(colorize(), logFormat(service_name)),
      }),
    );
  } else {
    logger.add(
      new LokiTransport({
        host: config.LOKI_HOST,
        labels: { service_name },
        json: true,
        basicAuth,
        format: winston.format.json(),
        replaceTimestamp: true,
        onConnectionError: (err) => console.error("loki erro: ", err),
      }),
    );
  }

  // Override console so existing console.log calls also flow through winston
  console.log = (...args) => logger.info(args.join(" "));
  console.error = (...args) => logger.error(args.join(" "));
  console.warn = (...args) => logger.warn(args.join(" "));

  return logger;
}
