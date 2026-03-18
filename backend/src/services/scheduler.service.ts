import cron from "node-cron";
import type { ScheduledTask } from "node-cron";
import { VacancyService } from "@/modules/vacancies/vacancy.service";
import { ParserService } from "./parser.service";
import { NotificationService } from "@/modules/notifications/notification.service";
import { TelegramService } from "./telegram.service";
import { logger } from "@/utils/log";
import { pool } from "@/config/db/connection";

/**
 * Сервис для планирования задач парсинга
 */
export class SchedulerService {
  private readonly jobs: Map<number, ScheduledTask> = new Map();
  private readonly runningTasks: Set<number> = new Set(); // Отслеживаем выполняющиеся задачи
  private readonly parserService: ParserService;

  constructor(
    vacancyService: VacancyService,
    notificationService: NotificationService,
    telegramService: TelegramService,
  ) {
    this.parserService = new ParserService(vacancyService, notificationService, telegramService);
  }

  /**
   * Инициализация всех активных поисков
   */
  async initialize(): Promise<void> {
    logger.info("[Scheduler] Инициализация планировщика задач...");

    try {
      // Получаем все активные поиски
      const result = await pool.query({
        text: `
          SELECT id, user_id, title, keywords, excluded_text, salary,
                 currency, only_with_salary, area, schedule, employment,
                 experience, cover_letter, count_vacancies, is_active,
                 last_checked_at, created_at, updated_at
          FROM searches
          WHERE is_active = TRUE
        `,
      });

      const searches = result.rows;
      logger.info(`[Scheduler] Найдено ${searches.length} активных поисков`);

      // Запускаем cron-jobs для каждого поиска
      for (const search of searches) {
        this.scheduleSearch(search);
      }

      logger.info("[Scheduler] Планировщик запущен");
    } catch (error) {
      logger.error(`[Scheduler] Ошибка инициализации: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Запланировать поиск
   */
  private scheduleSearch(search: {
    id: number;
    title: string;
    is_active: boolean;
  }): void {
    // Проверяем, есть ли уже задача для этого поиска
    if (this.jobs.has(search.id)) {
      logger.warn(`[Scheduler] Задача для поиска ${search.id} уже существует`);
      return;
    }

    // Интервал проверки: раз в 1 минуту (для тестирования)
    // Для продакшена: "*/10 * * * *" (каждые 10 минут)
    const cronExpression = "*/1 * * * *"; // Каждую минуту

    logger.info(
      `[Scheduler] Планирование поиска "${search.title}" (ID: ${search.id}) каждую минуту`,
    );

    const task = cron.schedule(cronExpression, async () => {
      await this.runSearchTask(search.id);
    });

    this.jobs.set(search.id, task);
    task.start();
  }

  /**
   * Выполнение задачи парсинга
   */
  private async runSearchTask(searchId: number): Promise<void> {
    // Проверяем, не выполняется ли уже задача для этого поиска
    if (this.runningTasks.has(searchId)) {
      logger.warn(`[Scheduler] Задача для поиска ID: ${searchId} уже выполняется, пропускаем`);
      return;
    }

    try {
      // Помечаем задачу как выполняющуюся
      this.runningTasks.add(searchId);
      logger.info(`[Scheduler] Запуск задачи парсинга для поиска ID: ${searchId}`);

      // Получаем данные поиска
      const result = await pool.query({
        text: `
          SELECT id, user_id, title, keywords, excluded_text, salary,
                 currency, only_with_salary, area, schedule, employment,
                 experience, cover_letter, count_vacancies, is_active,
                 last_checked_at, created_at, updated_at
          FROM searches
          WHERE id = $1 AND is_active = TRUE
        `,
        values: [searchId],
      });

      const search = result.rows[0];
      if (!search) {
        logger.warn(`[Scheduler] Поиск ID: ${searchId} не найден или не активен`);
        return;
      }

      // Запускаем парсинг
      const parseResult = await this.parserService.parseVacancies(search);

      // Обновляем last_checked_at
      await this.updateLastCheckedAt(searchId);

      logger.info(
        `[Scheduler] Задача для поиска ID: ${searchId} завершена. ` +
          `Найдено: ${parseResult.totalCount}, Новых: ${parseResult.newCount}`,
      );
    } catch (error) {
      logger.error(
        `[Scheduler] Ошибка выполнения задачи для поиска ID: ${searchId}: ${(error as Error).message}`,
      );
    } finally {
      // Удаляем задачу из выполняющихся
      this.runningTasks.delete(searchId);
    }
  }

  /**
   * Обновление поля last_checked_at
   */
  private async updateLastCheckedAt(searchId: number): Promise<void> {
    try {
      await pool.query({
        text: `
          UPDATE searches
          SET last_checked_at = CURRENT_TIMESTAMP
          WHERE id = $1
        `,
        values: [searchId],
      });
    } catch (error) {
      logger.error(`[Scheduler] Ошибка обновления last_checked_at: ${(error as Error).message}`);
    }
  }

  /**
   * Добавить новый поиск в планировщик
   */
  addSearch(search: { id: number; title: string; is_active: boolean }): void {
    if (search.is_active) {
      this.scheduleSearch(search);
    }
  }

  /**
   * Удалить поиск из планировщика
   */
  removeSearch(searchId: number): void {
    const task = this.jobs.get(searchId);
    if (task) {
      task.stop();
      this.jobs.delete(searchId);
      logger.info(`[Scheduler] Задача для поиска ID: ${searchId} удалена`);
    }
  }

  /**
   * Перезапустить задачу для поиска
   */
  restartSearch(searchId: number, search: { id: number; title: string; is_active: boolean }): void {
    this.removeSearch(searchId);
    if (search.is_active) {
      this.scheduleSearch(search);
    }
  }

  /**
   * Остановить все задачи
   */
  async shutdown(): Promise<void> {
    logger.info("[Scheduler] Остановка всех задач...");

    for (const [id, task] of this.jobs.entries()) {
      task.stop();
      logger.info(`[Scheduler] Задача ID: ${id} остановлена`);
    }

    this.jobs.clear();
    logger.info("[Scheduler] Все задачи остановлены");
  }
}
