import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import { logger } from "@/utils/log";

export interface AuthRequest extends Request {
  userId?: number;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Токен не предоставлен",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Неверный формат токена",
      });
    }

    // Проверяем токен (может выбросить ошибку)
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: number };

    // Добавляем userId в request
    req.userId = decoded.userId;

    logger.info(`Token verified for userId: ${decoded.userId}`);
    // console.log("✅ Token verified, userId:", decoded.userId);

    return next();
  } catch (error) {
    // Обрабатываем разные типы ошибок
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Token expired",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    // Любая другая ошибка
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      message: "Error checking token",
    });
  }
};
