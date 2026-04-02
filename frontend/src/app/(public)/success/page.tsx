"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, Result, Spin, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Считываем параметры — useMemo чтобы не было warning
  const outSum = useMemo(() => searchParams.get("OutSum"), [searchParams]);
  const invId = useMemo(() => searchParams.get("InvId"), [searchParams]);
  const signatureValue = useMemo(() => searchParams.get("SignatureValue"), [searchParams]);
  const isTest = useMemo(() => searchParams.get("IsTest"), [searchParams]);

  // Проверяем наличие всех параметров
  const hasError = !outSum || !invId || !signatureValue;

  // Показываем спиннер только если параметры ещё не прочитаны
  // Это происходит при первом рендере, когда searchParams ещё не распаршены
  const isLoading = outSum === null && invId === null && signatureValue === null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center flex-1">
        <Card style={{ textAlign: "center" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text>Обработка результата оплаты...</Text>
          </div>
        </Card>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex justify-center items-center flex-1">
        <Card style={{ maxWidth: 500, width: "100%" }}>
          <Result
            status="error"
            title="Ошибка оплаты"
            subTitle="Не удалось получить параметры оплаты. Пожалуйста, проверьте статус вашего платежа в личном кабинете."
            extra={[
              <Button
                type="primary"
                key="billing"
                onClick={() => router.push("/dashboard/billing")}
              >
                История платежей
              </Button>,
              <Button
                key="subscriptions"
                onClick={() => router.push("/dashboard/subscriptions")}
              >
                К тарифам
              </Button>,
            ]}
          />
        </Card>
      </div>
    );
  }

  // Успешная оплата
  return (
    <div className="flex justify-center items-center flex-1">
      <Card style={{ maxWidth: 500, width: "100%" }}>
        <Result
          icon={<CheckCircleOutlined style={{ color: "#52c41a", fontSize: 72 }} />}
          status="success"
          title={
            <Title level={3} style={{ marginBottom: 8 }}>
              Оплата успешна!
            </Title>
          }
          subTitle={
            <div style={{ textAlign: "left" }}>
              <Text>
                <strong>Сумма:</strong> {outSum}₽
              </Text>
              <br />
              <Text>
                <strong>ID платежа:</strong> {invId}
              </Text>
              <br />
              {isTest === "1" && (
                <Text type="warning">
                  <strong>Тестовый режим</strong>
                </Text>
              )}
            </div>
          }
          extra={[
            <Button
              type="primary"
              key="subscriptions"
              onClick={() => router.push("/dashboard/subscriptions")}
            >
              К тарифам
            </Button>,
            <Button
              key="billing"
              onClick={() => router.push("/dashboard/billing")}
            >
              История платежей
            </Button>,
            <Button
              key="search"
              onClick={() => router.push("/dashboard/search")}
            >
              К поискам
            </Button>,
          ]}
        />
      </Card>
    </div>
  );
}
