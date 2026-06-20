import { config } from "@/utils/config";
import { AuthenticationClient } from "auth0";

export const auth0 = new AuthenticationClient({
  domain: config.AUTH0_DOMAIN,
  clientId: config.AUTH0_CLIENT_ID,
  clientSecret: config.AUTH0_CLIENT_SECRET,
});
