import { Request, Response, NextFunction } from 'express';
import { env } from "./config/env";

const allowedOrigin = env.NODE_ENV === 'production'
  ? 'https://myapp.com'
  : 'http://localhost:3000';

export const corsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  res.set({
    // 'Cross-Origin-Opener-Policy': 'same-origin',
    // 'Cross-Origin-Resource-Policy': 'same-origin',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': '*',
    // 'Access-Control-Allow-Methods': ["POST"],
  });
  console.log('Request:', req.method, req.path);
  next();
};
