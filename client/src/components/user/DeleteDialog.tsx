import { schedulerApi } from "@/api/auth0";
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
import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

//--------------------------------------------

export function DeleteDialog({
  _id,
  refetch = () => Promise.resolve(),
}: {
  _id: string;
  refetch?: () => Promise<void>;
}) {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);
  const { isLoading } = useQuery({
    queryKey: [`individualConversationData`],
    enabled,
    retry: false,
    queryFn: () =>
      schedulerApi.deleteConversation(_id).then(() => {
        setEnabled(false);
        refetch();
        navigate("/");
        return null;
      }),
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-500 flex gap-1 items-center p-0 h-5"
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
            disabled={isLoading}
            onClick={() => {
              setEnabled(true);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
