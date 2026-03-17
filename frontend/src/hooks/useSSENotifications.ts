"use client";

import { useEffect, useRef, useCallback } from "react";
import { mutate as globalMutate } from "swr";
import { notificationKeys } from "./useNotificationApi";
import { INotification } from "@/types/Notification";

interface SSEMessage {
  event: string;
  data: unknown;
}

/**
 * Hook для подключения к SSE уведомлениям
 */
export const useSSENotifications = (isEnabled = true) => {
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!isEnabled) return;

    try {
      // Закрываем старое соединение если есть
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Создаём новое SSE подключение
      const eventSource = new EventSource("/api/sse/notifications", {
        withCredentials: true,
      });

      eventSourceRef.current = eventSource;

      // Обработчик подключения
      eventSource.addEventListener("connected", (event) => {
        console.log("[SSE] Connected:", JSON.parse(event.data));
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

        // Обновляем список уведомлений
        globalMutate(notificationKeys.all);

        // Показываем браузерное уведомление (если разрешено)
        if (Notification.permission === "granted") {
          new Notification(notification.title, {
            body: notification.message,
            icon: "/favicon.ico",
          });
        }
      });

      // Обработчик ошибок
      eventSource.onerror = (error) => {
        console.error("[SSE] Ошибка подключения:", error);
        
        // Пытаемся переподключиться через 5 секунд
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("[SSE] Переподключение...");
          connect();
        }, 5000);
      };

      console.log("[SSE] Подключение к уведомлениям...");
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
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return {
    isConnected: eventSourceRef.current?.readyState === EventSource.OPEN,
  };
};
