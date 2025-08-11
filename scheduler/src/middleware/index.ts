import { NextFunction, Request, Response } from "express";
import { User } from "../lib/models";

//-----------------------------------------------------------------------------------

export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.auth;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = user.payload.sub;
    const dbUser = await User.findOne({ userId });
    if (!dbUser) {
      const fromDb = await User.create({
        userId,
      });
      req.user = fromDb;
    } else {
      req.user = dbUser;
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
