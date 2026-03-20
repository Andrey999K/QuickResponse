import { Response } from "express";
import { logger } from "@/utils/log";

/**
 * SSE клиент
 */
interface SSEClient {
  userId: number;
  response: Response;
  lastActivity: number;
}

/**
 * Сервис для управления SSE подключениями
 */
export class SSEService {
  private clients: Map<number, SSEClient[]> = new Map();
  private readonly heartbeatInterval = 30000; // 30 секунд
  private readonly cleanupInterval = 60000; // 1 минута

  constructor() {
    // Запускаем очистку неактивных подключений
    setInterval(() => this.cleanupInactiveClients(), this.cleanupInterval);
  }

  /**
   * Добавить SSE подключение
   */
  addClient(userId: number, res: Response): void {
    const existingClients = this.clients.get(userId) || [];

    const client: SSEClient = {
      userId,
      response: res,
      lastActivity: Date.now(),
    };

    existingClients.push(client);
    this.clients.set(userId, existingClients);

    logger.debug(`[SSE] Клиент подключён. User ID: ${userId}, всего подключений: ${existingClients.length}`);

    // Отправляем событие подключения
    this.sendEvent(res, "connected", { message: "Подключение к уведомлениям установлено" });

    // Отправляем heartbeat
    const heartbeat = setInterval(() => {
      this.sendEvent(res, "heartbeat", { timestamp: new Date().toISOString() });
    }, this.heartbeatInterval);

    // Очищаем интервал при закрытии соединения
    res.on("close", () => {
      clearInterval(heartbeat);
      this.removeClient(userId, res);
    });
  }

  /**
   * Удалить SSE подключение
   */
  removeClient(userId: number, res: Response): void {
    const existingClients = this.clients.get(userId) || [];
    const filteredClients = existingClients.filter((c) => c.response !== res);

    if (filteredClients.length === 0) {
      this.clients.delete(userId);
      logger.debug(`[SSE] Клиент отключён. User ID: ${userId}`);
    } else {
      this.clients.set(userId, filteredClients);
      logger.debug(`[SSE] Клиент отключён. User ID: ${userId}, осталось подключений: ${filteredClients.length}`);
    }
  }

  /**
   * Отправить уведомление пользователю
   */
  sendNotification(userId: number, notification: {
    id: number;
    title: string;
    message: string;
    type: string;
    created_at: Date;
  }): void {
    const clients = this.clients.get(userId);

    if (!clients || clients.length === 0) {
      logger.debug(`[SSE] Нет активных подключений для User ID: ${userId}`);
      return;
    }

    let successCount = 0;
    for (const client of clients) {
      client.lastActivity = Date.now();
      const success = this.sendEvent(client.response, "notification", notification);
      if (success) {
        successCount++;
      }
    }

    logger.debug(`[SSE] Уведомление отправлено. User ID: ${userId}, успешно: ${successCount}/${clients.length}`);
  }

  /**
   * Получить количество подключений
   */
  getConnectionCount(): number {
    let count = 0;
    for (const clients of this.clients.values()) {
      count += clients.length;
    }
    return count;
  }

  /**
   * Отправить SSE событие
   */
  private sendEvent(res: Response, event: string, data: unknown): boolean {
    try {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      return true;
    } catch (error) {
      logger.error(`[SSE] Ошибка отправки события: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Очистить неактивные подключения
   */
  private cleanupInactiveClients(): void {
    const now = Date.now();
    const maxInactivity = 5 * 60 * 1000; // 5 минут

    for (const [userId, clients] of this.clients.entries()) {
      const activeClients = clients.filter((c) => {
        const isActive = now - c.lastActivity < maxInactivity;
        if (!isActive) {
          try {
            c.response.end();
          } catch {
            // Игнорируем ошибки
          }
        }
        return isActive;
      });

      if (activeClients.length === 0) {
        this.clients.delete(userId);
      } else {
        this.clients.set(userId, activeClients);
      }
    }
  }
}

// Экспортируем глобальный экземпляр
export const sseService = new SSEService();
