import { Response, NextFunction } from "express";
import { AuthRequest } from "@/types/authRequest";
import { SubscriptionService } from "@/modules/subscriptions/subscriptions.service";
import { SearchService } from "@/modules/search/search.service";
import { logger } from "@/utils/log";

const subscriptionService = new SubscriptionService();
const searchService = new SearchService();

/**
 * Middleware для проверки возможности использования Telegram уведомлений
 */
export const checkTelegramEnabled = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const permissions = await subscriptionService.checkUserPermissions(userId);

    if (!permissions.canUseTelegram) {
      logger.warn(`User ${userId} tried to use Telegram, but it's not allowed for tier ${permissions.tierName}`);
      res.status(403).json({
        error: {
          code: "TELEGRAM_NOT_AVAILABLE",
          message: `Telegram уведомления недоступны на тарифе ${permissions.tierName}`,
        },
      });
      return;
    }

    next();
  } catch (error) {
    logger.error("Error checking Telegram permission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Middleware для проверки возможности использования AI
 */
export const checkAiEnabled = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const permissions = await subscriptionService.checkUserPermissions(userId);

    if (!permissions.canUseAI) {
      logger.warn(`User ${userId} tried to use AI, but it's not allowed for tier ${permissions.tierName}`);
      res.status(403).json({
        error: {
          code: "AI_NOT_AVAILABLE",
          message: `AI генерации недоступны на тарифе ${permissions.tierName}`,
        },
      });
      return;
    }

    next();
  } catch (error) {
    logger.error("Error checking AI permission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Middleware для проверки возможности использования Custom Prompt
 */
export const checkCustomPromptEnabled = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const permissions = await subscriptionService.checkUserPermissions(userId);

    if (!permissions.canUseCustomPrompt) {
      logger.warn(`User ${userId} tried to use Custom Prompt, but it's not allowed for tier ${permissions.tierName}`);
      res.status(403).json({
        error: {
          code: "CUSTOM_PROMPT_NOT_AVAILABLE",
          message: `Кастомный промпт недоступен на тарифе ${permissions.tierName}`,
        },
      });
      return;
    }

    next();
  } catch (error) {
    logger.error("Error checking Custom Prompt permission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Middleware для проверки лимита поисков
 */
export const checkSearchLimit = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const subscription = await subscriptionService.getUserSubscription(userId);

    if (!subscription) {
      res.status(403).json({
        error: {
          code: "NO_SUBSCRIPTION",
          message: "Подписка не найдена",
        },
      });
      return;
    }

    const maxSearches = subscription.tier.max_searches;

    // Получаем количество поисков пользователя через сервис
    const searchCount = await searchService.getUserSearchCount(userId);

    if (searchCount >= maxSearches) {
      logger.warn(`User ${userId} reached search limit (${searchCount}/${maxSearches})`);
      res.status(403).json({
        error: {
          code: "SEARCH_LIMIT_EXCEEDED",
          message: `Достигнут лимит поисков (${searchCount}/${maxSearches}) на тарифе ${subscription.tier.name}`,
        },
      });
      return;
    }

    // Добавляем оставшееся количество в request для использования в контроллере
    req.remainingSearches = maxSearches - searchCount;
    next();
  } catch (error) {
    logger.error("Error checking search limit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
