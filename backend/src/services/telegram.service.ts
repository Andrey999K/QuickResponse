import TelegramBot from "node-telegram-bot-api";
import { logger } from "@/utils/log";
import { env } from "@/config/env";
import { UserService } from "@/modules/users/user.service";

/**
 * Сервис для работы с Telegram Bot API
 */
export class TelegramService {
  private bot: TelegramBot | null = null;
  private readonly botToken: string;

  constructor(private readonly userService: UserService) {
    this.botToken = env.TELEGRAM_BOT_TOKEN || "";
    
    if (this.botToken) {
      this.bot = new TelegramBot(this.botToken, { polling: true });
      this.setupBot();
      logger.info("[Telegram] Бот инициализирован");
    } else {
      logger.warn("[Telegram] TELEGRAM_BOT_TOKEN не указан, бот не активен");
    }
  }

  /**
   * Настройка бота (обработчики команд)
   */
  private setupBot(): void {
    if (!this.bot) return;

    // Команда /start с параметром (deep link)
    // t.me/QuickResponseBot?start=123 (где 123 - user_id)
    this.bot.onText(/\/start/, async (msg: TelegramBot.Message, match: RegExpExecArray | null) => {
      const chatId = msg.chat.id;
      const userIdFromParam = match?.input?.split('/start ')[1]?.trim();

      if (userIdFromParam) {
        const userId = parseInt(userIdFromParam, 10);
        
        if (isNaN(userId)) {
          this.bot?.sendMessage(chatId, "❌ Неверный формат ссылки");
          return;
        }

        try {
          // Привязываем chat_id к пользователю
          await this.userService.connectTelegram(userId, chatId.toString());
          
          this.bot?.sendMessage(
            chatId,
            `✅ **Telegram подключён!**\n\n` +
            `Теперь вы будете получать уведомления о новых вакансиях.\n\n` +
            `Управление:\n` +
            `/settings - настройки уведомлений\n` +
            `/stop - отключить уведомления`
          );
          logger.info(`[Telegram] Пользователь ${userId} привязан к chat_id ${chatId}`);
        } catch (error) {
          logger.error(`[Telegram] Ошибка привязки: ${(error as Error).message}`);
          this.bot?.sendMessage(chatId, "❌ Ошибка при подключении. Попробуйте позже.");
        }
      } else {
        // Без параметра - приветственное сообщение
        this.bot?.sendMessage(
          chatId,
          `👋 Привет! Я бот QuickResponse.\n\n` +
          `Я присылаю уведомления о новых вакансиях.\n\n` +
          `Для подключения перейдите в личный кабинет и нажмите "Подключить Telegram".`
        );
      }
    });

    // Команда /stop для отключения уведомлений
    this.bot.onText(/\/stop/, async (msg: TelegramBot.Message) => {
      const chatId = msg.chat.id;
      
      try {
        await this.userService.setTelegramNotificationsEnabledByChatId(chatId.toString(), false);
        
        this.bot?.sendMessage(
          chatId,
          `🔕 Уведомления отключены.\n\n` +
          `Для включения используйте /start`
        );
        logger.info(`[Telegram] Уведомления отключены для chat_id ${chatId}`);
      } catch (error) {
        logger.error(`[Telegram] Ошибка отключения: ${(error as Error).message}`);
      }
    });

    // Команда /settings
    this.bot.onText(/\/settings/, async (msg: TelegramBot.Message) => {
      const chatId = msg.chat.id;
      
      try {
        const user = await this.userService.getUserByTelegramId(chatId.toString());
        const enabled = user?.telegram_notifications_enabled ?? false;
        
        this.bot?.sendMessage(
          chatId,
          `⚙️ **Настройки уведомлений**\n\n` +
          `Статус: ${enabled ? '✅ Включены' : '❌ Выключены'}\n\n` +
          `Для изменения настроек перейдите в личный кабинет.`
        );
      } catch (error) {
        logger.error(`[Telegram] Ошибка получения настроек: ${(error as Error).message}`);
      }
    });

    logger.info("[Telegram] Обработчики команд настроены");
  }

  /**
   * Отправить уведомление пользователю
   */
  async sendNotification(telegramId: string, title: string, message: string): Promise<boolean> {
    if (!this.bot) {
      logger.warn("[Telegram] Бот не инициализирован, пропускаем отправку");
      return false;
    }

    try {
      const formattedMessage = `🔔 *${title}*\n\n${message}`;
      
      await this.bot.sendMessage(telegramId, formattedMessage, {
        parse_mode: "Markdown",
      });

      logger.info(`[Telegram] Уведомление отправлено пользователю ${telegramId}`);
      return true;
    } catch (error) {
      logger.error(`[Telegram] Ошибка отправки уведомления: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Отправить уведомление о новых вакансиях
   */
  async notifyNewVacancies(
    telegramId: string,
    searchTitle: string,
    newCount: number,
  ): Promise<boolean> {
    return this.sendNotification(
      telegramId,
      `Новые вакансии по поиску "${searchTitle}"`,
      `Найдено ${newCount} новых вакансий`,
    );
  }
}

// Экспортируем функцию для создания экземпляра (нужен UserService)
export function createTelegramService(userService: UserService): TelegramService {
  return new TelegramService(userService);
}
