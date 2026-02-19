import { User } from "@/modules/users/user.types";
import { pool } from "@/config/db/connection";
import bcrypt from "bcrypt";

export class AuthService {
  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const query = {
        text: "SELECT * FROM users WHERE email = $1",
        values: [email],
      };
      const result = await pool.query(query);
      const user = result.rows[0];

      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }
      return user;
    } catch (error) {
      console.error("Validate user error:", error);
      throw new Error("Error validating user");
    }
  }
}