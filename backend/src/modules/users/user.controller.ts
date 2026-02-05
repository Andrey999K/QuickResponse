import { Request, Response, Router } from "express";
import { UserService } from "./user.service";

const router = Router();

const userService = new UserService();

router.get("/", async (_req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json(users.rows);
});

router.post("/", (_req: Request, res: Response) => {
  res.json({ message: "create users" });
});

router.patch("/", (_req: Request, res: Response) => {
  res.json({ message: "update users" });
});

router.delete("/", (_req: Request, res: Response) => {
  res.json({ message: "delete users" });
});

export const userRouter = router;