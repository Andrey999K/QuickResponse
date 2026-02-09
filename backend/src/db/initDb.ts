import { pool } from './connection';
import bcrypt from "bcrypt";

export async function initDatabase() {
  try {
    console.log('🔄 Initializing database...');

    // 1. Создание таблиц
    await createTables();

    // 2. Очистка существующих данных (опционально)
    // await clearExistingData();

    // 3. Заполнение моковыми данными
    await seedDatabase();

    console.log('✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

async function createTables() {
  const createTablesSQL = `
    -- Удаляем таблицы если они существуют (для пересоздания)
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
    
    -- Создаем индексы
    CREATE INDEX idx_users_email ON users(email);
  `;

  await pool.query(createTablesSQL);
  console.log('✅ Tables created successfully');
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


  const users = [
    { email: 'alice@example.com', username: 'alice123' },
    { email: 'bob@example.com', username: 'bob456' },
    { email: 'charlie@example.com', username: 'charlie789' },
    { email: 'diana@example.com', username: 'diana101' },
    { email: 'evan@example.com', username: 'evan202' },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash("12345", saltRounds);
    await pool.query(
      `INSERT INTO users (email, username, password) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (email) DO NOTHING`,
      [user.email, user.username, hashedPassword]
    );
  }
  console.log('✅ Mock data inserted successfully');
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