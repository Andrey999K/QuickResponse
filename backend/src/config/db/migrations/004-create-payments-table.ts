import { pool } from "../connection";
import { logger } from "@/utils/log";

/**
 * Миграция: Создание таблицы для платежей
 * - payments: история платежей пользователей
 */
export async function createPaymentsTable() {
  try {
    logger.info("[Migration] Создание таблицы для платежей...");

    // Создаем таблицу payments
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tier_id INTEGER NOT NULL REFERENCES subscription_tiers(id),
        amount INTEGER NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        robokassa_payment_id VARCHAR(100),
        robokassa_inv_id VARCHAR(100) UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
      CREATE INDEX IF NOT EXISTS idx_payments_tier_id ON payments(tier_id);
      CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
      CREATE INDEX IF NOT EXISTS idx_payments_inv_id ON payments(robokassa_inv_id);
    `);

    logger.info("[Migration] Таблица payments создана");

    logger.info("[Migration] Таблица для платежей создана успешно");
  } catch (error) {
    logger.error(`[Migration] Ошибка создания таблицы платежей: ${(error as Error).message}`);
    throw error;
  }
}
