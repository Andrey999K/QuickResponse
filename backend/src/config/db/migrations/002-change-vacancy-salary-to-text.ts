import { pool } from "../connection";
import { logger } from "@/utils/log";

/**
 * Миграция: Изменение типа поля salary в таблице vacancies на TEXT
 * Это позволяет сохранять полную вилку зарплаты (например, "35 000 - 70 000 рублей, на руки")
 * вместо усреднённого числа
 */
export async function changeVacancySalaryToText() {
  try {
    logger.info("[Migration] Изменение типа поля salary в таблице vacancies...");

    // Изменяем тип поля salary с INTEGER на TEXT
    await pool.query(`
      ALTER TABLE vacancies
      ALTER COLUMN salary TYPE TEXT
    `);

    logger.info("[Migration] Тип поля salary изменён на TEXT успешно");
  } catch (error) {
    logger.error(`[Migration] Ошибка изменения типа salary: ${(error as Error).message}`);
    throw error;
  }
}
