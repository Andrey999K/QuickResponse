import OpenAI from "openai";
import { logger } from "@/utils/log";
import { env } from "@/config/env";

/**
 * Сервис для генерации сопроводительных писем через OpenRouter API
 */
export class AIService {
  private client: OpenAI | null = null;
  private readonly apiKey: string;

  constructor() {
    this.apiKey = env.OPENROUTER_API_KEY || "";

    if (this.apiKey) {
      this.client = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: this.apiKey,
      });
      logger.info("[AI] OpenRouter клиент инициализирован");
    } else {
      logger.warn("[AI] OPENROUTER_API_KEY не указан, AI не активен");
    }
  }

  /**
   * Сгенерировать сопроводительное письмо на основе описания вакансии
   */
  async generateCoverLetter(params: {
    vacancyTitle: string;
    company?: string | null;
    description?: string | null;
    requirements?: string | null;
    userName?: string | null;
    userExperience?: string | null;
    customPrompt?: string | null;
  }): Promise<string> {
    if (!this.client) {
      throw new Error("AI клиент не инициализирован. Проверьте OPENROUTER_API_KEY");
    }

    // Формируем промпт
    const systemPrompt = "Ты опытный карьерный консультант. Твоя задача — писать краткие, убедительные сопроводительные письма на русском языке. Письмо должно быть персонализированным, показывать интерес к позиции и компании. Избегай шаблонных фраз. Длина: 3-5 предложений.\n\nВАЖНО: Никогда не используй плейсхолдеры в квадратных скобках типа [Название компании], [Имя рекрутера], [Упомянуть проект]. Если какая-то информация неизвестна — просто не упоминай её или напиши обобщённо.";

    const userPrompt = this.buildPrompt(params);

    try {
      const completion = await this.client.chat.completions.create({
        model: "google/gemini-2.5-flash-lite-preview-09-2025", // Бесплатная модель Gemini 2.5 Flash Lite
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const coverLetter = completion.choices[0]?.message?.content?.trim() || "";

      if (!coverLetter) {
        throw new Error("AI вернул пустой ответ");
      }

      logger.info(`[AI] Сгенерировано сопроводительное письмо (${coverLetter.length} символов)`);
      return coverLetter;
    } catch (error) {
      logger.error(`[AI] Ошибка генерации: ${(error as Error).message}`);
      throw new Error(`AI генерация не удалась: ${(error as Error).message}`);
    }
  }

  /**
   * Построить промпт для генерации письма
   */
  private buildPrompt(params: {
    vacancyTitle: string;
    company?: string | null;
    description?: string | null;
    requirements?: string | null;
    userName?: string | null;
    userExperience?: string | null;
    customPrompt?: string | null;
  }): string {
    const {
      vacancyTitle,
      company,
      description,
      requirements,
      userName,
      userExperience,
      customPrompt,
    } = params;

    let prompt = `Напиши сопроводительное письмо на вакансию "${vacancyTitle}"`;

    if (company && company !== "null" && company.trim() !== "") {
      prompt += ` в компанию "${company}"`;
    } else {
      prompt += ` (компания не указана)`;
    }

    prompt += `.\n\n`;

    if (userName) {
      prompt += `Имя кандидата: ${userName}\n`;
    }

    if (userExperience) {
      prompt += `Опыт и навыки: ${userExperience}\n\n`;
    }

    if (description && description !== "null" && description.trim() !== "") {
      prompt += `Описание вакансии:\n${description}\n\n`;
    }

    if (requirements && requirements !== "null" && requirements.trim() !== "") {
      prompt += `Требования:\n${requirements}\n\n`;
    }

    if (customPrompt && customPrompt !== "null" && customPrompt.trim() !== "") {
      prompt += `Дополнительные пожелания: ${customPrompt}\n`;
    }

    prompt += `\nНапиши убедительное сопроводительное письмо на русском языке. Если какие-то данные отсутствуют (компания, описание, требования) — не используй плейсхолдеры, пиши обобщённо.`;

    return prompt;
  }
}

// Экспортируем singleton
export const aiService = new AIService();
