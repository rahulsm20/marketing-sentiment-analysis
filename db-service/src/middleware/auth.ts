import { auth } from "express-oauth2-jwt-bearer";
import { config } from "../utils/config";

export const jwtCheck = auth({
  audience: config.AUTH0_AUDIENCE,
  issuerBaseURL: config.AUTH0_BASE_URL,
  tokenSigningAlg: "RS256",
});
