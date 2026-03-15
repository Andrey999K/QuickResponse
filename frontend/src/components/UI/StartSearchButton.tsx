"use client";

import { Button, message } from "antd";
import { apiClient } from "@/lib/api-client";
import { PlayCircleOutlined } from "@ant-design/icons";

type StartSearchButtonProps = {
  searchId: number;
  onSuccess?: () => void;
};

export const StartSearchButton = ({ searchId, onSuccess }: StartSearchButtonProps) => {
  const handleStart = async () => {
    try {
      await apiClient.patch(`/api/search/${searchId}/toggle-status`, { is_active: true });
      message.success("Поиск запущен");
      onSuccess?.();
    } catch (error) {
      message.error("Ошибка при запуске поиска");
      console.error("Start search error:", error);
    }
  };

  return (
    <Button
      type="primary"
      icon={<PlayCircleOutlined />}
      onClick={handleStart}
    >
      Запустить
    </Button>
  );
};
