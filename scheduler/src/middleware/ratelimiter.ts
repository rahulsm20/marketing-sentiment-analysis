import { config } from "@/shared/src/config";
import { cacheData, retrieveCachedData } from "@/shared/src/lib/redis";
import { NextFunction, Request, Response } from "express";
import ip from "ip";

export const rateLimiter = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const address = ip.address();
  const encoded = Buffer.from(address).toString("base64");
  const cacheKey = `ip:${encoded}`;
  const data = await retrieveCachedData(cacheKey);
  if (data) {
    if (parseInt(data) > config.RATE_LIMIT) {
      return res
        .status(429)
        .json({ message: "Too many requests. Please try again later." });
    } else {
      const rate = parseInt(data) + 1;
      await cacheData(cacheKey, rate.toString(), config.RATE_LIMIT_PERIOD);
    }
  } else {
    await cacheData(cacheKey, "0", config.RATE_LIMIT_PERIOD);
  }
  next();
};
