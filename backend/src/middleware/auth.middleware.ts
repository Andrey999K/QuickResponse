import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import { logger } from "@/utils/log";
import { AuthRequest } from "@/types/authRequest";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token: string | undefined;

    // 1. Пробуем получить токен из cookies
    if (req.cookies?.authToken) {
      token = req.cookies.authToken;
    }
    // 2. Если нет в cookies, пробуем из заголовка Authorization
    else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // Проверяем токен (может выбросить ошибку)
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: number };

    // Добавляем userId в request
    req.userId = decoded.userId;

    // logger.info(`Token verified for userId: ${decoded.userId}`);

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
    logger.error(`Auth middleware error: ${error}`);
    return res.status(500).json({
      message: "Authentication error",
    });
  }
};
