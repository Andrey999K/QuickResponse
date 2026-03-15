"use client";

import useSWR from "swr";

import { ISearch } from "@/types/Search";
import { apiClient } from "@/lib/api-client";

const fetcher = () => apiClient.get<ISearch[]>("/api/search");

export const useSearches = () => {
  const { data: searches, isLoading, error, mutate } = useSWR(
    "/api/search",
    fetcher,
    {
      onError: () => {
      }, // Игнорируем ошибки — пользователь может быть не авторизован
      revalidateOnFocus: false, // Не перезапрашивать при фокусе окна
      revalidateOnReconnect: true, // Перезапрашивать при восстановлении соединения
    },
  );

  return { searches: searches ?? [], isLoading, error, mutate };
};
