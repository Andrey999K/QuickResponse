import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUserProfile, updateUser } from "@/modules/users/user.controller";

const router = Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.patch("/", updateUser);
router.delete("/", deleteUser);
router.get("/profile", getUserProfile);

export const userRoutes = router;