export type User = {
  id: number,
  email: string,
  username: string,
  password: string,
  telegram_id?: string | null,
  telegram_notifications_enabled?: boolean,
  created_at: string,
  updated_at: string
}