import "dotenv/config";

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: Number(process.env.DB_PORT),
  DB_NAME: process.env.DB_NAME!,
  CORS_ORIGIN: process.env.CORS_ORIGIN!,
  JWT_SECRET: process.env.JWT_SECRET!,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "",
  TELEGRAM_BOT_USERNAME: process.env.TELEGRAM_BOT_USERNAME || "MyQuickResponseBot",
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
  ROBOKASSA_MERCHANT_ID: process.env.ROBOKASSA_MERCHANT_ID || "",
  ROBOKASSA_SECRET_KEY_1: process.env.ROBOKASSA_SECRET_KEY_1 || "",
  ROBOKASSA_SECRET_KEY_2: process.env.ROBOKASSA_SECRET_KEY_2 || "",
  ROBOKASSA_TEST_SECRET_KEY_1: process.env.ROBOKASSA_TEST_SECRET_KEY_1 || "",
  ROBOKASSA_TEST_SECRET_KEY_2: process.env.ROBOKASSA_TEST_SECRET_KEY_2 || "",
  ROBOKASSA_TEST_MODE: process.env.ROBOKASSA_TEST_MODE === "true",
};
