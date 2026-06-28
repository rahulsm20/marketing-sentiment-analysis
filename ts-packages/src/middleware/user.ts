import { config } from "@/config";
import { JWKS } from "@/utils/jwt";
import { NextFunction, Request, Response } from "express";
import { AuthResult } from "express-oauth2-jwt-bearer";
import { jwtVerify } from "jose";

//-----------------------------------------------------------------------------------

declare global {
  namespace Express {
    interface Request {
      user: AuthResult | undefined;
    }
  }
}

export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.auth;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // const userId = user.payload.sub;
    // const token = user.token;
    // if (!userId) throw new Error("no userid provided");
    // const auth0User = await getUserInfo(token);
    // const dbUser = await getUserById(userId);
    // if (!auth0User?.email) throw new Error("no auth0 entry with email");

    // if (!dbUser) {
    //   const fromDb = await createUser({
    //     id: userId,
    //     email: auth0User.email,
    //   });
    //   req.user = fromDb;
    // } else {
    //   req.user = dbUser;
    // }
    next();
  } catch (error) {
    // logger.info(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const jwtCheck = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: config.AUTH0_BASE_URL,
      audience: config.AUTH0_AUDIENCE,
    });
    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = { header: {}, payload, token };
    req.auth = req.user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
