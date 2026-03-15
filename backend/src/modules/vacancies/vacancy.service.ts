import { pool } from "@/config/db/connection";
import { Vacancy } from "./vacancy.types";

export class VacancyService {
  /**
   * Получить все вакансии по поиску
   */
  async getVacanciesBySearchId(searchId: number): Promise<Vacancy[]> {
    try {
      const query = {
        text: `
          SELECT id, search_id, hh_id, title, company, salary,
                 currency, url, area, schedule, employment, experience,
                 description, is_new, created_at
          FROM vacancies
          WHERE search_id = $1
          ORDER BY created_at DESC
        `,
        values: [searchId],
      };
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching vacancies:", error);
      throw new Error("Error while fetching vacancies");
    }
  }

  /**
   * Получить новые вакансии по поиску
   */
  async getNewVacanciesBySearchId(searchId: number): Promise<Vacancy[]> {
    try {
      const query = {
        text: `
          SELECT id, search_id, hh_id, title, company, salary,
                 currency, url, area, schedule, employment, experience,
                 description, is_new, created_at
          FROM vacancies
          WHERE search_id = $1 AND is_new = TRUE
          ORDER BY created_at DESC
        `,
        values: [searchId],
      };
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching new vacancies:", error);
      throw new Error("Error while fetching new vacancies");
    }
  }

  /**
   * Создать новую вакансию
   */
  async createVacancy(
    searchId: number,
    hhId: string,
    title: string,
    company: string | null,
    salary: number | null,
    currency: string,
    url: string,
    area: number | null,
    schedule: string | null,
    employment: string | null,
    experience: string | null,
    description: string | null,
  ): Promise<Vacancy | null> {
    try {
      const query = {
        text: `
          INSERT INTO vacancies (
            search_id, hh_id, title, company, salary, currency,
            url, area, schedule, employment, experience, description
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (search_id, hh_id) DO NOTHING
          RETURNING *
        `,
        values: [
          searchId,
          hhId,
          title,
          company,
          salary,
          currency,
          url,
          area,
          schedule,
          employment,
          experience,
          description,
        ],
      };
      const result = await pool.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error creating vacancy:", error);
      throw new Error("Error while creating vacancy");
    }
  }

  /**
   * Пометить вакансию как просмотренную
   */
  async markAsRead(vacancyId: number): Promise<boolean> {
    try {
      const query = {
        text: `
          UPDATE vacancies
          SET is_new = FALSE
          WHERE id = $1
          RETURNING id
        `,
        values: [vacancyId],
      };
      const result = await pool.query(query);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error("Error marking vacancy as read:", error);
      throw new Error("Error while marking vacancy as read");
    }
  }

  /**
   * Пометить все вакансии поиска как просмотренные
   */
  async markAllAsRead(searchId: number): Promise<number> {
    try {
      const query = {
        text: `
          UPDATE vacancies
          SET is_new = FALSE
          WHERE search_id = $1 AND is_new = TRUE
          RETURNING id
        `,
        values: [searchId],
      };
      const result = await pool.query(query);
      return result.rowCount || 0;
    } catch (error) {
      console.error("Error marking all vacancies as read:", error);
      throw new Error("Error while marking all vacancies as read");
    }
  }

  /**
   * Удалить вакансию
   */
  async deleteVacancy(vacancyId: number): Promise<boolean> {
    try {
      const query = {
        text: `
          DELETE FROM vacancies
          WHERE id = $1
          RETURNING id
        `,
        values: [vacancyId],
      };
      const result = await pool.query(query);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error("Error deleting vacancy:", error);
      throw new Error("Error while deleting vacancy");
    }
  }
}
