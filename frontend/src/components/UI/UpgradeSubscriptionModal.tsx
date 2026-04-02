import { Modal, Button, Space, Typography, Tag } from "antd";
import { CrownOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

type UpgradeSubscriptionModalProps = {
  open: boolean;
  onClose: () => void;
  reason: "search_limit" | "ai_not_available" | "telegram_not_available" | "custom_prompt_not_available";
  currentTier?: string;
};

export const UpgradeSubscriptionModal = ({
  open,
  onClose,
  reason,
  currentTier,
}: UpgradeSubscriptionModalProps) => {
  const router = useRouter();

  const getTitle = () => {
    switch (reason) {
      case "search_limit":
        return "Лимит поисков достигнут";
      case "ai_not_available":
        return "AI генерации недоступны";
      case "telegram_not_available":
        return "Telegram уведомления недоступны";
      case "custom_prompt_not_available":
        return "Кастомный промпт недоступен";
      default:
        return "Функция недоступна";
    }
  };

  const getMessage = () => {
    switch (reason) {
      case "search_limit":
        return `Вы достигли лимита поисков на тарифе "${currentTier}". Увеличьте лимит, перейдя на тариф выше.`;
      case "ai_not_available":
        return `AI генерация сопроводительных писем доступна начиная с тарифа "Pro".`;
      case "telegram_not_available":
        return `Telegram уведомления доступны начиная с тарифа "Standard".`;
      case "custom_prompt_not_available":
        return `Кастомный промпт для AI доступен только на тарифе "Premium".`;
      default:
        return "Эта функция недоступна на вашем текущем тарифе.";
    }
  };

  const getRequiredTiers = () => {
    type TierData = { name: string; price: number; searches?: number; feature?: string };

    switch (reason) {
      case "search_limit":
        return [
          { name: "Basic", price: 99, searches: 1, feature: undefined },
          { name: "Standard", price: 199, searches: 2, feature: undefined },
          { name: "Pro", price: 299, searches: 2, feature: undefined },
          { name: "Premium", price: 399, searches: 3, feature: undefined },
        ] as TierData[];
      case "ai_not_available":
        return [
          { name: "Pro", price: 299, searches: undefined, feature: "AI авто + 3 письма/день" },
          { name: "Premium", price: 399, searches: undefined, feature: "AI авто + 10 писем/день + ручные" },
        ] as TierData[];
      case "telegram_not_available":
        return [
          { name: "Standard", price: 199, searches: undefined, feature: "Telegram + In-App уведомления" },
          { name: "Pro", price: 299, searches: undefined, feature: "Telegram + AI" },
          { name: "Premium", price: 399, searches: undefined, feature: "Все функции" },
        ] as TierData[];
      case "custom_prompt_not_available":
        return [
          { name: "Premium", price: 399, searches: undefined, feature: "Кастомный промпт + все функции" },
        ] as TierData[];
      default:
        return [] as TierData[];
    }
  };

  const requiredTiers: ReturnType<typeof getRequiredTiers> = getRequiredTiers();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Закрыть
        </Button>,
        <Button
          key="upgrade"
          type="primary"
          icon={<CrownOutlined />}
          onClick={() => {
            onClose();
            router.push("/dashboard/subscriptions");
          }}
        >
          Перейти к тарифам
        </Button>,
      ]}
      width={500}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <LockOutlined className="text-2xl text-gray-400" />
          <Title level={4} style={{ margin: 0 }}>
            {getTitle()}
          </Title>
        </div>

        <Text type="secondary">{getMessage()}</Text>

        {requiredTiers.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            <Text strong>Доступные тарифы:</Text>
            <Space direction="vertical" className="w-full">
              {requiredTiers.map((tier) => (
                <div
                  key={tier.name}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg dark:border-gray-700 hover:border-blue-400 transition-colors cursor-pointer"
                  onClick={() => {
                    onClose();
                    router.push("/dashboard/subscriptions");
                  }}
                >
                  <div className="flex items-center gap-3">
                    <CrownOutlined className="text-yellow-500" />
                    <div>
                      <Text strong>{tier.name}</Text>
                      {tier.feature && (
                        <div>
                          <Text type="secondary" className="text-xs">
                            {tier.feature}
                          </Text>
                        </div>
                      )}
                      {tier.searches !== undefined && (
                        <div>
                          <Text type="secondary" className="text-xs">
                            {tier.searches} поиск(а)
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>
                  <Tag color="blue" className="text-lg">
                    {tier.price}₽
                  </Tag>
                </div>
              ))}
            </Space>
          </div>
        )}
      </div>
    </Modal>
  );
};
