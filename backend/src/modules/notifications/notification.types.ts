/**
 * Типы для модуля уведомлений
 */

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: Date;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'vacancy';

export interface CreateNotificationDTO {
  user_id: number;
  title: string;
  message: string;
  type?: NotificationType;
}

export interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: Date;
}
