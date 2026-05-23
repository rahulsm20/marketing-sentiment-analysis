import { useApi } from "@/api/ApiContext";
import { ConversationItem } from "@/types";
import { LOCAL_CACHE_KEYS } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

export const useConversation = () => {
  const { schedulerApi } = useApi();
  const id = useParams().id;
  const [conversation, setConversation] = useState<ConversationItem | null>();
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
  return {
    loading: isPending,
    error,
    data: conversation,
  };
};
