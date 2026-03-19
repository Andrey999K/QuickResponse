"use client";

import { Button, Card, Col, message, Row, Space, Tag, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { activateSubscription, useMySubscription, useTiers } from "@/hooks/useSubscription";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Title, Text } = Typography;

export default function SubscriptionsPage() {
  const router = useRouter();
  const { tiers, isLoading: tiersLoading } = useTiers();
  const { subscription, isLoading: subLoading } = useMySubscription();
  const [activating, setActivating] = useState<number | null>(null);

  const currentTierId = subscription?.tier.id;

  const handleActivate = async (tierId: number) => {
    if (tierId === currentTierId) {
      router.push("/dashboard/search");
      return;
    }

    try {
      setActivating(tierId);
      await activateSubscription(tierId);
      message.success("Тариф активирован! Теперь у вас есть доступ ко всем функциям.");
      router.push("/dashboard/search");
    } catch (error) {
      message.error("Ошибка при активации тарифа");
      console.error("Activate subscription error:", error);
    } finally {
      setActivating(null);
    }
  };

  const renderFeatures = (tier: typeof tiers[0]) => (
    <Space orientation="vertical" size="small" style={{ width: "100%", marginTop: 16 }}>
      <div>
        <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
        <Text>Интервал проверки: {tier.check_interval} мин</Text>
      </div>
      <div>
        <CheckCircleOutlined style={{ color: tier.telegram_enabled ? "#52c41a" : "#d9d9d9", marginRight: 8 }} />
        <Text type={tier.telegram_enabled ? undefined : "secondary"}>Telegram уведомления</Text>
      </div>
      <div>
        <CheckCircleOutlined style={{ color: tier.ai_enabled ? "#52c41a" : "#d9d9d9", marginRight: 8 }} />
        <Text type={tier.ai_enabled ? undefined : "secondary"}>AI сопроводительные письма</Text>
      </div>
      <div>
        <CheckCircleOutlined style={{ color: tier.custom_prompt_enabled ? "#52c41a" : "#d9d9d9", marginRight: 8 }} />
        <Text type={tier.custom_prompt_enabled ? undefined : "secondary"}>Кастомный промпт для AI</Text>
      </div>
    </Space>
  );

  if (tiersLoading || subLoading) {
    return (
      <div style={{ padding: 24 }}>
        <Title level={2}>Тарифы</Title>
        <Text>Загрузка...</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Тарифы</Title>
      <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
        Выберите подходящий тариф для автоматизации откликов
      </Text>

      <Row gutter={[16, 16]}>
        {tiers.map((tier) => {
          const isCurrent = tier.id === currentTierId;
          const isFree = tier.price === 0;

          return (
            <Col xs={24} sm={12} md={8} key={tier.id}>
              <Card
                hoverable
                variant={"borderless"}
                style={{
                  height: "100%",
                  borderColor: isCurrent ? "#1890ff" : undefined,
                  boxShadow: isCurrent ? "0 2px 12px rgba(24, 144, 255, 0.3)" : undefined,
                }}
                title={
                  <Space direction="vertical" size="small" style={{ width: "100%" }}>
                    <Title level={4} style={{ margin: 0 }}>{tier.name}</Title>
                    {isFree ? (
                      <Text type="secondary">Бесплатно</Text>
                    ) : (
                      <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
                        {tier.price}₽/мес
                      </Title>
                    )}
                  </Space>
                }
                extra={
                  isCurrent && (
                    <Tag color="green">Текущий тариф</Tag>
                  )
                }
              >
                {tier.description && (
                  <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
                    {tier.description}
                  </Text>
                )}

                {renderFeatures(tier)}

                <div style={{ marginTop: 24 }}>
                  <Button
                    type={isCurrent ? "default" : "primary"}
                    block
                    size="large"
                    loading={activating === tier.id}
                    onClick={() => handleActivate(tier.id)}
                  >
                    {isCurrent ? "Текущий тариф" : isFree ? "Выбрать" : "Выбрать тариф"}
                  </Button>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
