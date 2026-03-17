export interface INotification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'vacancy';
