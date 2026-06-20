import { checkUser, jwtCheck } from "@/shared/src/middleware/user";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { AuthResult } from "express-oauth2-jwt-bearer";
import { config } from "./config";
import { logger } from "./lib/logger";
import { chatRouter } from "./routes/chatRoutes";
dotenv.config();

//----------------------------------------------------------
declare global {
  namespace Express {
    interface Request {
      user: AuthResult | undefined;
    }
  }
}

//----------------------------------------------------------

const app = express();
const port = config.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(jwtCheck as express.RequestHandler);
app.use(checkUser as express.RequestHandler);

app.use("/chat", chatRouter);
app.get("/", async (_req: Request, res: Response) => {
  return res.status(200).json({
    message: "Chat service running",
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

app.get("*", async (_req: Request, res: Response) => {
  return res.status(404).json({ error: "Invalid route" });
});

app.listen(port, () => {
  logger.info(`Chat service is running on port ${port}`);
});
