import { pool } from "@/config/db/connection";
import { Search } from "./search.types";

export class SearchService {
  async getUserSearches(userId: number): Promise<Search[]> {
    try {
      const query = {
        text: `
          SELECT id, user_id, title, keywords, excluded_text, salary, 
                 currency, only_with_salary, area, schedule, employment, 
                 experience, cover_letter, count_vacancies, is_active, created_at, updated_at
          FROM searches
          WHERE user_id = $1
          ORDER BY created_at DESC
        `,
        values: [userId],
      };
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching user searches:", error);
      throw new Error("Error while fetching searches");
    }
  }

  async getSearchById(id: number, userId: number): Promise<Search | null> {
    try {
      const query = {
        text: `
          SELECT id, user_id, title, keywords, excluded_text, salary, 
                 currency, only_with_salary, area, schedule, employment, 
                 experience, cover_letter, count_vacancies, is_active, created_at, updated_at
          FROM searches
          WHERE id = $1 AND user_id = $2
        `,
        values: [id, userId],
      };
      const result = await pool.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error fetching search:", error);
      throw new Error("Error while fetching search");
    }
  }

  async createSearch(
    userId: number,
    title: string,
    keywords: string | null,
    excluded_text: string | null,
    salary: number | null,
    currency: string,
    only_with_salary: boolean,
    area: number[],
    schedule: string[],
    employment: string[],
    experience: string[],
    cover_letter: string | null,
  ): Promise<Search> {
    try {
      const query = {
        text: `
          INSERT INTO searches (
            user_id, title, keywords, excluded_text, salary, currency,
            only_with_salary, area, schedule, employment, experience, cover_letter
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING *
        `,
        values: [
          userId,
          title,
          keywords,
          excluded_text,
          salary,
          currency,
          only_with_salary,
          area,
          schedule,
          employment,
          experience,
          cover_letter,
        ],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating search:", error);
      throw new Error("Error while creating search");
    }
  }

  async updateSearch(
    id: number,
    userId: number,
    updates: Partial<Search>,
  ): Promise<Search | null> {
    try {
      const allowedFields = [
        "title",
        "keywords",
        "excluded_text",
        "salary",
        "currency",
        "only_with_salary",
        "area",
        "schedule",
        "employment",
        "experience",
        "cover_letter",
        "count_vacancies",
      ];

      const fields: string[] = [];
      const values: unknown[] = [];
      let paramIndex = 1;

      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
          fields.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      }

      if (fields.length === 0) {
        return this.getSearchById(id, userId);
      }

      values.push(id, userId);
      const query = {
        text: `
          UPDATE searches
          SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
          WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
          RETURNING *
        `,
        values,
      };
      const result = await pool.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error updating search:", error);
      throw new Error("Error while updating search");
    }
  }

  async deleteSearch(id: number, userId: number): Promise<boolean> {
    try {
      const query = {
        text: `
          DELETE FROM searches
          WHERE id = $1 AND user_id = $2
          RETURNING id
        `,
        values: [id, userId],
      };
      const result = await pool.query(query);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error("Error deleting search:", error);
      throw new Error("Error while deleting search");
    }
  }

  async toggleSearchStatus(id: number, userId: number, isActive: boolean): Promise<Search | null> {
    try {
      const query = {
        text: `
          UPDATE searches
          SET is_active = $1, updated_at = CURRENT_TIMESTAMP
          WHERE id = $2 AND user_id = $3
          RETURNING *
        `,
        values: [isActive, id, userId],
      };
      const result = await pool.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error toggling search status:", error);
      throw new Error("Error while toggling search status");
    }
  }

  async getUserSearchCount(userId: number): Promise<number> {
    try {
      const result = await pool.query<{ count: string }>(
        "SELECT COUNT(*) FROM searches WHERE user_id = $1",
        [userId],
      );
      return parseInt(result.rows[0]?.count || "0", 10);
    } catch (error) {
      console.error("Error fetching search count:", error);
      throw new Error("Error while fetching search count");
    }
  }
}
