import { Router } from "express";
import { createUser, deleteUser, getAllUsers, updateUser } from "@/modules/users/user.controller";

const router = Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.patch("/", updateUser);
router.delete("/", deleteUser);

export const userRoutes = router;