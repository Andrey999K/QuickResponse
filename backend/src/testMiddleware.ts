import { Request, Response, NextFunction } from 'express';

export const testMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  console.log('Request:', req.method, req.path);
  next();
};
