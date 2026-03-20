import { Response } from "express";
import { AuthRequest } from "@/types/authRequest";
import { aiService } from "./ai.service";
import { UserService } from "@/modules/users/user.service";
import { VacancyService } from "@/modules/vacancies/vacancy.service";
import { AiLimitService } from "@/services/ai-limit.service";
import { SubscriptionService } from "@/modules/subscriptions/subscriptions.service";

/**
 * Запрос на генерацию сопроводительного письма
 */
interface GenerateCoverLetterRequest {
  vacancyId?: number;
  searchId?: number;
  vacancyTitle: string;
  company?: string | null;
  description?: string | null;
  requirements?: string | null;
  customPrompt?: string | null;
}

/**
 * Контроллер для работы с AI
 */
export class AIController {
  private readonly aiLimitService: AiLimitService;

  constructor(
    private readonly userService: UserService,
    private readonly vacancyService: VacancyService,
    subscriptionService: SubscriptionService,
  ) {
    this.aiLimitService = new AiLimitService(subscriptionService);
  }

  /**
   * Сгенерировать сопроводительное письмо
   * POST /api/ai/generate-cover-letter
   */
  async generateCoverLetter(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const body: GenerateCoverLetterRequest = req.body;

      // Валидация обязательных полей
      if (!body.vacancyTitle) {
        res.status(400).json({
          error: {
            code: "INVALID_REQUEST",
            message: "Необходимо указать vacancyTitle",
          },
        });
        return;
      }

      // Проверяем лимит AI (ручная генерация)
      if (body.searchId) {
        const limitCheck = await this.aiLimitService.checkAiLimit(
          userId,
          body.searchId,
          true, // isManual = true для ручной генерации
        );

        if (!limitCheck.allowed) {
          res.status(403).json({
            error: {
              code: "AI_LIMIT_EXCEEDED",
              message: limitCheck.reason,
              remaining: limitCheck.remaining,
              limit: limitCheck.limit,
            },
          });
          return;
        }
      }

      // Получаем данные пользователя для персонализации
      const user = await this.userService.getUserById(userId);

      // Генерируем письмо
      const coverLetter = await aiService.generateCoverLetter({
        vacancyTitle: body.vacancyTitle,
        company: body.company ?? null,
        description: body.description ?? null,
        requirements: body.requirements ?? null,
        userName: user?.username ?? null,
        customPrompt: body.customPrompt ?? null,
      });

      // Если указан vacancyId, сохраняем письмо в БД
      if (body.vacancyId) {
        await this.vacancyService.updateCoverLetter(body.vacancyId, coverLetter);
      }

      // Увеличиваем счётчик AI генераций если указан searchId
      if (body.searchId) {
        await this.aiLimitService.incrementAiCounter(body.searchId);
      }

      res.json({
        data: {
          coverLetter,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";

      res.status(500).json({
        error: {
          code: "AI_GENERATION_ERROR",
          message: errorMessage,
        },
      });
    }
  }
}
