import { Request, Response, Router } from "express";
import { UserService } from "./user.service";

const router = Router();

const userService = new UserService();

router.get("/", async (_req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json(users.rows);
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;
    const newUser = await userService.createUser(email, username, password);
    res.json(newUser);
  } catch (error) {
    console.log("error", error)
    res.status(409).json({ message: "Почта или ник уже заняты другим пользователем." });
  }
});

router.patch("/", (_req: Request, res: Response) => {
  res.json({ message: "update users" });
});

router.delete("/", (_req: Request, res: Response) => {
  res.json({ message: "delete users" });
});

export const userRouter = router;