import { useApi } from "@/api/ApiContext";
import { ConversationItem, MessageType } from "@/types";
import {
  LOADING_STATES,
  LOCAL_CACHE_KEYS,
  POLLING_INTERVAL,
} from "@/utils/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
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
export const useChat = (conversation?: ConversationItem | null) => {
  const conversationId = useParams().id;
  const { chatApi, schedulerApi } = useApi();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { isPending: messagesPending, error: messagesError } = useQuery({
    queryKey: [LOCAL_CACHE_KEYS.MESSAGES(conversationId || "")],
    enabled: !!conversationId,
    retry: false,
    refetchInterval: () => {
      return conversation && LOADING_STATES.includes(conversation.status)
        ? POLLING_INTERVAL
        : false;
    },
    queryFn: async () => {
      if (!conversationId) throw new Error("No id");
      if (!schedulerApi) throw new Error("No schedulerApi");
      const res = await schedulerApi?.getMessages(conversationId);
      setMessages(res);
      return res;
    },
  });

  const {
    isPending: sendingMessage,
    error: errorSendingMessage,
    mutate: sendMessage,
  } = useMutation({
    mutationKey: [LOCAL_CACHE_KEYS.MESSAGES(conversationId || "")],
    // refetchInterval: () => {
    //   return conversation && LOADING_STATES.includes(conversation.status)
    //     ? POLLING_INTERVAL
    //     : false;
    // },
    mutationFn: async ({
      conversationId,
      message,
    }: {
      conversationId: string;
      message: string;
    }) => {
      if (!chatApi || !conversationId || !message) {
        throw new Error("No chatApi or conversationId");
      }
      const response = await chatApi.sendMessage(conversationId, message);
      return response;
    },
  });

  const onSendMessage = async (message: string) => {
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
    const response = await sendMessage({ conversationId, message });
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

  useEffect(() => {
    if (errorSendingMessage) {
      toast(`Failed to send message: ${errorSendingMessage}`, {
        position: "top-center",
        action: {
          label: "Dismiss",
          onClick: () => console.log("Dismiss"),
        },
      });
    }
  }, [errorSendingMessage]);

  return {
    messages,
    sendMessage: onSendMessage,
    loading: messagesPending,
    error: messagesError,
    sendingMessage,
    errorSendingMessage,
  };
};
