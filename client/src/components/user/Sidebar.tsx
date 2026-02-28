import { schedulerApi } from "@/api/auth0";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ConversationItem } from "@/types";
import { LOCAL_CACHE_KEYS } from "@/utils/constants";
import { useAuth0 } from "@auth0/auth0-react";
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  Ellipsis,
  GanttChart,
  Home,
  Info,
  LineChart,
  PlusCircle,
  SidebarOpen,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { LoginButton, LogoutButton } from "./ActionButtons";
import { DeleteDialog } from "./DeleteDialog";
import { ModeToggle } from "./ModeToggle";

//--------------------------------------------

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const id = useParams()?.id;

  const { logout, user } = useAuth0();

  const handleLogout = async () => {
    await logout({ logoutParams: { returnTo: window.location.origin } });
  };

  // useEffect(() => {
  //   if (!isFetchingAuth && !isAuthenticated) {
  //     handleLogout();
  //   }
  // }, [isFetchingAuth, logout, isAuthenticated]);

  const {
    data: conversations = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [LOCAL_CACHE_KEYS.CONVERSATIONS],
    queryFn: () => schedulerApi.getConversations(),
    retry: false,
  });

  if (error) {
    if (error instanceof AxiosError) {
      switch (error.response?.status) {
        case 401:
          toast(`Your session has expired, logging you out...`, {
            position: "top-center",
            action: {
              label: "Dismiss",
              onClick: () => console.log("Dismiss"),
            },
          });
          setTimeout(() => {
            handleLogout();
          }, 3000);
          return null;
        case 429:
          toast(error.response?.data?.message, {
            position: "top-center",
            action: {
              label: "Dismiss",
              onClick: () => console.log("Dismiss"),
            },
          });
          return null;
      }
    }

    console.error("Failed to fetch conversations", error);
    toast(`Failed to fetch conversations`, {
      position: "top-center",
      action: {
        label: "Dismiss",
        onClick: () => console.log("Dismiss"),
      },
    });
  }

  return (
    <>
      <div className="md:hidden p-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <SidebarOpen />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:w-full md:w-52 p-0">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-lg font-semibold">Menu</span>
            </div>
            <ul className="space-y-2 p-4 list-none">
              <div className="flex flex-col items-start justify-between border-b">
                <ul className="flex justify-end p-3 gap-5">
                  {!user && (
                    <>
                      <li>
                        <Link to="/">
                          <GanttChart />
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/about"
                          className="flex gap-1 items-center justify-center"
                        >
                          <span>About</span>
                          <Info className="h-4 w-4" />
                        </Link>
                      </li>
                    </>
                  )}
                  {user && (
                    <>
                      <li>
                        <Link
                          to="/home"
                          className="flex gap-1 items-center justify-center"
                        >
                          <span>Home</span>
                          <Home className="h-4 w-4" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/analytics"
                          className="flex gap-1 items-center justify-center"
                        >
                          <span>Analytics</span>
                          <LineChart className="h-4 w-4" />
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
                {user ? (
                  <ul className="flex p-3 gap-5 items-center justify-center">
                    {user?.picture && (
                      <li>
                        <img
                          src={user?.picture}
                          alt="Profile"
                          className="w-8 h-8 rounded-full"
                        />
                      </li>
                    )}
                    <li>
                      <LogoutButton />
                    </li>
                    <li>
                      <ModeToggle />
                    </li>
                  </ul>
                ) : (
                  <ul className="flex justify-end p-3 gap-5">
                    <li className="flex gap-5">
                      <div>
                        <LoginButton />
                      </div>
                    </li>
                    <li>
                      <ModeToggle />
                    </li>
                  </ul>
                )}
              </div>
              {isLoading ? (
                <Skeleton className="h-4 w-[250px]" />
              ) : conversations.length > 0 ? (
                <ConversationItems
                  conversations={conversations}
                  refetch={refetch}
                  isLoading={isLoading}
                  id={id}
                />
              ) : (
                <li className="text-muted-foreground text-sm">
                  No conversations found.
                </li>
              )}
            </ul>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-60 h-full border-r p-4 space-y-2 gap-2">
        <div className="flex justify-between items-center">
          <h3 className="dark:text-zinc-300 underline underline-offset-8">
            Chats
          </h3>
          <Link to="/home">
            <Button variant={"ghost"} size={"sm"}>
              <PlusCircle className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <ConversationItems
          conversations={conversations}
          refetch={refetch}
          isLoading={isLoading}
          id={id}
        />
      </div>
    </>
  );
};

const ConversationItems = ({
  conversations,
  refetch,
  isLoading,
  id,
}: {
  conversations: ConversationItem[];
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<ConversationItem[], Error>>;
  isLoading: boolean;
  id: string | undefined;
}) => {
  return isLoading ? (
    <Skeleton className="h-6 w-full" />
  ) : (
    <ul className="flex flex-col gap-2">
      {conversations.length > 0 ? (
        conversations.map(({ query, _id }) => (
          <Link to={`/conversation/${_id}`}>
            <div
              key={_id}
              className={`flex items-center justify-between text-sm px-2 py-1 rounded ${
                _id == id
                  ? "bg-zinc-100 dark:bg-zinc-800"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {query ? query.split("+").join(" ") : "No Query"}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Ellipsis className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <DeleteDialog _id={_id} refetch={refetch} />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Link>
        ))
      ) : (
        <li className="text-muted-foreground text-sm">
          No conversations found.
        </li>
      )}
    </ul>
  );
};
export default Sidebar;
