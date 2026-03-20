"use client";

import { Button, message } from "antd";
import { PauseCircleOutlined } from "@ant-design/icons";
import { useToggleSearchStatus } from "@/hooks/useSearchApi";

type StopSearchButtonProps = {
  searchId: number;
  onSuccess?: () => void;
};

export const StopSearchButton = ({ searchId, onSuccess }: StopSearchButtonProps) => {
  const { toggleSearchStatus } = useToggleSearchStatus();

  const handleStop = async () => {
    const success = await toggleSearchStatus(searchId, false);
    if (success) {
      message.success("Поиск остановлен");
      onSuccess?.();
    } else {
      message.error("Ошибка при остановке поиска");
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
