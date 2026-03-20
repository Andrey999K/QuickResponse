import { pool } from "@/config/db/connection";
import { logger } from "@/utils/log";
import { Subscription, SubscriptionTier, UserWithSubscription } from "./subscriptions.types";

/**
 * Сервис для работы с подписками
 */
export class SubscriptionService {
  /**
   * Получить все тарифы
   */
  async getTiers(): Promise<SubscriptionTier[]> {
    try {
      const result = await pool.query<SubscriptionTier>(
        "SELECT * FROM subscription_tiers ORDER BY price ASC",
      );
      return result.rows;
    } catch (error) {
      logger.error("Error fetching tiers:", error);
      throw new Error("Error while fetching tiers");
    }
  }

  /**
   * Получить тариф по ID
   */
  async getTierById(tierId: number): Promise<SubscriptionTier | null> {
    try {
      const result = await pool.query<SubscriptionTier>(
        "SELECT * FROM subscription_tiers WHERE id = $1",
        [tierId],
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error("Error fetching tier:", error);
      return null;
    }
  }

  /**
   * Получить текущую подписку пользователя
   */
  async getUserSubscription(userId: number): Promise<{
    tier: SubscriptionTier;
    subscription: Subscription | null;
  } | null> {
    try {
      // Получаем пользователя с тарифом
      const userResult = await pool.query<UserWithSubscription>(
        `
        SELECT u.id, u.email, u.username, u.subscription_tier_id, t.*
        FROM users u
        JOIN subscription_tiers t ON u.subscription_tier_id = t.id
        WHERE u.id = $1
      `,
        [userId],
      );

      const user = userResult.rows[0];
      if (!user) return null;

      // Получаем активную подписку
      const subscriptionResult = await pool.query<Subscription>(
        `
        SELECT * FROM subscriptions
        WHERE user_id = $1 AND is_active = TRUE
        ORDER BY created_at DESC
        LIMIT 1
      `,
        [userId],
      );

      const subscription = subscriptionResult.rows[0] || null;

      return {
        tier: {
          id: user.subscription_tier_id,
          name: user.tier?.name || "Free",
          price: user.tier?.price || 0,
          check_interval: user.tier?.check_interval || 10,
          telegram_enabled: user.tier?.telegram_enabled || false,
          ai_enabled: user.tier?.ai_enabled || false,
          custom_prompt_enabled: user.tier?.custom_prompt_enabled || false,
          description: user.tier?.description || null,
          created_at: user.tier?.created_at || "",
          updated_at: user.tier?.updated_at || "",
        },
        subscription,
      };
    } catch (error) {
      logger.error("Error fetching user subscription:", error);
      return null;
    }
  }

  /**
   * Проверить возможности тарифа пользователя
   */
  async checkUserPermissions(
    userId: number,
  ): Promise<{
    canUseTelegram: boolean;
    canUseAI: boolean;
    canUseCustomPrompt: boolean;
    checkInterval: number;
    tierName: string;
  }> {
    const subscription = await this.getUserSubscription(userId);

    if (!subscription) {
      // По умолчанию Free тариф
      return {
        canUseTelegram: false,
        canUseAI: false,
        canUseCustomPrompt: false,
        checkInterval: 10,
        tierName: "Free",
      };
    }

    return {
      canUseTelegram: subscription.tier.telegram_enabled,
      canUseAI: subscription.tier.ai_enabled,
      canUseCustomPrompt: subscription.tier.custom_prompt_enabled,
      checkInterval: subscription.tier.check_interval,
      tierName: subscription.tier.name,
    };
  }

  /**
   * Активировать подписку для пользователя
   */
  async activateSubscription(
    userId: number,
    tierId: number,
    paymentId?: string,
  ): Promise<Subscription | null> {
    try {
      // Обновляем текущую подписку пользователя
      await pool.query(
        `
        UPDATE subscriptions
        SET is_active = FALSE
        WHERE user_id = $1
      `,
        [userId],
      );

      // Создаем новую активную подписку
      const result = await pool.query<Subscription>(
        `
        INSERT INTO subscriptions (user_id, tier_id, payment_id, is_active)
        VALUES ($1, $2, $3, TRUE)
        RETURNING *
      `,
        [userId, tierId, paymentId || null],
      );

      // Обновляем subscription_tier_id в users
      await pool.query(
        `
        UPDATE users
        SET subscription_tier_id = $1
        WHERE id = $2
      `,
        [tierId, userId],
      );

      logger.info(
        `Subscription activated for user ${userId}: tier ${tierId}`,
      );

      return result.rows[0] || null;
    } catch (error) {
      logger.error("Error activating subscription:", error);
      return null;
    }
  }

  /**
   * Отменить подписку пользователя
   */
  async cancelSubscription(userId: number): Promise<boolean> {
    try {
      // Деактивируем все активные подписки
      await pool.query(
        `
        UPDATE subscriptions
        SET is_active = FALSE
        WHERE user_id = $1 AND is_active = TRUE
      `,
        [userId],
      );

      // Возвращаем на Free тариф
      await pool.query(
        `
        UPDATE users
        SET subscription_tier_id = 1
        WHERE id = $1
      `,
        [userId],
      );

      logger.info(`Subscription cancelled for user ${userId}`);
      return true;
    } catch (error) {
      logger.error("Error cancelling subscription:", error);
      return false;
    }
  }
}
