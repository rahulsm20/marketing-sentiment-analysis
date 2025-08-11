/**
 * Routes for managing conversations.
 * @module conversationRoutes
 */
//-----------------------------------------------------------------------------------

import express from "express";
import { User } from "../lib/models";
import { Conversation } from "../lib/models/conversation.model";

// ----------------------------------------------------------------------------------

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }
    const conversation = await Conversation.findById(req.params.id)
      .populate("messages")
      .populate("user");

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
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
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    await conversation.deleteOne();

    return res
      .status(200)
      .json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const reqAuth = req.auth;
    if (!reqAuth) {
      return res.status(400).json({ error: "Unauthorized" });
    }
    const user = await User.findOne({ userId: reqAuth.payload.sub });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const conversations = await Conversation.find({ user: user._id });

    return res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export { router as conversationRoutes };
