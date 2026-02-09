import { Request, Response, Router } from "express";
import { createUserDto } from "../users/user.dto";
import { UserService } from "../users/user.service";

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
      return res.status(201).json(newUser);
    }
    return res.status(409).json({ message: "Почта или ник уже заняты другим пользователем." });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Непредвиденная ошибка сервера!" });
  }
});

export const authRouter = router;