import { Queue } from "bullmq";
import { config } from "../../utils/config";
import { redisClient } from "../redis";

export const taskQueue = new Queue(config.RABBITMQ_TOPIC, {
  connection: redisClient,
});
