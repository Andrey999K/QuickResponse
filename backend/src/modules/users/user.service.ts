import { pool } from "../../db/connection";

export class UserService {

  async createUser(email: string, username: string, password: string): Promise<any> {
    try {
      const query = {
        text: 'INSERT INTO users(email, username, password) VALUES($1, $2, $3) RETURNING *',
        values: [email, username, password],
      }
      const result = await pool.query(query);
      console.log("result", result)
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Error while create new users");
    }
  }

  getAllUsers(): Promise<any> {
    try {
      return pool.query('SELECT * FROM users');
    } catch (error) {
      console.error(error);
      throw new Error("Error while get all users");
    }
  }
}