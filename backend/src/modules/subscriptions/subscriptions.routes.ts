import { Router } from "express";
import { SubscriptionController } from "./subscriptions.controller";
import { authMiddleware } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validation.middleware";
import { activateSubscriptionDto } from "./subscriptions.dto";

const router = Router();
const controller = new SubscriptionController();

// Публичные роуты
router.get("/tiers", (req, res) => controller.getTiers(req, res));

// Защищённые роуты
router.use(authMiddleware);

router.get("/my", (req, res) => controller.getMySubscription(req, res));
router.get("/permissions", (req, res) => controller.getPermissions(req, res));
router.post(
  "/activate",
  validate(activateSubscriptionDto),
  (req, res) => controller.activateSubscription(req, res),
);
router.post("/cancel", (req, res) => controller.cancelSubscription(req, res));

export { router as subscriptionRoutes };
