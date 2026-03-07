import { Router } from "express";
import { getMe, loginUser, logoutUser, signupUser } from "@/modules/auth/auth.controller";
import { createUserDto, loginUserDto } from "@/modules/users/user.dto";
import { validate } from "@/middleware/validation.middleware";

const router = Router();

router.post("/login", validate(loginUserDto), loginUser);
router.post("/signup", validate(createUserDto), signupUser);
router.get("/me", getMe);
router.post("/logout", logoutUser);

export const authRoutes = router;