import { pool } from "@/config/db/connection";
import type { Notification, CreateNotificationDTO, NotificationResponse } from "./notification.types";
import { logger } from "@/utils/log";

/**
 * Сервис для работы с уведомлениями
 */
export class NotificationService {
  /**
   * Создать уведомление
   */
  async createNotification(dto: CreateNotificationDTO): Promise<Notification> {
    try {
      const query = {
        text: `
          INSERT INTO notifications (user_id, title, message, type)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `,
        values: [
          dto.user_id,
          dto.title,
          dto.message,
          dto.type || 'info',
        ],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      logger.error(`[NotificationService] Ошибка создания уведомления: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Получить уведомления пользователя
   */
  async getUserNotifications(
    userId: number,
    limit = 50,
    offset = 0,
  ): Promise<NotificationResponse[]> {
    try {
      const query = {
        text: `
          SELECT id, title, message, type, is_read, created_at
          FROM notifications
          WHERE user_id = $1
          ORDER BY created_at DESC
          LIMIT $2 OFFSET $3
        `,
        values: [userId, limit, offset],
      };
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      logger.error(`[NotificationService] Ошибка получения уведомлений: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Получить количество непрочитанных уведомлений
   */
  async getUnreadCount(userId: number): Promise<number> {
    try {
      const query = {
        text: `
          SELECT COUNT(*) as count
          FROM notifications
          WHERE user_id = $1 AND is_read = FALSE
        `,
        values: [userId],
      };
      const result = await pool.query(query);
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      logger.error(`[NotificationService] Ошибка получения количества непрочитанных: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Отметить уведомление как прочитанное
   */
  async markAsRead(notificationId: number, userId: number): Promise<boolean> {
    try {
      const query = {
        text: `
          UPDATE notifications
          SET is_read = TRUE
          WHERE id = $1 AND user_id = $2
          RETURNING id
        `,
        values: [notificationId, userId],
      };
      const result = await pool.query(query);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      logger.error(`[NotificationService] Ошибка отметки уведомления как прочитанного: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Отметить все уведомления как прочитанные
   */
  async markAllAsRead(userId: number): Promise<number> {
    try {
      const query = {
        text: `
          UPDATE notifications
          SET is_read = TRUE
          WHERE user_id = $1 AND is_read = FALSE
          RETURNING id
        `,
        values: [userId],
      };
      const result = await pool.query(query);
      return result.rowCount || 0;
    } catch (error) {
      logger.error(`[NotificationService] Ошибка отметки всех уведомлений как прочитанных: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Удалить уведомление
   */
  async deleteNotification(notificationId: number, userId: number): Promise<boolean> {
    try {
      const query = {
        text: `
          DELETE FROM notifications
          WHERE id = $1 AND user_id = $2
          RETURNING id
        `,
        values: [notificationId, userId],
      };
      const result = await pool.query(query);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      logger.error(`[NotificationService] Ошибка удаления уведомления: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Уведомление о новых вакансиях
   */
  async notifyNewVacancies(
    userId: number,
    searchTitle: string,
    newCount: number,
  ): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      title: `Новые вакансии по поиску "${searchTitle}"`,
      message: `Найдено ${newCount} новых вакансий`,
      type: 'vacancy',
    });
  }
}
