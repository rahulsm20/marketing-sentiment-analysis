import { schedulerApi } from "@/api/auth0";
import ChatUI from "@/components/user/ChatUI";
import Navbar from "@/components/user/Navbar";
import Sidebar from "@/components/user/Sidebar";
import { Stopwatch } from "@/components/user/Stopwatch";
import { ConversationItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

//--------------------------------------------------------------------------

const Conversation = () => {
  const id = useParams().id;
  const [conversation, setConversation] = useState<ConversationItem | null>(
    null
  );

  const { isPending, error } = useQuery({
    queryKey: [`conversationData:${id}`],
    enabled: !!id,
    retry: false,
    queryFn: () =>
      id &&
      schedulerApi.getConversation(id).then((res) => {
        setConversation(res);
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

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-col md:flex-row overflow-hidden">
        <div className="md:w-62 shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 overflow-y-auto custom-scroll">
          {isPending || conversation?.status == "pending" ? (
            <div className="flex gap-5 items-center justify-center min-h-screen w-full">
              <Stopwatch />
            </div>
          ) : (
            <ChatUI messages={conversation?.messages || []} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversation;
