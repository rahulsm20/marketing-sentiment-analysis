import winston from "winston";
import { config } from "../../utils/config";

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
  return `[${timestamp}] ${level}: ${message} ${metaString}`;
});

export const logger = winston.createLogger({
  level: config.NODE_ENV === "production" ? "info" : "debug",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

console.log = (...args) => logger.info(args.join(" "));
console.error = (...args) => logger.error(args.join(" "));
console.warn = (...args) => logger.warn(args.join(" "));
