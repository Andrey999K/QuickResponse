// db/connection.ts
import { Pool } from "pg";
import { env } from "@/config/env";
import { formatDateTime } from "@/utils/formatDateTime";

export const pool = new Pool({
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  database: env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Обработка ошибок пула
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// Функция проверки подключения
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    const serverTime = result.rows[0].now;
    console.log("✅ PostgreSQL connected successfully!");
    console.log("   Server time:", formatDateTime(serverTime));
    client.release();
    return true;
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error);
    return false;
  }
}
