"use client";

import useSWR from "swr";

import { User } from "@/types/user";
import { apiClient } from "@/lib/api-client";

const fetcher = () => apiClient.get<User>("/api/auth/me");

export const useCurrentUser = () => {
  const { data: user, isLoading: loading } = useSWR(
    "/api/auth/me",
    fetcher,
    {
      onError: () => {}, // Игнорируем ошибки — пользователь просто не авторизован
      revalidateOnFocus: false, // Не перезапрашивать при фокусе окна
      revalidateOnReconnect: true, // Перезапрашивать при восстановлении соединения
    }
  );

  return { user: user ?? null, loading };
};