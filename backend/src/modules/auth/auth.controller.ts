import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import { logger } from "@/utils/log";
import { AuthService } from "@/modules/auth/auth.service";
import { UserService } from "@/modules/users/user.service";

const authService = new AuthService();
const userService = new UserService();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней в мс
};

export const signupUser = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  const userExists = await userService.userExists(email, username);

  if (!userExists) {
    const newUser = await userService.createUser(email, username, password);

    const token = jwt.sign({ userId: newUser.id }, env.JWT_SECRET, {
      expiresIn: env.NODE_ENV === "development" ? "7d" : "1h",
    });

    res.cookie("authToken", token, COOKIE_OPTIONS);

    return res.status(201).json({
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

export const loginUser = async (req: Request, res: Response) => {
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

    res.cookie("authToken", token, COOKIE_OPTIONS);

    return res.json({
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

export const getMe = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: number };
    const user = await userService.getUser(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    logger.error("Error during getMe: " + error);
    return res.status(401).json({ message: "Invalid token" });
  }
};