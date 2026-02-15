import { Request, Response, NextFunction } from 'express';
import { env } from "../config/env";

const allowedOrigin = env.NODE_ENV === 'production'
  ? 'https://myapp.com'
  : 'http://localhost:3000';

export const corsMiddleware = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  res.set({
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': '*',
  });
  next();
};
