import { pool } from './connection';

export async function initDatabase() {
  try {
    console.log('🔄 Initializing database...');

    // 1. Создание таблиц
    await createTables();

    // 2. Очистка существующих данных (опционально)
    await clearExistingData();

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

async function clearExistingData() {
  // Если хотите только очищать данные без удаления таблиц
  const clearSQL = `
    TRUNCATE TABLE users RESTART IDENTITY CASCADE;
  `;

  await pool.query(clearSQL);
  console.log('✅ Existing data cleared');
}

async function seedDatabase() {
  const seedSQL = `
    -- Вставляем тестовых пользователей
    INSERT INTO users (email, username, password) VALUES
      ('alice@example.com', 'alice123', '12345'),
      ('bob@example.com', 'bob456', '12345'),
      ('charlie@example.com', 'charlie789', '12345'),
      ('diana@example.com', 'diana101', '12345'),
      ('evan@example.com', 'evan202', '12345');
  `;

  await pool.query(seedSQL);
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