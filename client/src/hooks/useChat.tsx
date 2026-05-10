import { useApi } from "@/api/ApiContext";
import { MessageType } from "@/types";
import { LOCAL_CACHE_KEYS } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
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
  const { isPending: messagesPending, error: messagesError } = useQuery({
    queryKey: [LOCAL_CACHE_KEYS.MESSAGES(conversationId || "")],
    enabled: !!conversationId,
    retry: false,
    // refetchInterval: () => {
    //   return conversation && LOADING_STATES.includes(conversation.status)
    //     ? POLLING_INTERVAL
    //     : false;
    // },
    queryFn: async () => {
      if (!conversationId) throw new Error("No id");
      if (!schedulerApi) throw new Error("No schedulerApi");
      console.log("sending query here: ", conversationId);
      const res = await schedulerApi?.getMessages(conversationId);
      setMessages(res);
    },
  });

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
    // console.log(response);
    return response;
  };

  useEffect(() => {
    if (messagesError && !messages) {
      toast(
        `Failed to fetch messages for conversation ${conversationId}: ${messagesError}`,
        {
          position: "top-center",
          action: {
            label: "Dismiss",
            onClick: () => console.log("Dismiss"),
          },
        },
      );
    }
  }, [messagesError, conversationId, messages]);
  // useEffect(() => {
  //   if (!chatApi || !conversationId || !schedulerApi) return;
  //   const fetchMessages = async () => {
  //     const response = await schedulerApi.getMessages(conversationId);
  //     setMessages(response);
  //   };
  //   fetchMessages();
  // }, [chatApi, conversationId, schedulerApi]);

  return {
    messages,
    sendMessage,
    loading: messagesPending,
    error: messagesError,
  };
};
