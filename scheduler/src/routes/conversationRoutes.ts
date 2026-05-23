/**
 * Routes for managing conversations.
 * @module conversationRoutes
 */
//-----------------------------------------------------------------------------------

import { PUBSUB_TOPIC } from "@/shared/src/config";
import {
  deleteConversation,
  getConversationById,
  getConversations,
  getMessages,
  getPdfDocuments,
  getUserById,
} from "@/shared/src/lib/methods";
import { generateMutexKey } from "@/shared/src/lib/mutex";
import { pubSub } from "@/shared/src/lib/pubsub";
import { retrieveCachedData } from "@/shared/src/lib/redis";
import { getFileFromS3 } from "@/shared/src/lib/s3";
import express from "express";

// ----------------------------------------------------------------------------------

const router = express.Router();

router.get("/:id/report", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }
    const id = req.params.id;
    const conversation = await getConversationById(id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    const reports = await getPdfDocuments(id);
    if (!reports || reports.length === 0) {
      return res.status(404).json({ message: "Report not found" });
    }
    let url = "";
    for (const report of reports) {
      const key = `${report.id}_${report.fileName}`;
      try {
        url = await getFileFromS3(key);
      } catch (err) {
        console.log(err);
      }
    }
    if (!url) return res.status(404).json({ message: "Report not found" });
    return res.status(200).json({ url });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/:id/messages", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }
    const id = req.params.id;
    const conversation = await getConversationById(id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    const messages = await getMessages(id);
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

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

    // for retriggering the processing if it fails in between
    switch (conversation.status) {
      case "completed":
        break;
      default:
        const existingLock = await retrieveCachedData(generateMutexKey(id));
        if (existingLock) {
          return res.status(200).json(conversation);
        }
        await pubSub.publish(
          PUBSUB_TOPIC[conversation.status.toUpperCase()],
          conversation,
        );
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

router.post("/:id", async (req, res) => {
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
    const { id: convId } = req.params;
    if (!convId) throw new Error("conversation id is required");
    const conversation = await getConversationById(convId);
    if (!conversation || conversation.userId !== user.id) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    return res.status(200).json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
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
