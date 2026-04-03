/**
 * Routes for managing conversations.
 * @module conversationRoutes
 */
//-----------------------------------------------------------------------------------

import { RABBITMQ_TOPIC } from "@/shared/config";
import {
  deleteConversation,
  getConversationById,
  getConversations,
  getUserById,
} from "@/shared/lib/methods";
import { pubSub } from "@/shared/lib/pubsub";
import express from "express";

// ----------------------------------------------------------------------------------

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }
    const id = req.params.id;
    const conversation = await getConversationById(id);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    switch (conversation.status) {
      case "pending":
        // await rabbitMQ.sendToQueue(
        //   RABBITMQ_TOPIC.SCRAPING,
        //   JSON.stringify(conversation)
        // );
        await pubSub.publish(RABBITMQ_TOPIC.SCRAPING, conversation);
        // conversation.status = RABBITMQ_TOPIC.SCRAPING;
        // await conversation.save();

        break;
      default:
        // await rabbitMQ.sendToQueue(
        //   conversation.status,
        //   JSON.stringify(conversation),
        // );
        const conversationStatus = conversation.status.toUpperCase();
        console.log({
          conversationStatus,
          conversation,
          topic: RABBITMQ_TOPIC[conversationStatus],
        });
        if (Object.keys(RABBITMQ_TOPIC).includes(conversationStatus)) {
          await pubSub.publish(
            RABBITMQ_TOPIC[conversationStatus],
            conversation,
          );
        }

        break;
    }

    return res.status(200).json(conversation);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }
    const id = req.params.id;
    const conversation = await getConversationById(id);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    await deleteConversation(id);
    return res
      .status(200)
      .json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const reqAuth = req.auth;
    if (!reqAuth) {
      return res.status(400).json({ error: "Unauthorized" });
    }
    const userId = reqAuth.payload.sub;
    if (!userId) throw new Error("unauthorized");
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const conversations = await getConversations(user.id);

    return res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export { router as conversationRoutes };
