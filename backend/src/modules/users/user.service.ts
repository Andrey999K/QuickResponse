import bcrypt from "bcrypt";
import { User } from "./user.types";
import { pool } from "@/config/db/connection";

export class UserService {
  async createUser(
    email: string,
    username: string,
    password: string
  ): Promise<User> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const query = {
        text: "INSERT INTO users(email, username, password) VALUES($1, $2, $3) RETURNING *",
        values: [email, username, hashedPassword],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Error while create new users");
    }
  }

  async getUser(userId: number): Promise<User | null> {
    try {
      const query = {
        text: "SELECT id, email, username FROM users WHERE id = $1",
        values: [userId]
      }
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Error get users");
    }
  }

  async userExists(email: string, username: string): Promise<boolean> {
    try {
      const query = {
        text: "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1 OR username = $2) as exists",
        values: [email, username],
      };
      const result = await pool.query(query);
      return result.rows[0].exists;
    } catch (error) {
      console.error("Error checking user existence:", error);
      throw new Error("Error checking user");
    }
  }

  getAllUsers(): Promise<{ rows: User[] }> {
    try {
      return pool.query("SELECT * FROM users");
    } catch (error) {
      console.error(error);
      throw new Error("Error while get all users");
    }
  }

  /**
   * Получить пользователя по ID с telegram полями
   */
  async getUserById(userId: number): Promise<User | null> {
    try {
      const query = {
        text: "SELECT id, email, username, telegram_id, telegram_notifications_enabled, created_at FROM users WHERE id = $1",
        values: [userId],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Error get user by id:", error);
      throw new Error("Error get user by id");
    }
  }

  /**
   * Установить токен для подключения Telegram
   */
  async setTelegramConnectToken(userId: number, token: string): Promise<void> {
    try {
      // В реальном проекте лучше использовать Redis с TTL
      // Для простоты сохраняем в отдельную таблицу или кэш
      const query = {
        text: `
          INSERT INTO telegram_connect_tokens (user_id, token, expires_at)
          VALUES ($1, $2, NOW() + INTERVAL '10 minutes')
          ON CONFLICT (user_id) DO UPDATE SET
            token = $2,
            expires_at = NOW() + INTERVAL '10 minutes'
        `,
        values: [userId, token],
      };
      await pool.query(query);
    } catch (error) {
      console.error("Error set telegram connect token:", error);
      throw new Error("Error set telegram connect token");
    }
  }

  /**
   * Проверить и получить пользователя по токену
   */
  async getUserByTelegramToken(token: string): Promise<User | null> {
    try {
      const query = {
        text: `
          SELECT u.id, u.email, u.username, u.telegram_id, u.telegram_notifications_enabled, u.created_at
          FROM telegram_connect_tokens t
          JOIN users u ON t.user_id = u.id
          WHERE t.token = $1 AND t.expires_at > NOW()
        `,
        values: [token],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Error get user by telegram token:", error);
      throw new Error("Error get user by telegram token");
    }
  }

  /**
   * Подключить Telegram к пользователю
   */
  async connectTelegram(userId: number, telegramId: string): Promise<void> {
    try {
      const query = {
        text: `
          UPDATE users
          SET telegram_id = $1, telegram_notifications_enabled = TRUE
          WHERE id = $2
        `,
        values: [telegramId, userId],
      };
      await pool.query(query);
    } catch (error) {
      console.error("Error connect telegram:", error);
      throw new Error("Error connect telegram");
    }
  }

  /**
   * Отключить Telegram от пользователя
   */
  async disconnectTelegram(userId: number): Promise<void> {
    try {
      const query = {
        text: `
          UPDATE users
          SET telegram_id = NULL, telegram_notifications_enabled = FALSE
          WHERE id = $1
        `,
        values: [userId],
      };
      await pool.query(query);
    } catch (error) {
      console.error("Error disconnect telegram:", error);
      throw new Error("Error disconnect telegram");
    }
  }

  /**
   * Включить/выключить Telegram уведомления
   */
  async setTelegramNotificationsEnabled(userId: number, enabled: boolean): Promise<void> {
    try {
      const query = {
        text: `
          UPDATE users
          SET telegram_notifications_enabled = $1
          WHERE id = $2
        `,
        values: [enabled, userId],
      };
      await pool.query(query);
    } catch (error) {
      console.error("Error set telegram notifications enabled:", error);
      throw new Error("Error set telegram notifications enabled");
    }
  }

  /**
   * Включить/выключить Telegram уведомления по chat_id
   */
  async setTelegramNotificationsEnabledByChatId(telegramId: string, enabled: boolean): Promise<void> {
    try {
      const query = {
        text: `
          UPDATE users
          SET telegram_notifications_enabled = $1
          WHERE telegram_id = $2
        `,
        values: [enabled, telegramId],
      };
      await pool.query(query);
    } catch (error) {
      console.error("Error set telegram notifications enabled by chat id:", error);
      throw new Error("Error set telegram notifications enabled by chat id");
    }
  }

  /**
   * Получить пользователя по telegram_id
   */
  async getUserByTelegramId(telegramId: string): Promise<User | null> {
    try {
      const query = {
        text: "SELECT id, email, username, telegram_id, telegram_notifications_enabled, created_at FROM users WHERE telegram_id = $1",
        values: [telegramId],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Error get user by telegram id:", error);
      throw new Error("Error get user by telegram id");
    }
  }
}
