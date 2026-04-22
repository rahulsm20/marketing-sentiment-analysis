import { useApi } from "@/api/ApiContext";
import ChatUI from "@/components/user/ChatUI";
import Navbar from "@/components/user/Navbar";
import Sidebar from "@/components/user/Sidebar";
import { Stopwatch } from "@/components/user/Stopwatch";
import { ConversationItem, MessageType } from "@/types";
import { getLoadingTitle } from "@/utils";
import { LOCAL_CACHE_KEYS } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

//--------------------------------------------------------------------------

const Conversation = () => {
  const { schedulerApi } = useApi();
  const id = useParams().id;
  const [conversation, setConversation] = useState<ConversationItem | null>(
    null,
  );
  const [messages, setMesages] = useState<MessageType[]>([]);
  const LOADING_STATES = ["scraping", "generation", "embedding", "pending"];
  const { isPending, error } = useQuery({
    queryKey: [LOCAL_CACHE_KEYS.CONVERSATION(id || "")],
    enabled: !!id,
    retry: false,
    queryFn: () =>
      id &&
      schedulerApi?.getConversation(id).then((res) => {
        setConversation(res);
        return res;
      }),
  });
  const { isPending: messagesPending, error: messagesError } = useQuery({
    queryKey: [LOCAL_CACHE_KEYS.MESSAGES(id || "")],
    enabled: !!id,
    retry: false,
    queryFn: () =>
      id &&
      schedulerApi?.getMessages(id).then((res) => {
        setMesages(res);
        return res;
      }),
  });
  if (error) {
    toast(`Failed to fetch conversation ${id}`, {
      position: "top-center",
      action: {
        label: "Dismiss",
        onClick: () => console.log("Dismiss"),
      },
    });
  }
  if (messagesError) {
    toast(`Failed to fetch messages for conversation ${id}`, {
      position: "top-center",
      action: {
        label: "Dismiss",
        onClick: () => console.log("Dismiss"),
      },
    });
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-col md:flex-row overflow-hidden">
        <div className="md:w-62 shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 overflow-y-auto custom-scroll">
          {isPending ||
          messagesPending ||
          (conversation?.status &&
            LOADING_STATES.includes(conversation?.status)) ? (
            <div className="flex gap-5 items-center justify-center min-h-screen w-full">
              <Stopwatch title={getLoadingTitle(conversation?.status)} />
            </div>
          ) : (
            <ChatUI messages={messages || []} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversation;
