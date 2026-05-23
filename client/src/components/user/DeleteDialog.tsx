import { useApi } from "@/api/ApiContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ConversationItem } from "@/types";
import { LOCAL_CACHE_KEYS } from "@/utils/constants";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

//--------------------------------------------

export function DeleteDialog({
  _id,
  refetch,
}: {
  _id: string;
  refetch?: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<ConversationItem[], Error>>;
}) {
  const { schedulerApi } = useApi();
  const navigate = useNavigate();
  const deleteMutation = useMutation({
    mutationKey: ["delete", LOCAL_CACHE_KEYS.CONVERSATION(_id)],
    retry: false,
    mutationFn: async () => {
      await schedulerApi?.deleteConversation(_id);
    },
    onSuccess: async () => {
      await refetch?.();
      navigate("/home", { replace: true });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full text-red-500 hover:text-red-500 flex gap-1 items-center p-0 h-5"
          title="Click to delete this conversation"
        >
          <Trash2 className="h-3 w-3" />
          <span>Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            conversation and remove related data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteMutation.isPending}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteMutation.mutate();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
