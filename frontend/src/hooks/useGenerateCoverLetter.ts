"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { message } from "antd";

/**
 * Параметры для генерации сопроводительного письма
 */
interface GenerateCoverLetterParams {
  vacancyId?: number;
  vacancyTitle: string;
  company?: string | null;
  description?: string | null;
  requirements?: string | null;
  customPrompt?: string | null;
}

/**
 * Ответ от API генерации письма
 */
interface GenerateCoverLetterResponse {
  data: {
    coverLetter: string;
  };
}

/**
 * Хук для генерации сопроводительных писем через AI
 */
export const useGenerateCoverLetter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);

  const generateCoverLetter = async (
    params: GenerateCoverLetterParams
  ): Promise<string | null> => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<GenerateCoverLetterResponse>(
        "/api/ai/generate-cover-letter",
        params
      );

      const coverLetter = response.data.coverLetter;
      setGeneratedLetter(coverLetter);
      message.success("Сопроводительное письмо сгенерировано!");
      return coverLetter;
    } catch (error) {
      console.error("Generate cover letter error:", error);
      message.error("Ошибка при генерации сопроводительного письма");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resetGeneratedLetter = () => {
    setGeneratedLetter(null);
  };

  return {
    generateCoverLetter,
    isLoading,
    generatedLetter,
    resetGeneratedLetter,
  };
};
