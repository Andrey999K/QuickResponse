"use client";

import useSWR from "swr";

import { ISearch } from "@/types/Search";
import { apiClient } from "@/lib/api-client";

const fetcher = (id: number) => apiClient.get<ISearch>(`/api/search/${id}`);

export const useSearch = (id: number | null) => {
  const { data: search, isLoading, error, mutate } = useSWR(
    id !== null ? [`/api/search/${id}`] : null,
    () => fetcher(id!),
    {
      onError: () => {
      }, // Игнорируем ошибки — пользователь может быть не авторизован
      revalidateOnFocus: false, // Не перезапрашивать при фокусе окна
      revalidateOnReconnect: true, // Перезапрашивать при восстановлении соединения
    },
  );

  return { search, isLoading, error, mutate };
};
