import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import {
  createPayment,
  paymentResult,
  getPaymentStatus,
  getPaymentHistory,
} from "./payments.controller";

const router = Router();

/**
 * @openapi
 * /api/payments/create:
 *   post:
 *     tags: [Payments]
 *     summary: Create payment
 *     security:
 *       - bearerAuth: []
 */
router.post("/create", authMiddleware, createPayment);

/**
 * @openapi
 * /api/payments/result:
 *   post:
 *     tags: [Payments]
 *     summary: Robokassa webhook (Result URL)
 */
router.post("/result", paymentResult);

/**
 * @openapi
 * /api/payments/status/:id:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment status
 *     security:
 *       - bearerAuth: []
 */
router.get("/status/:id", authMiddleware, getPaymentStatus);

/**
 * @openapi
 * /api/payments/history:
 *   get:
 *     tags: [Payments]
 *     summary: Get user payment history
 *     security:
 *       - bearerAuth: []
 */
router.get("/history", authMiddleware, getPaymentHistory);

export { router as paymentsRoutes };
