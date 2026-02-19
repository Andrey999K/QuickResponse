import { Request, Response } from "express";
import { UserService } from "./user.service";

const userService = new UserService();

export const getAllUsers = async (_req: Request, res: Response) => {
  console.log("ewewfwfewew");
  const users = await userService.getAllUsers();
  res.json(users.rows);
};

export const createUser = async (_req: Request, res: Response) => {
  res.json({ message: "create users" });
};

export const updateUser = async (_req: Request, res: Response) => {
  res.json({ message: "update users" });
};

export const deleteUser = async (_req: Request, res: Response) => {
  res.json({ message: "delete users" });
};

// router.post("/", async (req: Request, res: Response) => {
//   try {
//     const validation = createUserDto.safeParse(req.body);
//     if (!validation.success) {
//       return res.status(400).json({ message: JSON.parse(validation.error?.message)[0].message });
//     }
//     const { email, username, password } = req.body;
//     const newUser = await userService.createUser(email, username, password);
//     return res.status(201).json(newUser);
//   } catch (error) {
//     console.log("error", error);
//     return res.status(409).json({ message: "Почта или ник уже заняты другим пользователем." });
//   }
// });
//
// router.patch("/", (_req: Request, res: Response) => {
//   res.json({ message: "update users" });
// });
//
// router.delete("/", (_req: Request, res: Response) => {
//   res.json({ message: "delete users" });
// });
//
// export const userRoutes = router;