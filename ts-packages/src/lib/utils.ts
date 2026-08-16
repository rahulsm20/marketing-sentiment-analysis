import { config } from "@/config";
import { Request } from "express";
import type { Auth0User } from "./types";
export const getUserInfo = async (token: string) => {
  if (!token) return null;
  const response = await fetch(`${config.AUTH0_BASE_URL}/userinfo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const user = (await response.json()) as Auth0User;

  return user;
};

export const generateDocKey = (id: string, fileName: string) => {
  return `${id}_${fileName}`;
};

export const getTokenFromHeader = (req: Request) => {
  if (!req.headers) return null;
  const isProduction = config.NODE_ENV === "production";
  if (isProduction) {
    const tokens = req.headers?.["x-forwarded-authorization"];
    if (!tokens) return null;
    const token = (Array.isArray(tokens) ? tokens?.[0] : tokens)?.split(" ")[1];
    return token;
  }
  const token = req.headers?.authorization?.split(" ")[1];
  return token;
};
