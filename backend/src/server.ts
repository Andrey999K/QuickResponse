import compression from "compression";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware/auth.middleware";
import { corsMiddleware } from "./middleware/cors.middleware";
import { errorHandler, notFound } from "@/middleware/error.middleware";
import { env } from "./config/env";
import { testConnection } from "@/config/db/connection";
import { logger } from "@/utils/log";
import { authRoutes } from "@/modules/auth/auth.routes";
import { userRoutes } from "@/modules/users/user.routes";
import { searchRoutes } from "@/modules/search/search.routes";
import { vacancyRoutes } from "@/modules/vacancies/vacancy.routes";
import { notificationRoutes } from "@/modules/notifications/notification.routes";
import { telegramRoutes } from "@/modules/telegram/telegram.routes";
import { aiRoutes } from "@/modules/ai/ai.routes";
import { subscriptionRoutes } from "@/modules/subscriptions/subscriptions.routes";
import { paymentsRoutes } from "@/modules/payments/payments.routes";
import { VacancyService } from "@/modules/vacancies/vacancy.service";
import { NotificationService } from "@/modules/notifications/notification.service";
import { UserService } from "@/modules/users/user.service";
import { SchedulerService } from "@/services/scheduler.service";
import { sseService } from "@/services/sse.service";
import { createTelegramService } from "@/services/telegram.service";
import { AuthRequest } from "@/types/authRequest";

// Глобальный экземпляр планировщика
let schedulerService: SchedulerService;

export const getSchedulerService = () => schedulerService;

const app = express();

const port = env.PORT || 3000;

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Для обработки form data (Robokassa webhook)
app.use(cookieParser());
app.use(corsMiddleware);

if (env.NODE_ENV === "development") app.use(morgan("dev"));

async function main() {

  try {
    // Тестируем подключение
    await testConnection();

    // Инициализируем базу данных (создаём таблицы и заполняем данными)
    // Закомментировано для отладки - раскомментируй при необходимости
    // if (env.NODE_ENV === "development") {
    //   await initDatabase();
    // }

    app.get("/", (_req: Request, res: Response) => {
      res.send("Hello World!");
    });

    app.use("/api/auth", authRoutes);
    app.use("/api/users", authMiddleware, userRoutes);
    app.use("/api/search", authMiddleware, searchRoutes);
    app.use("/api/vacancies", authMiddleware, vacancyRoutes);
    app.use("/api/notifications", authMiddleware, notificationRoutes);
    app.use("/api/telegram", authMiddleware, telegramRoutes);
    app.use("/api/ai", authMiddleware, aiRoutes);
    app.use("/api/subscriptions", subscriptionRoutes);
    app.use("/api/payments", paymentsRoutes);

    // SSE endpoint для уведомлений
    // GET /api/sse/notifications
    app.get("/api/sse/notifications", (req: AuthRequest, res) => {
      // Логируем запрос для отладки
      // logger.info(`[SSE] Request received. Cookies: ${JSON.stringify(req.cookies)}`);

      // Проверяем токен вручную (без middleware)
      const token: string | undefined = req.cookies?.authToken;

      if (!token) {
        logger.warn("[SSE] No token provided");
        res.status(401).json({ message: "No token provided" });
        return;
      }

      try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: number };
        const userId = decoded.userId;

        // Настраиваем SSE заголовки
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no"); // Отключаем буферизацию nginx

        // Добавляем клиента
        sseService.addClient(userId, res);

        logger.info(`[SSE] Client connected. User ID: ${userId}`);
      } catch (error) {
        logger.error(`[SSE] Token verification error: ${(error as Error).message}`);
        res.status(401).json({ message: "Invalid token" });
      }
    });

    // Инициализируем планировщик задач
    const vacancyService = new VacancyService();
    const notificationService = new NotificationService();
    const userService = new UserService();
    const telegramService = createTelegramService(userService);
    
    schedulerService = new SchedulerService(vacancyService, notificationService, telegramService);
    await schedulerService.initialize();

    // Graceful shutdown
    process.on("SIGINT", async () => {
      logger.info("[Server] Graceful shutdown...");
      await schedulerService.shutdown();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      logger.info("[Server] Graceful shutdown...");
      await schedulerService.shutdown();
      process.exit(0);
    });

    app.use(notFound);
    app.use(errorHandler);

    app.listen(port, () => {
      logger.info(`✅ Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();
