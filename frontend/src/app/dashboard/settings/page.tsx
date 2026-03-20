"use client";

import { useEffect, useState } from "react";
import { Card, Button, Switch, Modal, QRCode, message, Input } from "antd";
import { Bell, BellOff } from "@deemlol/next-icons";

import { useCurrentUser } from "@/hooks/useCurrentUser";

const { TextArea } = Input;

// Telegram SVG Icon
function TelegramIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42l10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.002.001l-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15l4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"/>
    </svg>
  );
}

// AI SVG Icon
function AIIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A2.5 2.5 0 0 0 5 15.5 2.5 2.5 0 0 0 7.5 18 2.5 2.5 0 0 0 10 15.5 2.5 2.5 0 0 0 7.5 13m9 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5"/>
    </svg>
  );
}

interface TelegramStatus {
  is_connected: boolean;
  notifications_enabled: boolean;
  bot_username: string;
  connect_link: string;
}

export default function SettingsPage() {
  const { user } = useCurrentUser();
  const [telegramStatus, setTelegramStatus] = useState<TelegramStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrVisible, setQrVisible] = useState(false);
  
  // AI Settings state
  const [customPrompt, setCustomPrompt] = useState("");
  const [isSavingPrompt, setIsSavingPrompt] = useState(false);

  useEffect(() => {
    fetchTelegramStatus();
  }, []);

  const fetchTelegramStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/api/telegram/status`, {
        credentials: "include",
      });
      const data = await response.json();
      setTelegramStatus(data.data);
    } catch (error) {
      console.error("Error fetching telegram status:", error);
      message.error("Ошибка загрузки статуса Telegram");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    Modal.confirm({
      title: "Отключить Telegram",
      content: "Вы перестанете получать уведомления в Telegram. Продолжить?",
      okText: "Отключить",
      cancelText: "Отмена",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/api/telegram/disconnect`,
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (response.ok) {
            message.success("Telegram отключён");
            fetchTelegramStatus();
          } else {
            message.error("Ошибка при отключении");
          }
        } catch (error) {
          console.error("Error disconnecting telegram:", error);
          message.error("Ошибка при отключении Telegram");
        }
      },
    });
  };

  const handleToggleNotifications = async (checked: boolean) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/api/telegram/toggle-notifications`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled: checked }),
        }
      );

      if (response.ok) {
        message.success(checked ? "Уведомления включены" : "Уведомления выключены");
        fetchTelegramStatus();
      } else {
        message.error("Ошибка при изменении настроек");
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
      message.error("Ошибка при изменении настроек");
    }
  };

  const handleSaveCustomPrompt = async () => {
    setIsSavingPrompt(true);
    try {
      // TODO: Реализовать endpoint для сохранения кастомного промпта
      // const response = await fetch(..., {
      //   method: "PATCH",
      //   credentials: "include",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ customPrompt }),
      // });
      
      // Заглушка для демонстрации
      await new Promise(resolve => setTimeout(resolve, 500));
      
      message.success("Настройки AI сохранены!");
    } catch (error) {
      console.error("Error saving custom prompt:", error);
      message.error("Ошибка при сохранении настроек AI");
    } finally {
      setIsSavingPrompt(false);
    }
  };

  const openQRModal = () => {
    setQrVisible(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Настройки
      </h1>

      {/* Telegram уведомления */}
      <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <TelegramIcon size={24} className="text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Telegram уведомления
          </h2>
        </div>

        {telegramStatus?.is_connected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {telegramStatus.notifications_enabled ? (
                  <Bell size={20} className="text-green-500" />
                ) : (
                  <BellOff size={20} className="text-gray-400" />
                )}
                <span className="text-gray-700 dark:text-gray-300">
                  {telegramStatus.notifications_enabled
                    ? "Уведомления включены"
                    : "Уведомления выключены"}
                </span>
              </div>
              <Switch
                checked={telegramStatus.notifications_enabled}
                onChange={handleToggleNotifications}
                checkedChildren="Вкл"
                unCheckedChildren="Выкл"
              />
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button danger onClick={handleDisconnect}>
                Отключить Telegram
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Подключите Telegram, чтобы получать уведомления о новых вакансиях.
            </p>
            <div className="flex gap-2">
              <Button
                type="primary"
                icon={<TelegramIcon size={16} />}
                onClick={openQRModal}
              >
                Подключить
              </Button>
              <Button
                href={`https://t.me/${telegramStatus?.bot_username}?start=${user?.id}`}
                target="_blank"
              >
                Открыть бота
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* AI настройки */}
      <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <AIIcon size={24} className="text-purple-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Настройки AI (сопроводительные письма)
          </h2>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Настройте стиль и тон сопроводительных писем, которые будет генерировать AI.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Кастомный промпт
            </label>
            <TextArea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Например: Пиши в формальном стиле, делай акцент на опыте работы с React и TypeScript, упоминай готовность к переезду..."
              rows={4}
              className="dark:bg-gray-700 dark:border-gray-600"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Этот текст будет добавлен к стандартному промпту для генерации писем.
            </p>
          </div>

          <div className="pt-2">
            <Button
              type="primary"
              onClick={handleSaveCustomPrompt}
              loading={isSavingPrompt}
            >
              Сохранить настройки
            </Button>
          </div>
        </div>
      </Card>

      {/* QR Modal */}
      <Modal
        title="Подключить Telegram"
        open={qrVisible}
        onCancel={() => setQrVisible(false)}
        footer={null}
        width={320}
      >
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-gray-600 dark:text-gray-400">
            Отсканируйте QR-код или нажмите на кнопку ниже
          </p>

          {telegramStatus && (
            <QRCode
              value={`https://t.me/${telegramStatus.bot_username}?start=${user?.id}`}
              size={200}
            />
          )}

          <Button
            type="primary"
            href={`https://t.me/${telegramStatus?.bot_username}?start=${user?.id}`}
            target="_blank"
            icon={<TelegramIcon size={16} />}
          >
            Открыть бота
          </Button>

          <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
            После перехода в бота нажмите <b>Start</b> для подключения
          </p>
        </div>
      </Modal>
    </div>
  );
}
