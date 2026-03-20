import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { authMiddleware } from "@/middleware/auth.middleware";

const router = Router();
const notificationService = new NotificationService();
const controller = new NotificationController(notificationService);

// Все роуты требуют аутентификации
router.use(authMiddleware);

// GET /api/notifications - Получить уведомления пользователя
router.get("/", (req, res) => controller.getNotifications(req, res));

// GET /api/notifications/unread - Получить количество непрочитанных
router.get("/unread", (req, res) => controller.getUnreadCount(req, res));

// POST /api/notifications/:id/read - Отметить как прочитанное
router.post("/:id/read", (req, res) => controller.markAsRead(req, res));

// POST /api/notifications/read-all - Отметить все как прочитанное
router.post("/read-all", (req, res) => controller.markAllAsRead(req, res));

// DELETE /api/notifications/:id - Удалить уведомление
router.delete("/:id", (req, res) => controller.deleteNotification(req, res));

export { router as notificationRoutes };
