import { NextFunction, Request, Response } from "express";
import { env } from "@/config/env";
import { logger } from "@/utils/log";

export const corsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const allowedOrigin = env.NODE_ENV === "production"
    ? env.CORS_ORIGIN
    : "http://localhost:3000";

  res.set({
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
  });

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  logger.debug(`CORS: ${req.method} ${req.path} from ${req.headers.origin}`);
  next();
};
