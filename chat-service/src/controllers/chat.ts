import { openAIClient } from "@/lib/openai";
import { getProducts } from "@/shared/src/lib/methods";
import { Request, Response } from "express";

export const chatController = {
  sendMessage: async (req: Request, res: Response) => {
    try {
      const { message, conversation_id, user_id, context } = req.body;
      // create new message in db

      // console.log({ message });
      // const newMessage = await dbServiceApi.messagesPost({
      //   createMessageRequest: {
      //     role: "user",
      //     content: message,
      //     conversationId: conversation_id,
      //     userId: user_id,
      //   },
      // });
      // // fetch messages from db based on conversationId with limit to ensure it fits in context window
      // const messagesResponse = await dbServiceApi.messagesConversationIdGet({
      //   conversationId: conversation_id,
      //   userId: user_id,
      // });
      // const messages = (messagesResponse || []).map((msg) => ({
      //   role: msg.role,
      //   content: msg.content,
      // }));
      // call openai api with messages
      const products = await getProducts({
        query: message,
      });

      if (!message)
        return res.status(400).json({ error: "Message is required" });
      // const messages = [{ role: "user", content: message }];
      const response = await openAIClient.responses.create({
        model: "gpt-5-nano",
        input: message
      });
      return res.status(200).json({ message, response: response.output_text });
    } catch (err) {
      return res.status(500).json({ error: `Internal Server Error ${err}` });
    }
  },
};
