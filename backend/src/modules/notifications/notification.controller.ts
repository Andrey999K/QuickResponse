import { Response } from "express";
import { AuthRequest } from "@/types/authRequest";
import { NotificationService } from "./notification.service";

/**
 * Контроллер для работы с уведомлениями
 */
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {
  }

  /**
   * Получить уведомления пользователя
   * GET /api/notifications
   */
  async getNotifications(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const notifications = await this.notificationService.getUserNotifications(
        userId,
        limit,
        offset,
      );

      res.json({
        data: notifications,
        meta: { limit, offset },
      });
    } catch (error) {
      res.status(500).json({
        error: {
          code: "NOTIFICATIONS_FETCH_ERROR",
          message: "Ошибка при получении уведомлений",
        },
      });
    }
  }

  /**
   * Получить количество непрочитанных уведомлений
   * GET /api/notifications/unread
   */
  async getUnreadCount(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const count = await this.notificationService.getUnreadCount(userId);

      res.json({
        data: { count },
      });
    } catch (error) {
      res.status(500).json({
        error: {
          code: "UNREAD_COUNT_ERROR",
          message: "Ошибка при получении количества непрочитанных",
        },
      });
    }
  }

  /**
   * Отметить уведомление как прочитанное
   * POST /api/notifications/:id/read
   */
  async markAsRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const notificationId = parseInt(req.params.id as string);

      const success = await this.notificationService.markAsRead(
        notificationId,
        userId,
      );

      if (success) {
        res.json({
          data: { success: true },
        });
      } else {
        res.status(404).json({
          error: {
            code: "NOTIFICATION_NOT_FOUND",
            message: "Уведомление не найдено",
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        error: {
          code: "MARK_READ_ERROR",
          message: "Ошибка при отметке уведомления",
        },
      });
    }
  }

  /**
   * Отметить все уведомления как прочитанные
   * POST /api/notifications/read-all
   */
  async markAllAsRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const count = await this.notificationService.markAllAsRead(userId);

      res.json({
        data: { count },
      });
    } catch (error) {
      res.status(500).json({
        error: {
          code: "MARK_ALL_READ_ERROR",
          message: "Ошибка при отметке всех уведомлений",
        },
      });
    }
  }

  /**
   * Удалить уведомление
   * DELETE /api/notifications/:id
   */
  async deleteNotification(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const notificationId = parseInt(req.params.id as string);

      const success = await this.notificationService.deleteNotification(
        notificationId,
        userId,
      );

      if (success) {
        res.json({
          data: { success: true },
        });
      } else {
        res.status(404).json({
          error: {
            code: "NOTIFICATION_NOT_FOUND",
            message: "Уведомление не найдено",
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        error: {
          code: "DELETE_ERROR",
          message: "Ошибка при удалении уведомления",
        },
      });
    }
  }
}
