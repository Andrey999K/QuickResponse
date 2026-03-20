import { pool } from "../connection";
import { logger } from "@/utils/log";

/**
 * Миграция: Добавление поля cover_letter в таблицу vacancies
 */
export async function addCoverLetterToVacancies() {
  try {
    logger.info("[Migration] Добавление колонки cover_letter в vacancies...");

    await pool.query(`
      ALTER TABLE vacancies 
      ADD COLUMN IF NOT EXISTS cover_letter TEXT
    `);

    logger.info("[Migration] Колонка cover_letter добавлена успешно");
  } catch (error) {
    logger.error(`[Migration] Ошибка добавления cover_letter: ${(error as Error).message}`);
    throw error;
  }
}
