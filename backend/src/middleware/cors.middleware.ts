import { NextFunction, Request, Response } from "express";
import { env } from "@/config/env";

const allowedOrigin =
  env.NODE_ENV === "production" ? "https://myapp.com" : "http://localhost:3000";

export const corsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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
  next();
};
