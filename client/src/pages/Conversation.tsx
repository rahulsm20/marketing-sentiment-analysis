import ChatUI from "@/components/user/ChatUI";
import Navbar from "@/components/user/Navbar";
import Sidebar from "@/components/user/Sidebar";
import { Stopwatch } from "@/components/user/Stopwatch";
import { useChat } from "@/hooks/useChat";
import { useConversation } from "@/hooks/useConversation";
import { getLoadingTitle } from "@/utils";
import { LOADING_STATES } from "@/utils/constants";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

//--------------------------------------------------------------------------
// const POLLING_INTERVAL = 20000; // MILLISECONDS

const Conversation = () => {
  const id = useParams().id;
  const { data: conversation, error, loading: isPending } = useConversation();

  const { messages, loading: messagesPending } = useChat(conversation);

  useEffect(() => {
    if (error && !conversation) {
      toast(`Failed to fetch conversation ${id}: ${error.message}`, {
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
            <div className="flex gap-5 items-center justify-center min-h-screen w-[calc(100%-2rem)]">
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
