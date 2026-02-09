import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { createUserDto } from "../users/user.dto";
import { UserService } from "../users/user.service";
import { env } from "../../config/env";

const router = Router();

const userService = new UserService();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const validation = createUserDto.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: JSON.parse(validation.error?.message)[0].message });
    }
    const { email, username, password } = req.body;
    const userExists = await userService.userExists(email);
    if (!userExists) {
      const newUser = await userService.createUser(email, username, password);
      const token = jwt.sign(
        { userId: newUser.id },
        env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.status(201).json({
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username
        }
      });
    }
    return res.status(409).json({ message: "Почта или ник уже заняты другим пользователем." });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Непредвиденная ошибка сервера!" });
  }
});

export const authRouter = router;