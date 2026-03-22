"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Result, Button, Spin, Typography, Card } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    // Считываем параметры от Robokassa
    const outSum = searchParams.get("OutSum");
    const invId = searchParams.get("InvId");
    const signatureValue = searchParams.get("SignatureValue");
    const isTest = searchParams.get("IsTest");

    // Проверяем наличие всех параметров
    if (!outSum || !invId || !signatureValue) {
      setPaymentStatus("error");
      setIsProcessing(false);
      return;
    }

    // Параметры получены — платёж успешен
    // В реальном приложении здесь можно отправить запрос на бэкенд
    // для дополнительной проверки статуса платежа
    console.log("[Robokassa] Параметры оплаты получены:", {
      OutSum: outSum,
      InvId: invId,
      SignatureValue: signatureValue,
      IsTest: isTest,
    });

    setPaymentStatus("success");
    setIsProcessing(false);
  }, [searchParams]);

  if (isProcessing) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
      }}>
        <Card style={{ textAlign: "center" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text>Обработка результата оплаты...</Text>
          </div>
        </Card>
      </div>
    );
  }

  if (paymentStatus === "error") {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
      }}>
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
  const outSum = searchParams.get("OutSum");
  const invId = searchParams.get("InvId");
  const isTest = searchParams.get("IsTest");

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f0f2f5",
    }}>
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
