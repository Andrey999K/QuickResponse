"use client";

import { Button, message } from "antd";
import { apiClient } from "@/lib/api-client";
import { PauseCircleOutlined } from "@ant-design/icons";

type StopSearchButtonProps = {
  searchId: number;
  onSuccess?: () => void;
};

export const StopSearchButton = ({ searchId, onSuccess }: StopSearchButtonProps) => {
  const handleStop = async () => {
    try {
      await apiClient.patch(`/api/search/${searchId}/toggle-status`, { is_active: false });
      message.success("Поиск остановлен");
      onSuccess?.();
    } catch (error) {
      message.error("Ошибка при остановке поиска");
      console.error("Stop search error:", error);
    }
  };

  return (
    <Button
      danger
      icon={<PauseCircleOutlined />}
      onClick={handleStop}
    >
      Остановить
    </Button>
  );
};
