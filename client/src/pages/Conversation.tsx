import { useApi } from "@/api/ApiContext";
import ChatUI from "@/components/user/ChatUI";
import Navbar from "@/components/user/Navbar";
import Sidebar from "@/components/user/Sidebar";
import { Stopwatch } from "@/components/user/Stopwatch";
import { useChat } from "@/hooks/useChat";
import { ConversationItem } from "@/types";
import { getLoadingTitle } from "@/utils";
import { LOADING_STATES, LOCAL_CACHE_KEYS } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

//--------------------------------------------------------------------------
// const POLLING_INTERVAL = 20000; // MILLISECONDS

const Conversation = () => {
  const { schedulerApi } = useApi();
  const id = useParams().id;
  const [conversation, setConversation] = useState<ConversationItem | null>(
    null,
  );
  const { isPending, error } = useQuery<ConversationItem>({
    queryKey: [LOCAL_CACHE_KEYS.CONVERSATION(id || "")],
    enabled: !!id,
    // refetchInterval: (query) => {
    //   const data = query.state.data;
    //   return data && LOADING_STATES.includes(data.status)
    //     ? POLLING_INTERVAL
    //     : false;
    // },
    queryFn: async () => {
      if (!id) return;
      const res = await schedulerApi!.getConversation(id);
      setConversation(res);
      return res;
    },
  });

  const { messages, loading: messagesPending } = useChat();

  useEffect(() => {
    if (error && !conversation) {
      toast(`Failed to fetch conversation ${id}`, {
        position: "top-center",
        action: {
          label: "Dismiss",
          onClick: () => console.log("Dismiss"),
        },
      });
    }
  }, [error]);

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
