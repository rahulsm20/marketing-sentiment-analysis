import { createRemoteJWKSet } from "jose";

export const JWKS = createRemoteJWKSet(
  new URL("https://dev-5ujusph7eyyt6jyf.us.auth0.com/.well-known/jwks.json"),
);
