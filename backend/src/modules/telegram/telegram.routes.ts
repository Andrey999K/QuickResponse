import { Router } from "express";
import { TelegramController } from "./telegram.controller";
import { UserService } from "@/modules/users/user.service";
import { authMiddleware } from "@/middleware/auth.middleware";

const router = Router();
const userService = new UserService();
const controller = new TelegramController(userService);

// Все роуты требуют аутентификации
router.use(authMiddleware);

// GET /api/telegram/status - Получить статус подключения
router.get("/status", (req, res) => controller.getConnectionStatus(req, res));

// POST /api/telegram/disconnect - Отключить Telegram
router.post("/disconnect", (req, res) => controller.disconnectTelegram(req, res));

// PATCH /api/telegram/toggle-notifications - Вкл/Выкл уведомления
router.patch("/toggle-notifications", (req, res) => controller.toggleNotifications(req, res));

export { router as telegramRoutes };
