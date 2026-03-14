import bcrypt from "bcrypt";
import "colors";
import { pool } from "./connection";
import { logger } from "@/utils/log";
import { seedUsers, seedSearches } from "./seeds";

export async function initDatabase() {
  try {
    logger.info("Initializing database...".blue);

    // 1. Создание таблиц
    await createTables();

    // 2. Очистка существующих данных (опционально)
    // await clearExistingData();

    // 3. Заполнение моковыми данными
    await seedDatabase();

    logger.info("Database initialized successfully!".blue);
  } catch (error) {
    logger.error("Database initialization failed: " + error);
    throw error;
  }
}

async function createTables() {
  const createTablesSQL = `
    -- Удаляем таблицы если они существуют (для пересоздания)
    DROP TABLE IF EXISTS searches CASCADE;
    DROP TABLE IF EXISTS users CASCADE;

    -- Создаем таблицу users
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Создаем таблицу searches
    CREATE TABLE searches (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      keywords TEXT,
      excluded_text TEXT,
      salary INTEGER,
      currency VARCHAR(10) DEFAULT 'RUR',
      only_with_salary BOOLEAN DEFAULT FALSE,
      area INTEGER[] DEFAULT '{}',
      schedule VARCHAR(50)[] DEFAULT '{}',
      employment VARCHAR(50)[] DEFAULT '{}',
      experience VARCHAR(50)[] DEFAULT '{}',
      cover_letter TEXT,
      count_vacancies INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Создаем индексы
    CREATE INDEX idx_users_email ON users(email);
    CREATE INDEX idx_searches_user_id ON searches(user_id);
    CREATE INDEX idx_searches_title ON searches(title);
  `;

  await pool.query(createTablesSQL);
  // console.log("✅ Tables created successfully");
}

// async function clearExistingData() {
//   // Если хотите только очищать данные без удаления таблиц
//   const clearSQL = `
//     TRUNCATE TABLE users RESTART IDENTITY CASCADE;
//   `;
//
//   await pool.query(clearSQL);
//   console.log('✅ Existing data cleared');
// }

async function seedDatabase() {
  const saltRounds = 10;

  const userIds = await seedUsers(saltRounds);
  await seedSearches(userIds["test@ma.co"]);

  // console.log("✅ Mock data inserted successfully");
}

// Функция для проверки, существует ли уже база данных (опционально)
export async function shouldInitializeDatabase(): Promise<boolean> {
  try {
    // Проверяем, есть ли уже данные
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    // Если таблицы нет или хотите всегда пересоздавать
    return !result.rows[0].exists;
  } catch (error) {
    return true;
  }
}
