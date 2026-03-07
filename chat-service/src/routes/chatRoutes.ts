import express from "express";
import { chatController } from "../controllers/chat";

const router = express.Router();

router.post("/", chatController.sendMessage);

// TODO: Add route and controller for retrieving chat history
export { router as chatRouter };
