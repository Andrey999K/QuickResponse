import { Response } from "express";
import { AuthRequest } from "@/types/authRequest";
import { UserService } from "@/modules/users/user.service";
import { env } from "@/config/env";

/**
 * Контроллер для работы с Telegram
 */
export class TelegramController {
  constructor(private readonly userService: UserService) {}

  /**
   * Получить статус подключения Telegram
   * GET /api/telegram/status
   */
  async getConnectionStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const user = await this.userService.getUserById(userId);

      if (!user) {
        res.status(404).json({
          error: {
            code: "USER_NOT_FOUND",
            message: "Пользователь не найден",
          },
        });
        return;
      }

      const botUsername = env.TELEGRAM_BOT_USERNAME || "QuickResponseBot";

      res.json({
        data: {
          is_connected: !!user.telegram_id,
          notifications_enabled: user.telegram_notifications_enabled,
          bot_username: botUsername,
          connect_link: `https://t.me/${botUsername}?start=${userId}`,
        },
      });
    } catch (error) {
      res.status(500).json({
        error: {
          code: "TELEGRAM_STATUS_ERROR",
          message: "Ошибка при получении статуса Telegram",
        },
      });
    }
  }

  /**
   * Отключить Telegram
   * POST /api/telegram/disconnect
   */
  async disconnectTelegram(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;

      await this.userService.disconnectTelegram(userId);

      res.json({
        data: {
          success: true,
        },
      });
    } catch (error) {
      res.status(500).json({
        error: {
          code: "TELEGRAM_DISCONNECT_ERROR",
          message: "Ошибка при отключении Telegram",
        },
      });
    }
  }

  /**
   * Включить/выключить Telegram уведомления
   * PATCH /api/telegram/toggle-notifications
   */
  async toggleNotifications(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { enabled } = req.body;

      if (typeof enabled !== "boolean") {
        res.status(400).json({
          error: {
            code: "INVALID_REQUEST",
            message: "Необходимо указать boolean значение enabled",
          },
        });
        return;
      }

      await this.userService.setTelegramNotificationsEnabled(userId, enabled);

      res.json({
        data: {
          success: true,
          enabled,
        },
      });
    } catch (error) {
      res.status(500).json({
        error: {
          code: "TELEGRAM_TOGGLE_ERROR",
          message: "Ошибка при изменении настроек уведомлений",
        },
      });
    }
  }
}
