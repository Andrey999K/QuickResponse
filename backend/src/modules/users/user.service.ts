import { pool } from "../../db/connection";
import bcrypt from "bcrypt";

export class UserService {

  async createUser(email: string, username: string, password: string): Promise<any> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const query = {
        text: 'INSERT INTO users(email, username, password) VALUES($1, $2, $3) RETURNING *',
        values: [email, username, hashedPassword],
      }
      const result = await pool.query(query);
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