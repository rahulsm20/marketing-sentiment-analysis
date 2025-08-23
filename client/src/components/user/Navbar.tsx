import { useAuth0 } from "@auth0/auth0-react";
import { GanttChart } from "lucide-react";
import { Link } from "react-router-dom";
import { LoginButton, LogoutButton } from "./ActionButtons";
import { ModeToggle } from "./ModeToggle";

const Navbar = () => {
  const { user } = useAuth0();

  const ProtectedNavItems = () => {
    return (
      <>
        <li>
          <Link to="/home" title='Home' className="flex gap-1 items-center justify-center">
            <GanttChart />
          </Link>
        </li>
        {/* <li> */}
        {/*   <Link */}
        {/*     to="/analytics" */}
        {/*     className="flex gap-1 items-center justify-center" */}
        {/*   > */}
        {/*     <span>Analytics</span> */}
        {/*   </Link> */}
        {/* </li> */}
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
    </nav>
  );
};

export default Navbar;
