import { pool } from "../connection";
import { logger } from "@/utils/log";

/**
 * Миграция: Добавление полей лимитов для тарифов
 * - max_searches: макс. количество поисков
 * - max_auto_ai_per_day: макс. AI авто-генераций в день на один поиск
 * - max_manual_ai: макс. ручных AI генераций через UI
 */
export async function addSubscriptionLimits() {
  try {
    logger.info("[Migration] Добавление полей лимитов для тарифов...");

    // Добавляем новые поля в subscription_tiers
    await pool.query(`
      ALTER TABLE subscription_tiers
      ADD COLUMN IF NOT EXISTS max_searches INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS max_auto_ai_per_day INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS max_manual_ai INTEGER DEFAULT 0
    `);

    logger.info("[Migration] Поля лимитов добавлены в subscription_tiers");

    // Обновляем тарифы с новыми лимитами
    await pool.query(`
      UPDATE subscription_tiers
      SET 
        max_searches = CASE name
          WHEN 'Free' THEN 1
          WHEN 'Basic' THEN 1
          WHEN 'Standard' THEN 2
          WHEN 'Pro' THEN 2
          WHEN 'Premium' THEN 3
          ELSE 1
        END,
        max_auto_ai_per_day = CASE name
          WHEN 'Free' THEN 0
          WHEN 'Basic' THEN 0
          WHEN 'Standard' THEN 0
          WHEN 'Pro' THEN 3
          WHEN 'Premium' THEN 10
          ELSE 0
        END,
        max_manual_ai = CASE name
          WHEN 'Free' THEN 0
          WHEN 'Basic' THEN 0
          WHEN 'Standard' THEN 0
          WHEN 'Pro' THEN 0
          WHEN 'Premium' THEN 10
          ELSE 0
        END
    `);

    logger.info("[Migration] Тарифы обновлены с новыми лимитами");

    // Добавляем поля для счётчика AI генераций в таблицу searches
    await pool.query(`
      ALTER TABLE searches
      ADD COLUMN IF NOT EXISTS ai_generations_today INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS last_ai_reset_date DATE DEFAULT CURRENT_DATE
    `);

    logger.info("[Migration] Поля счётчика AI добавлены в searches");

    logger.info("[Migration] Лимиты для тарифов добавлены успешно");
  } catch (error) {
    logger.error(`[Migration] Ошибка добавления лимитов: ${(error as Error).message}`);
    throw error;
  }
}
