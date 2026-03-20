import { Request, Response } from "express";
import { SubscriptionService } from "./subscriptions.service";
import { AuthRequest } from "@/types/authRequest";
import { logger } from "@/utils/log";

export class SubscriptionController {
  private readonly subscriptionService: SubscriptionService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  /**
   * Получить все тарифы
   * GET /api/subscriptions/tiers
   */
  async getTiers(_req: Request, res: Response) {
    try {
      const tiers = await this.subscriptionService.getTiers();
      res.json({ tiers });
    } catch (error) {
      logger.error("Error in getTiers:", error);
      res.status(500).json({ error: "Failed to fetch tiers" });
    }
  }

  /**
   * Получить текущую подписку пользователя
   * GET /api/subscriptions/my
   */
  async getMySubscription(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const subscription = await this.subscriptionService.getUserSubscription(
        userId,
      );

      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      return res.json({ subscription });
    } catch (error) {
      logger.error("Error in getMySubscription:", error);
      return res.status(500).json({ error: "Failed to fetch subscription" });
    }
  }

  /**
   * Проверить возможности тарифа
   * GET /api/subscriptions/permissions
   */
  async getPermissions(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const permissions =
        await this.subscriptionService.checkUserPermissions(userId);

      return res.json({ permissions });
    } catch (error) {
      logger.error("Error in getPermissions:", error);
      return res.status(500).json({ error: "Failed to fetch permissions" });
    }
  }

  /**
   * Активировать подписку
   * POST /api/subscriptions/activate
   */
  async activateSubscription(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { tier_id, payment_id } = req.body;

      if (!tier_id) {
        return res.status(400).json({ error: "Tier ID is required" });
      }

      const subscription =
        await this.subscriptionService.activateSubscription(
          userId,
          tier_id,
          payment_id,
        );

      if (!subscription) {
        return res
          .status(500)
          .json({ error: "Failed to activate subscription" });
      }

      return res.json({
        message: "Subscription activated successfully",
        subscription,
      });
    } catch (error) {
      logger.error("Error in activateSubscription:", error);
      return res.status(500).json({ error: "Failed to activate subscription" });
    }
  }

  /**
   * Отменить подписку
   * POST /api/subscriptions/cancel
   */
  async cancelSubscription(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const success =
        await this.subscriptionService.cancelSubscription(userId);

      if (!success) {
        return res
          .status(500)
          .json({ error: "Failed to cancel subscription" });
      }

      return res.json({ message: "Subscription cancelled successfully" });
    } catch (error) {
      logger.error("Error in cancelSubscription:", error);
      return res.status(500).json({ error: "Failed to cancel subscription" });
    }
  }
}
