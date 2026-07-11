import { config } from "@/config";
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
