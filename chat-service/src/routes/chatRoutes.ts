import express from "express";
import { chatController } from "../controllers/chat";

const router = express.Router();

router.post("/", chatController.sendMessage);

export { router as chatRouter };
