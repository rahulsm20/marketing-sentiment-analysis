/**
 * Routes for managing conversations.
 * @module conversationRoutes
 */
//-----------------------------------------------------------------------------------

import { conversationController } from "@/controllers/conversation";
import express from "express";

// ----------------------------------------------------------------------------------

const router = express.Router();

router.get("/:id/report", conversationController.getReport);
router.options("/:id/report", conversationController.getReport);

router.post("/:id/report", conversationController.createReport);

router.get("/:id/messages", conversationController.getMessages);
router.options("/:id/messages", conversationController.getMessages);

router.get("/:id", conversationController.getConversationById);
router.options("/:id", conversationController.getConversationById);

router.delete("/:id", conversationController.deleteConversation);

router.post("/:id", conversationController.createConversation);

router.get("/", conversationController.getAllConversations);
router.options("/", conversationController.getAllConversations);

export { router as conversationRoutes };
