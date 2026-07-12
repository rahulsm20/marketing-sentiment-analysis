import { config } from "@/config";
import { openAIClient } from "@/lib/openai";
import { createMessage, getConversationById } from "@/shared/src/lib/methods";
import { searchProductsVectors } from "@/shared/src/lib/pinecode";
import { Request, Response } from "express";

export const chatController = {
  sendMessage: async (req: Request, res: Response) => {
    try {
      const { conversationId, message } = req.body;
      const userId = req.auth?.payload.sub;
      if (!conversationId)
        return res.status(400).json({ error: "Conversation ID is required" });
      const conv = await getConversationById(conversationId);
      if (!conv)
        return res.status(404).json({ error: "Conversation not found" });

      const query = conv.query;
      if (!query) return res.status(400).json({ error: "Query is required" });

      // write a proper util to get the full context
      // - get the conversation history
      // - collapse context when necessary
      // improve prompt
      // - mention that the score is just vector similarity score
      //
      const vectors = await searchProductsVectors(query);

      const fullContext =
        message +
        `Given context of products and their reviews: ${JSON.stringify(vectors)}`;

      const response = await openAIClient.responses.create({
        model: config.OPEN_AI_MODEL,
        input: fullContext,
      });

      await createMessage({
        conversationId,
        userId,
        content: message,
        role: "user",
      });

      await createMessage({
        conversationId,
        content: response.output_text,
        role: "assistant",
      });

      return res.status(200).json({ message, response: response.output_text });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: `Internal Server Error ${err}` });
    }
  },
};
