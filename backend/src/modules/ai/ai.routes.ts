import { Router } from "express";
import { AIController } from "./ai.controller";
import { UserService } from "@/modules/users/user.service";
import { authMiddleware } from "@/middleware/auth.middleware";

const router = Router();
const userService = new UserService();
const controller = new AIController(userService);

// Все роуты требуют аутентификации
router.use(authMiddleware);

// POST /api/ai/generate-cover-letter - Сгенерировать сопроводительное письмо
router.post("/generate-cover-letter", (req, res) => controller.generateCoverLetter(req, res));

export { router as aiRoutes };
