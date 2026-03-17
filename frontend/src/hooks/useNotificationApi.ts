"use client";

import useSWR, { mutate as globalMutate } from "swr";
import { apiClient } from "@/lib/api-client";
import { INotification } from "@/types/Notification";

// Ключи для кэша
export const notificationKeys = {
  all: "notifications" as const,
  unread: "notifications-unread" as const,
};

// Fetcher для SWR
const fetcher = <T>(url: string): Promise<T> => apiClient.get<T>(url);

// === Query Hooks ===

/**
 * Получить уведомления пользователя
 */
export const useNotifications = (limit = 50, offset = 0) => {
  const { data, isLoading, error, mutate } = useSWR<{
    data: INotification[];
    meta: { limit: number; offset: number };
  }>(
    `/api/notifications?limit=${limit}&offset=${offset}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    },
  );

  return {
    notifications: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  };
};

/**
 * Получить количество непрочитанных уведомлений
 */
export const useUnreadNotifications = () => {
  const { data, isLoading, error, mutate } = useSWR<{ data: { count: number } }>(
    "/api/notifications/unread",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // Обновлять каждые 30 секунд
    },
  );

  return {
    unreadCount: data?.data.count ?? 0,
    isLoading,
    error,
    mutate,
  };
};

// === Mutation Hooks ===

/**
 * Отметить уведомление как прочитанное
 */
export const useMarkNotificationAsRead = () => {
  const markNotificationAsRead = async (notificationId: number) => {
    try {
      await apiClient.post(`/api/notifications/${notificationId}/read`);
      
      // Обновляем кэш непрочитанных
      globalMutate(notificationKeys.unread);
      
      // Обновляем список уведомлений
      globalMutate(notificationKeys.all);
      
      return true;
    } catch (error) {
      console.error("Mark notification as read error:", error);
      return false;
    }
  };

  return { markNotificationAsRead };
};

/**
 * Отметить все уведомления как прочитанные
 */
export const useMarkAllNotificationsAsRead = () => {
  const markAllNotificationsAsRead = async () => {
    try {
      await apiClient.post("/api/notifications/read-all");
      
      // Обновляем кэш непрочитанных
      globalMutate(notificationKeys.unread);
      
      // Обновляем список уведомлений
      globalMutate(notificationKeys.all);
      
      return true;
    } catch (error) {
      console.error("Mark all notifications as read error:", error);
      return false;
    }
  };

  return { markAllNotificationsAsRead };
};

/**
 * Удалить уведомление
 */
export const useDeleteNotification = () => {
  const deleteNotification = async (notificationId: number) => {
    try {
      await apiClient.delete(`/api/notifications/${notificationId}`);
      
      // Обновляем кэш непрочитанных
      globalMutate(notificationKeys.unread);
      
      // Обновляем список уведомлений
      globalMutate(notificationKeys.all);
      
      return true;
    } catch (error) {
      console.error("Delete notification error:", error);
      return false;
    }
  };

  return { deleteNotification };
};
