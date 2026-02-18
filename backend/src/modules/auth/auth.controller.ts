import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { validate } from "@/middleware/validation.middleware";
import { createUserDto, loginUserDto } from "../users/user.dto";
import { UserService } from "../users/user.service";
import { env } from "@/config/env";
import { logger } from "@/utils/log";

const router = Router();

const userService = new UserService();

router.post(
  "/signup",
  validate(createUserDto),
  async (req: Request, res: Response) => {
    try {
      const { email, username, password } = req.body;
      const userExists = await userService.userExists(email);
      if (!userExists) {
        const newUser = await userService.createUser(email, username, password);

        const token = jwt.sign({ userId: newUser.id }, env.JWT_SECRET, {
          expiresIn: "7d",
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
    } catch (error) {
      logger.error("Error during user signup: " + error);
      return res
        .status(500)
        .json({ message: "Непредвиденная ошибка сервера!" });
    }
  }
);

router.post(
  "/login",
  validate(loginUserDto),
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await userService.validateUser(email, password);

      if (!user) {
        return res
          .status(401)
          .json({ message: "Incorrect email or password." });
      }

      const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
        expiresIn: "7d",
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
  }
);

export const authRouter = router;
