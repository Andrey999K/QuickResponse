/**
 * Скрипт миграции базы данных
 * Добавляет новые таблицы и поля, не удаляя существующие данные
 */

import { pool } from "@/config/db/connection";
import { logger } from "@/utils/log";
import { changeVacancySalaryToText } from "@/config/db/migrations/002-change-vacancy-salary-to-text";
import { createSubscriptionsTables } from "@/config/db/migrations/003-create-subscriptions-tables";
import { addSubscriptionLimits } from "@/config/db/migrations/005-add-subscription-limits";

async function migrate() {
  try {
    logger.info("[Migrate] Начинаем миграцию базы данных...");

    // 1. Добавляем поля в users, если их нет
    await addTelegramFieldsToUsers();

    // 2. Создаем таблицу notifications, если её нет
    await createNotificationsTable();

    // 3. Изменяем тип поля salary в vacancies на TEXT
    await changeVacancySalaryToText();

    // 4. Создаем таблицы для системы подписок
    await createSubscriptionsTables();

    // 5. Добавляем лимиты для тарифов
    await addSubscriptionLimits();

    logger.info("[Migrate] Миграция завершена успешно!");
    process.exit(0);
  } catch (error) {
    logger.error(`[Migrate] Ошибка миграции: ${(error as Error).message}`);
    process.exit(1);
  }
}

async function addTelegramFieldsToUsers() {
  try {
    // Проверяем, существует ли поле telegram_id
    const telegramIdCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'telegram_id'
      );
    `);

    if (!telegramIdCheck.rows[0].exists) {
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN telegram_id VARCHAR(100);
      `);
      logger.info("[Migrate] Добавлено поле telegram_id в users");
    } else {
      logger.info("[Migrate] Поле telegram_id уже существует");
    }

    // Проверяем, существует ли поле telegram_notifications_enabled
    const telegramEnabledCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'telegram_notifications_enabled'
      );
    `);

    if (!telegramEnabledCheck.rows[0].exists) {
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN telegram_notifications_enabled BOOLEAN DEFAULT FALSE;
      `);
      logger.info("[Migrate] Добавлено поле telegram_notifications_enabled в users");
    } else {
      logger.info("[Migrate] Поле telegram_notifications_enabled уже существует");
    }
  } catch (error) {
    logger.error(`[Migrate] Ошибка добавления полей в users: ${(error as Error).message}`);
    throw error;
  }
}

async function createNotificationsTable() {
  try {
    // Проверяем, существует ли таблица notifications
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'notifications'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      await pool.query(`
        CREATE TABLE notifications (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          type VARCHAR(50) DEFAULT 'info',
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX idx_notifications_user_id ON notifications(user_id);
      `);
      logger.info("[Migrate] Таблица notifications создана");
    } else {
      logger.info("[Migrate] Таблица notifications уже существует");
    }
  } catch (error) {
    logger.error(`[Migrate] Ошибка создания таблицы notifications: ${(error as Error).message}`);
    throw error;
  }
}

migrate();
