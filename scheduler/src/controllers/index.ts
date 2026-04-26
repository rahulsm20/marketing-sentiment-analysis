//---------------------------------------------------------------------------------

import { PUBSUB_TOPIC } from "@/shared/src/config";
import { createConversation, getUserById } from "@/shared/src/lib/methods";
import { pubSub } from "@/shared/src/lib/pubsub";
import { Request, Response } from "express";
import { IUser } from "../../types";

//---------------------------------------------------------------------------------

declare global {
  namespace Express {
    interface Request {
      user: IUser | undefined;
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

  const userId = req.auth?.payload.sub;
  if (!userId) {
    throw new Error("No UserID included in request");
  }
  const user = await getUserById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const conversation = await createConversation({
    query,
    userId,
  });
  if (!conversation) {
    throw new Error("Failed to create conversation");
  }

  // await createMessage({
  //   conversationId: conversation.id,
  //   userId,
  //   role: "assistant",
  //   content: "Generating analysis for " + query.split("+").join(" ") + "...",
  // });

  await pubSub.publish(PUBSUB_TOPIC.SCRAPING, {
    company,
    category,
    conversationId: conversation.id,
  });
  return res.status(201).json({ conversationId: conversation.id });
};
