"use client";

import useSWR, { mutate as globalMutate } from "swr";
import { apiClient } from "@/lib/api-client";
import { IVacancy } from "@/types/Vacancy";

// Ключи для кэша
export const vacancyKeys = {
  all: "vacancies" as const,
  bySearch: (searchId: number) => [vacancyKeys.all, "search", searchId] as const,
  detail: (vacancyId: number) => [vacancyKeys.all, "detail", vacancyId] as const,
};

// Fetcher для SWR
const fetcher = <T>(url: string): Promise<T> => apiClient.get<T>(url);

// === Query Hooks ===

/**
 * Получить все вакансии по поиску
 */
export const useVacancies = (searchId: number) => {
  const { data, isLoading, error, mutate } = useSWR<IVacancy[]>(
    searchId ? `/api/vacancies/${searchId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    },
  );

  return {
    vacancies: data ?? [],
    isLoading,
    error,
    mutate,
  };
};

/**
 * Получить новые вакансии по поиску
 */
export const useNewVacancies = (searchId: number) => {
  const { data, isLoading, error, mutate } = useSWR<IVacancy[]>(
    searchId ? `/api/vacancies/${searchId}/new` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    },
  );

  return {
    vacancies: data ?? [],
    isLoading,
    error,
    mutate,
  };
};

/**
 * Получить вакансию по ID
 */
export const useVacancy = (vacancyId: number) => {
  const { data, isLoading, error, mutate } = useSWR<IVacancy>(
    vacancyId ? `/api/vacancies/${vacancyId}` : null,
    fetcher,
  );

  return {
    vacancy: data ?? null,
    isLoading,
    error,
    mutate,
  };
};

// === Mutation Hooks ===

/**
 * Мутация для пометки вакансии как просмотренной
 */
export const useMarkVacancyAsRead = () => {
  const markVacancyAsRead = async (vacancyId: number) => {
    try {
      await apiClient.patch(`/api/vacancies/${vacancyId}/mark-read`);
      await globalMutate(vacancyKeys.all);
      return true;
    } catch (error) {
      console.error("Mark vacancy as read error:", error);
      return false;
    }
  };

  return { markVacancyAsRead };
};

/**
 * Мутация для пометки всех вакансий поиска как просмотренные
 */
export const useMarkAllVacanciesAsRead = () => {
  const markAllVacanciesAsRead = async (searchId: number) => {
    try {
      await apiClient.patch(`/api/vacancies/${searchId}/mark-all-read`);
      await globalMutate(vacancyKeys.all);
      return true;
    } catch (error) {
      console.error("Mark all vacancies as read error:", error);
      return false;
    }
  };

  return { markAllVacanciesAsRead };
};
