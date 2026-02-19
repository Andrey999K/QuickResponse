// db/connection.ts
import { Pool } from "pg";
import { env } from "@/config/env";
import { formatDateTime } from "@/utils/formatDateTime";
import { logger } from "@/utils/log";

export const pool = new Pool({
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  database: env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  options: "-c lc_messages=en_US.UTF-8",
});

// Обработка ошибок пула
pool.on("error", (err) => {
  logger.error("Unexpected error on idle client: " + err);
  process.exit(-1);
});

// Функция проверки подключения
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    const serverTime = result.rows[0].now;
    logger.info("PostgreSQL connected successfully! Server time: " + formatDateTime(serverTime));
    client.release();
    return true;
  } catch (error) {
    logger.error("PostgreSQL connection failed: " + error);
    return false;
  }
}
