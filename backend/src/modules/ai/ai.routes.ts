import { Router } from "express";
import { AIController } from "./ai.controller";
import { UserService } from "@/modules/users/user.service";
import { VacancyService } from "@/modules/vacancies/vacancy.service";
import { SubscriptionService } from "@/modules/subscriptions/subscriptions.service";
import { authMiddleware } from "@/middleware/auth.middleware";
import { checkAiEnabled } from "@/middleware/subscription.middleware";

const router = Router();
const userService = new UserService();
const vacancyService = new VacancyService();
const subscriptionService = new SubscriptionService();
const controller = new AIController(userService, vacancyService, subscriptionService);

// Все роуты требуют аутентификации
router.use(authMiddleware);

// GET /api/ai/limit-status/:searchId - Получить статус лимитов AI для поиска
router.get("/limit-status/:searchId", (req, res) => controller.getAiLimitStatus(req, res));

// POST /api/ai/generate-cover-letter - Сгенерировать сопроводительное письмо
router.post("/generate-cover-letter", checkAiEnabled, (req, res) => controller.generateCoverLetter(req, res));

export { router as aiRoutes };
