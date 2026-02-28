import { useAuth0 } from "@auth0/auth0-react";
import { GanttChart, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { LoginButton, LogoutButton } from "./ActionButtons";
import { ModeToggle } from "./ModeToggle";

const Navbar = () => {
  const { user } = useAuth0();

  const ProtectedNavItems = () => {
    return (
      <>
        <li>
          <Link
            to="/home"
            title="Home"
            className="flex gap-1 items-center justify-center"
          >
            <GanttChart />
          </Link>
        </li>
        {/* <li>
          <Link
            to="/analytics"
            className="flex gap-1 items-center justify-center"
          >
            <span>Analytics</span>
          </Link>
        </li> */}
      </>
    );
  };

  const PublicNavItems = () => {
    return (
      <>
        <li>
          <Link to="/">
            <GanttChart />
          </Link>
        </li>
        {/* <li> */}
        {/*   <Link to="/about" className="flex gap-1 items-center justify-center"> */}
        {/*     <Info /> */}
        {/*   </Link> */}
        {/* </li> */}
      </>
    );
  };

  return (
    <nav className="md:flex justify-between items-center text-sm top-0 bg-transparent z-50 backdrop-blur-lg border-b flex-wrap hidden md:flex-row md:gap-0 gap-2 sticky">
      <div className="flex items-center gap-5">
        <ul className="flex justify-end p-3 gap-5">
          {!user && <PublicNavItems />}
          {user && <ProtectedNavItems />}
        </ul>
      </div>
      {user ? (
        <ul className="flex p-3 gap-5 items-center justify-center">
          <Avatar
            className="h-6 w-6 rounded-full"
            title={user?.name || "User Avatar"}
          >
            <AvatarImage
              src={user?.picture}
              alt={user?.name || "User Avatar"}
              title={user?.name || "User Avatar"}
            />
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <li>
            <ModeToggle />
          </li>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup className="flex flex-col gap-2">
                <DropdownMenuLabel>
                  Signed in as <br />
                  <span className="font-medium">{user?.email}</span>
                </DropdownMenuLabel>
                <Separator />
                <DropdownMenuItem>
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
    </nav>
  );
};

export default Navbar;
