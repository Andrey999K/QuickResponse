"use client";

import useSWR, { mutate as globalMutate } from "swr";
import { apiClient } from "@/lib/api-client";
import { ISearch } from "@/types/Search";

// Ключи для кэша
export const searchKeys = {
  all: "searches" as const,
  list: () => [searchKeys.all, "list"] as const,
  detail: (id: number) => [searchKeys.all, "detail", id] as const,
};

// Fetcher для SWR
const fetcher = <T>(url: string): Promise<T> => apiClient.get<T>(url);

// === Query Hooks ===

/**
 * Получить все поиски текущего пользователя
 */
export const useSearches = () => {
  const { data, isLoading, error, mutate } = useSWR<ISearch[]>(
    "/api/search",
    fetcher,
    {
      onError: () => {
        // Игнорируем ошибки — пользователь может быть не авторизован
      },
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    },
  );

  return {
    searches: data ?? [],
    isLoading,
    error,
    mutate,
  };
};

/**
 * Получить конкретный поиск по ID
 */
export const useSearch = (id: number) => {
  const { data, isLoading, error, mutate } = useSWR<ISearch>(
    id ? `/api/search/${id}` : null,
    fetcher,
  );

  return {
    search: data ?? null,
    isLoading,
    error,
    mutate,
  };
};

// === Mutation Hooks ===

/**
 * Мутация для запуска/остановки поиска
 */
export const useToggleSearchStatus = () => {
  const toggleSearchStatus = async (searchId: number, isActive: boolean) => {
    try {
      await apiClient.patch(`/api/search/${searchId}/toggle-status`, { is_active: isActive });
      // Инвалидация кэша поисков
      await globalMutate(searchKeys.list());
      return true;
    } catch (error) {
      console.error("Toggle search status error:", error);
      return false;
    }
  };

  return { toggleSearchStatus };
};

/**
 * Мутация для удаления поиска
 */
export const useDeleteSearch = () => {
  const deleteSearch = async (searchId: number) => {
    try {
      await apiClient.delete(`/api/search/${searchId}`);
      // Инвалидация кэша поисков
      await globalMutate(searchKeys.list());
      return true;
    } catch (error) {
      console.error("Delete search error:", error);
      return false;
    }
  };

  return { deleteSearch };
};

/**
 * Мутация для создания поиска
 */
export const useCreateSearch = () => {
  const createSearch = async (data: Partial<ISearch>) => {
    try {
      const response = await apiClient.post<ISearch>("/api/search", data);
      // Инвалидация кэша поисков
      await globalMutate(searchKeys.list());
      return response;
    } catch (error) {
      console.error("Create search error:", error);
      throw error;
    }
  };

  return { createSearch };
};

/**
 * Мутация для обновления поиска
 */
export const useUpdateSearch = () => {
  const updateSearch = async (id: number, data: Partial<ISearch>) => {
    try {
      const response = await apiClient.patch<ISearch>(`/api/search/${id}`, data);
      // Инвалидация кэша конкретного поиска и списка
      await globalMutate(searchKeys.detail(id));
      await globalMutate(searchKeys.list());
      return response;
    } catch (error) {
      console.error("Update search error:", error);
      throw error;
    }
  };

  return { updateSearch };
};
