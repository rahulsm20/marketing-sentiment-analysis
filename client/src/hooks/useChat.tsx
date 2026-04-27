import { useApi } from "@/api/ApiContext";
import { MessageType } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

/**
 * Hook for managing chat messages.
 * Takes in conversation id from the page params -> Fetches messages from the server -> Updates the state with the messages
 * Wraps around a ContextWrapper for the chat messages
 * Context contains the messages
 *
 *
 */
export const useChat = () => {
  const conversationId = useParams().id;
  const { chatApi, schedulerApi } = useApi();
  const [messages, setMessages] = useState<MessageType[]>([]);
  // const {messages, }
  const sendMessage = async (message: string) => {
    if (!chatApi || !conversationId) {
      toast("Failed to send message", {
        position: "top-center",
        action: {
          label: "Dismiss",
          onClick: () => console.log("Dismiss"),
        },
      });
      return;
    }
    const response = await chatApi.sendMessage(conversationId, message);
    console.log(response);
  };

  useEffect(() => {
    if (!chatApi || !conversationId || !schedulerApi) return;
    const fetchMessages = async () => {
      const response = await schedulerApi.getMessages(conversationId);
      setMessages(response);
    };
    fetchMessages();
  }, [chatApi, conversationId, schedulerApi]);

  return { messages, sendMessage };
};
