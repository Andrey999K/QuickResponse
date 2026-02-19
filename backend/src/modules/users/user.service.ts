import bcrypt from "bcrypt";
import { User } from "./user.types";
import { pool } from "@/config/db/connection";

export class UserService {
  async createUser(
    email: string,
    username: string,
    password: string
  ): Promise<User> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const query = {
        text: "INSERT INTO users(email, username, password) VALUES($1, $2, $3) RETURNING *",
        values: [email, username, hashedPassword],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Error while create new users");
    }
  }

  // async getUser(email: string): Promise<User | null> {
  //   try {
  //     const query = {
  //       text: "SELECT * FROM users WHERE email = $1",
  //       values: [email]
  //     }
  //     const result = await pool.query(query);
  //     return result.rows[0];
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error("Error get users");
  //   }
  // }

  async userExists(email: string): Promise<boolean> {
    try {
      const query = {
        text: "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) as exists",
        values: [email],
      };
      const result = await pool.query(query);
      return result.rows[0].exists;
    } catch (error) {
      console.error("Error checking user existence:", error);
      throw new Error("Error checking user");
    }
  }

  getAllUsers(): Promise<{ rows: User[] }> {
    try {
      return pool.query("SELECT * FROM users");
    } catch (error) {
      console.error(error);
      throw new Error("Error while get all users");
    }
  }
}
