import { pool } from "@/config/db/connection";
import { logger } from "@/utils/log";
import { SubscriptionService } from "@/modules/subscriptions/subscriptions.service";

/**
 * Результат проверки лимита AI
 */
export interface AiLimitCheckResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  reason?: string;
}

/**
 * Сервис для управления лимитами AI генераций
 */
export class AiLimitService {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /**
   * Проверить и сбросить счётчик AI генераций если наступил новый день
   */
  private async resetDailyCounterIfNeeded(searchId: number): Promise<void> {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    await pool.query(
      `
      UPDATE searches
      SET ai_generations_today = 0,
          last_ai_reset_date = $1
      WHERE id = $2 AND last_ai_reset_date < $1
    `,
      [today, searchId],
    );
  }

  /**
   * Проверить лимит AI генераций для поиска
   */
  async checkAiLimit(
    userId: number,
    searchId: number,
    isManual: boolean = false,
  ): Promise<AiLimitCheckResult> {
    try {
      // Сбрасываем счётчик если наступил новый день
      await this.resetDailyCounterIfNeeded(searchId);

      // Получаем тариф пользователя
      const subscription = await this.subscriptionService.getUserSubscription(userId);
      if (!subscription) {
        return {
          allowed: false,
          remaining: 0,
          limit: 0,
          reason: "Подписка не найдена",
        };
      }

      const tier = subscription.tier;
      const limit = isManual ? tier.max_manual_ai : tier.max_auto_ai_per_day;

      // Если лимит 0 — AI недоступен
      if (limit === 0) {
        return {
          allowed: false,
          remaining: 0,
          limit: 0,
          reason: `AI генерации недоступны на тарифе ${tier.name}`,
        };
      }

      // Получаем текущий счётчик AI генераций для поиска
      const searchResult = await pool.query<{
        ai_generations_today: number;
      }>(
        `
        SELECT ai_generations_today
        FROM searches
        WHERE id = $1 AND user_id = $2
      `,
        [searchId, userId],
      );

      if (searchResult.rows.length === 0) {
        return {
          allowed: false,
          remaining: 0,
          limit: 0,
          reason: "Поиск не найден",
        };
      }

      const currentCount = searchResult.rows[0]?.ai_generations_today || 0;
      const remaining = Math.max(0, limit - currentCount);

      if (currentCount >= limit) {
        return {
          allowed: false,
          remaining: 0,
          limit,
          reason: `Дневной лимит AI генераций исчерпан (${currentCount}/${limit})`,
        };
      }

      return {
        allowed: true,
        remaining,
        limit,
      };
    } catch (error) {
      logger.error("Error checking AI limit:", error);
      return {
        allowed: false,
        remaining: 0,
        limit: 0,
        reason: "Ошибка проверки лимита",
      };
    }
  }

  /**
   * Увеличить счётчик AI генераций
   */
  async incrementAiCounter(searchId: number): Promise<number> {
    try {
      const result = await pool.query<{ ai_generations_today: number }>(
        `
        UPDATE searches
        SET ai_generations_today = ai_generations_today + 1
        WHERE id = $1
        RETURNING ai_generations_today
      `,
        [searchId],
      );

      const newCount = result.rows[0]?.ai_generations_today || 0;
      logger.debug(`[AiLimit] AI counter incremented for search ${searchId}: ${newCount}`);

      return newCount;
    } catch (error) {
      logger.error("Error incrementing AI counter:", error);
      return -1;
    }
  }

  /**
   * Получить текущий статус AI лимитов для поиска
   */
  async getAiLimitStatus(
    userId: number,
    searchId: number,
  ): Promise<{
    auto: AiLimitCheckResult;
    manual: AiLimitCheckResult;
  }> {
    const auto = await this.checkAiLimit(userId, searchId, false);
    const manual = await this.checkAiLimit(userId, searchId, true);

    return { auto, manual };
  }
}
