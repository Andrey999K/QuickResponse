"use client";

import { Button, message } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useToggleSearchStatus } from "@/hooks/useSearchApi";

type StartSearchButtonProps = {
  searchId: number;
  onSuccess?: () => void;
};

export const StartSearchButton = ({ searchId, onSuccess }: StartSearchButtonProps) => {
  const { toggleSearchStatus } = useToggleSearchStatus();

  const handleStart = async () => {
    const success = await toggleSearchStatus(searchId, true);
    if (success) {
      message.success("Поиск запущен");
      onSuccess?.();
    } else {
      message.error("Ошибка при запуске поиска");
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
