import { clientUrl } from "@/utils/constants";
import { useAuth0 } from "@auth0/auth0-react";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button size="sm" onClick={() => loginWithRedirect()}>
      Log In
    </Button>
  );
};

export const LogoutButton = () => {
  const { logout } = useAuth0();
  const handleLogout = () => {
    try {
      localStorage.clear();
      logout({ logoutParams: { returnTo: clientUrl } });
    } catch (err) {
      console.log(err);
      alert(err);
    }
  };
  return (
    <Button className="flex gap-2" size="sm" onClick={handleLogout}>
      <span>Log Out</span>
      <LogOut className="h-4 w-4" />
    </Button>
  );
};
