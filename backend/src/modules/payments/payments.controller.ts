import { Response } from "express";
import { logger } from "@/utils/log";
import { PaymentService } from "./payments.service";
import { SubscriptionService } from "../subscriptions/subscriptions.service";
import { createPaymentDto, robokassaResultDto } from "./payments.dto";
import { AuthRequest } from "@/types/authRequest";
import { RobokassaWebhookData } from "./payments.types";

const paymentService = new PaymentService();
const subscriptionService = new SubscriptionService();

/**
 * POST /api/payments/create
 * Создание платежа
 */
export const createPayment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const validation = createPaymentDto.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues });
    }

    const { tier_id } = validation.data;

    // Получаем информацию о тарифе
    const tier = await subscriptionService.getTierById(tier_id);
    if (!tier) {
      return res.status(404).json({ error: "Tariff not found" });
    }

    // Получаем email пользователя
    const userSubscription = await subscriptionService.getUserSubscription(userId);
    const email = userSubscription?.subscription?.created_at ? "" : "";

    // Создаём платёж
    const payment = await paymentService.createPayment({
      user_id: userId,
      tier_id,
      amount: tier.price,
      email: email || "user@example.com", // TODO: получить реальный email
      description: `Оплата тарифа "${tier.name}"`,
    });

    if (!payment) {
      return res.status(500).json({ error: "Failed to create payment" });
    }

    return res.json({
      redirect_url: payment.redirect_url,
      payment_id: payment.payment_id,
      inv_id: payment.inv_id,
    });
  } catch (error) {
    logger.error("Error creating payment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * POST /api/payments/result
 * Webhook от Robokassa (Result URL)
 */
export const paymentResult = async (req: AuthRequest, res: Response) => {
  try {
    const validation = robokassaResultDto.safeParse(req.body);
    if (!validation.success) {
      logger.error("Invalid webhook data:", validation.error.issues);
      return res.status(400).send("BAD REQUEST");
    }

    const webhookData: RobokassaWebhookData = {
      InvId: validation.data.InvId,
      OutSum: validation.data.OutSum,
      SignatureValue: validation.data.SignatureValue,
      Shp_itemid: validation.data.Shp_itemid,
      Shp_user_id: validation.data.Shp_user_id,
    };

    const result = await paymentService.handleResultWebhook(webhookData);

    if (result.success) {
      // Возвращаем подпись для подтверждения
      return res.send(result.signature);
    } else {
      return res.status(400).send("INVALID SIGNATURE");
    }
  } catch (error) {
    logger.error("Error handling payment result:", error);
    return res.status(500).send("SERVER ERROR");
  }
};

/**
 * GET /api/payments/status/:id
 * Проверка статуса платежа
 */
export const getPaymentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const paymentId = parseInt(req.params.id as string, 10);

    if (isNaN(paymentId)) {
      return res.status(400).json({ error: "Invalid payment ID" });
    }

    const payment = await paymentService.getPaymentStatus(paymentId);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    return res.json({
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      created_at: payment.created_at,
    });
  } catch (error) {
    logger.error("Error fetching payment status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /api/payments/history
 * История платежей пользователя
 */
export const getPaymentHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payments = await paymentService.getUserPayments(userId);

    return res.json({ payments });
  } catch (error) {
    logger.error("Error fetching payment history:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
