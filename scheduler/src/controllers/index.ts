//---------------------------------------------------------------------------------

import { Request, Response } from "express";
import { IUser } from "../../types";
import { Message, User } from "../lib/models";
import { Conversation } from "../lib/models/conversation.model";
import { rabbitMQ } from "../lib/rabbitmq";
import { config } from "../utils/config";

//---------------------------------------------------------------------------------

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

//---------------------------------------------------------------------------------

/**
 * Adds a task to the queue.
 * @param req - The request object.
 * @param res - The response object.
 * @returns A response indicating the result of the operation.
 */
export const addTaskToQueue = async (req: Request, res: Response) => {
  const { company, category } = req.body;

  if (!company || !category) {
    return res
      .status(400)
      .json({ message: "Company and category are required" });
  }
  const query = `${company}+${category}`;

  const user = await User.findOne({
    userId: req.auth?.payload.sub, // Assuming user ID is available in the request
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const conversation = new Conversation({
    query,
    user: user?._id,
  });

  const saved = await conversation.save();

  const message = new Message({
    conversation: saved._id,
    author: "system",
    data: "Generating analysis for " + query.split("+").join(" "),
  });

  await message.save();

  await rabbitMQ.sendToQueue(
    config.RABBITMQ_TOPIC,
    JSON.stringify({ company, category, conversationId: saved._id })
  );
  return res.status(201).json({ conversationId: saved._id });
};
