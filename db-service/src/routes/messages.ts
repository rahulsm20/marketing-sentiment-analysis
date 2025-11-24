import express from "express";
import { messageController } from "../controllers/message";

const router = express.Router();

router.post("/", messageController.addMessage);
router.get("/:conversationId", messageController.getMessagesByConversationId);
export const MessageRoutes = router;
