import { pool } from "../../db/connection";

export class UserService {

  createUser() {

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