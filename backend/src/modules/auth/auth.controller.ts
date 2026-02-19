import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import { logger } from "@/utils/log";
import { AuthService } from "@/modules/auth/auth.service";
import { UserService } from "@/modules/users/user.service";

const authService = new AuthService();
const userService = new UserService();

export const signupUser = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;
    const userExists = await userService.userExists(email);
    if (!userExists) {
      const newUser = await userService.createUser(email, username, password);

      const token = jwt.sign({ userId: newUser.id }, env.JWT_SECRET, {
        expiresIn: env.NODE_ENV === "development" ? "7d" : "1h",
      });

      return res.status(201).json({
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
        },
      });
    }
    return res
      .status(409)
      .json({ message: "Почта или ник уже заняты другим пользователем." });
};

export const loginUser =  async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await authService.validateUser(email, password);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Incorrect email or password." });
    }

    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
      expiresIn: env.NODE_ENV === "development" ? "7d" : "1h",
    });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    logger.error("Error during user login: " + error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};