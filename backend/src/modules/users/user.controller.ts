import { Request, Response, Router } from "express";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ message: "get users" });
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