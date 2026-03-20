import { Router } from "express";
import { AIController } from "./ai.controller";
import { UserService } from "@/modules/users/user.service";
import { VacancyService } from "@/modules/vacancies/vacancy.service";
import { SubscriptionService } from "@/modules/subscriptions/subscriptions.service";
import { authMiddleware } from "@/middleware/auth.middleware";

const router = Router();
const userService = new UserService();
const vacancyService = new VacancyService();
const subscriptionService = new SubscriptionService();
const controller = new AIController(userService, vacancyService, subscriptionService);

// Все роуты требуют аутентификации
router.use(authMiddleware);

// POST /api/ai/generate-cover-letter - Сгенерировать сопроводительное письмо
router.post("/generate-cover-letter", (req, res) => controller.generateCoverLetter(req, res));

export { router as aiRoutes };
