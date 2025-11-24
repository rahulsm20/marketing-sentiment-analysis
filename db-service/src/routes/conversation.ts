import { NeonDbError } from "@neondatabase/serverless";
import express from "express";
import { conversationController } from "../controllers/conversation";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = user.login;
    const { query, status } = req.body;
    const conv = await conversationController.create({
      query,
      status,
      userId,
    });
    return res.json(conv);
  } catch (err) {
    if (err instanceof NeonDbError) {
      return res
        .status(400)
        .json({ error: `Database Error`, message: err.message });
    }
    return res
      .status(500)
      .json({ error: `Internal Server Error`, message: err });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = user.login;

    const { status } = req.body;
    const conv = await conversationController.update({
      id,
      status,
      userId,
    });
    return res.json(conv);
  } catch (err) {
    if (err instanceof NeonDbError) {
      return res
        .status(400)
        .json({ error: `Database Error`, message: err.message });
    }
    return res
      .status(500)
      .json({ error: `Internal Server Error`, message: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = user.login;
    const conv = await conversationController.getById(id, userId);
    return res.json(conv);
  } catch (err) {
    if (err instanceof NeonDbError) {
      return res
        .status(400)
        .json({ error: `Database Error`, message: err.message });
    }
    return res
      .status(500)
      .json({ error: `Internal Server Error`, message: err });
  }
});

export { router as ConversationRoutes };
