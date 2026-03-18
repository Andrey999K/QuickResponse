export interface TelegramStatusResponse {
  data: {
    is_connected: boolean;
    notifications_enabled: boolean;
    bot_username: string;
    connect_link: string;
  };
}
