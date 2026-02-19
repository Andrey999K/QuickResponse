import { Router } from "express";
import { loginUser, signupUser } from "@/modules/auth/auth.controller";
import { createUserDto } from "@/modules/users/user.dto";
import { validate } from "@/middleware/validation.middleware";

const router = Router();

router.post("/login", validate(createUserDto), loginUser);
router.post("/signup", validate(createUserDto), signupUser);

export const authRoutes = router;