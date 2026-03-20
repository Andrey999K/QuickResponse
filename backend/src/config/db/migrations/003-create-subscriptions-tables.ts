import { pool } from "../connection";
import { logger } from "@/utils/log";

/**
 * Миграция: Создание таблиц для системы подписок
 * - subscription_tiers: тарифные планы
 * - subscriptions: активные подписки пользователей
 */
export async function createSubscriptionsTables() {
  try {
    logger.info("[Migration] Создание таблиц для системы подписок...");

    // Создаем таблицу subscription_tiers
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscription_tiers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        price INTEGER NOT NULL DEFAULT 0,
        check_interval INTEGER NOT NULL DEFAULT 10,
        telegram_enabled BOOLEAN DEFAULT FALSE,
        ai_enabled BOOLEAN DEFAULT FALSE,
        custom_prompt_enabled BOOLEAN DEFAULT FALSE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    logger.info("[Migration] Таблица subscription_tiers создана");

    // Создаем таблицу subscriptions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tier_id INTEGER NOT NULL REFERENCES subscription_tiers(id),
        start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        payment_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, tier_id)
      );

      CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_tier_id ON subscriptions(tier_id);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_is_active ON subscriptions(is_active);
    `);

    logger.info("[Migration] Таблица subscriptions создана");

    // Создаем seed данные для тарифов
    await pool.query(`
      INSERT INTO subscription_tiers (name, price, check_interval, telegram_enabled, ai_enabled, custom_prompt_enabled, description)
      VALUES 
        ('Free', 0, 10, FALSE, FALSE, FALSE, 'Бесплатный тариф: проверка раз в 10 минут, только in-app уведомления'),
        ('Basic', 99, 5, FALSE, FALSE, FALSE, 'Базовый тариф: проверка раз в 5 минут, только in-app уведомления'),
        ('Standard', 199, 5, TRUE, FALSE, FALSE, 'Стандарт: проверка раз в 5 минут, Telegram + in-app уведомления'),
        ('Pro', 299, 5, TRUE, TRUE, FALSE, 'Pro: проверка раз в 5 минут, Telegram + AI сопроводительные письма'),
        ('Premium', 399, 5, TRUE, TRUE, TRUE, 'Premium: все возможности + кастомный промпт для AI')
      ON CONFLICT (name) DO NOTHING
    `);

    logger.info("[Migration] Тарифы созданы");

    // Добавляем поле subscription_tier_id в users для быстрого доступа к текущему тарифу
    // По умолчанию все пользователи получают Free тариф (id=1)
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS subscription_tier_id INTEGER DEFAULT 1 REFERENCES subscription_tiers(id)
    `);

    logger.info("[Migration] Поле subscription_tier_id добавлено в users");

    // Обновляем существующих пользователей на Free тариф
    await pool.query(`
      UPDATE users 
      SET subscription_tier_id = 1 
      WHERE subscription_tier_id IS NULL
    `);

    logger.info("[Migration] Существующие пользователи обновлены на Free тариф");

    // Создаем индекс
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_subscription_tier_id ON users(subscription_tier_id)
    `);

    logger.info("[Migration] Индекс на subscription_tier_id создан");

    logger.info("[Migration] Таблицы для системы подписок созданы успешно");
  } catch (error) {
    logger.error(`[Migration] Ошибка создания таблиц подписок: ${(error as Error).message}`);
    throw error;
  }
}
