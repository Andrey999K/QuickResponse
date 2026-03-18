-- Миграция: Добавление поля cover_letter в таблицу vacancies
ALTER TABLE vacancies ADD COLUMN IF NOT EXISTS cover_letter TEXT;
