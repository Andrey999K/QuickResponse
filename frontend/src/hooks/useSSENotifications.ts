"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { mutate as globalMutate } from "swr";
import { notificationKeys } from "./useNotificationApi";
import { INotification } from "@/types/Notification";

interface SSEMessage {
  event: string;
  data: unknown;
}

// Получаем URL backend из env
const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost"}:${
  process.env.NEXT_PUBLIC_API_PORT || "4000"
}`;

/**
 * Hook для подключения к SSE уведомлениям
 */
export const useSSENotifications = (isEnabled = true) => {
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (!isEnabled) return;

    // Проверяем, что мы в браузере
    if (typeof window === "undefined" || typeof EventSource === "undefined") {
      return;
    }

    try {
      // Закрываем старое соединение если есть
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Создаём новое SSE подключение напрямую к backend (минуя Next.js proxy)
      const eventSource = new EventSource(`${API_URL}/api/sse/notifications`, {
        withCredentials: true,
      });

      eventSourceRef.current = eventSource;

      // Обработчик подключения
      eventSource.addEventListener("connected", (event) => {
        console.log("[SSE] Connected:", JSON.parse(event.data));
        setIsConnected(true);
      });

      // Обработчик heartbeat
      eventSource.addEventListener("heartbeat", (event) => {
        console.debug("[SSE] Heartbeat:", JSON.parse(event.data));
      });

      // Обработчик уведомлений
      eventSource.addEventListener("notification", (event: MessageEvent) => {
        const notification = JSON.parse(event.data) as INotification;

        console.log("[SSE] Новое уведомление:", notification);

        // Обновляем кэш непрочитанных
        globalMutate(notificationKeys.unread);

        // Обновляем список уведомлений (с теми же параметрами, что использует NotificationDropdown)
        globalMutate(notificationKeys.all(10, 0));
        globalMutate(notificationKeys.all(50, 0));

        // Показываем браузерное уведомление (если разрешено)
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification(notification.title, {
            body: notification.message,
            icon: "/favicon.ico",
          });
        }
      });

      // Обработчик ошибок
      eventSource.onerror = (error) => {
        console.error("[SSE] Ошибка подключения:", error);
        setIsConnected(false);

        // Пытаемся переподключиться через 5 секунд
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("[SSE] Переподключение...");
          connect();
        }, 5000);
      };

      console.log("[SSE] Подключение к уведомлениям...", `${API_URL}/api/sse/notifications`);
    } catch (error) {
      console.error("[SSE] Ошибка создания подключения:", error);
    }
  }, [isEnabled]);

  // Подключение при монтировании
  useEffect(() => {
    connect();

    // Очистка при размонтировании
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  // Запрос разрешения на браузерные уведомления
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return {
    isConnected,
  };
};
