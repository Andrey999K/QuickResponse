"use client";

import { Table, Tag, Typography, Empty, Card } from "antd";
import { usePaymentHistory } from "@/hooks/useSubscription";
import { formatDateTime } from "@/utils/formatDateTime";

const { Title, Text } = Typography;

const statusColors: Record<string, string> = {
  pending: "warning",
  success: "success",
  failed: "error",
  refunded: "default",
};

const statusLabels: Record<string, string> = {
  pending: "Ожидается",
  success: "Успешно",
  failed: "Отклонён",
  refunded: "Возврат",
};

export default function BillingPage() {
  const { payments, isLoading } = usePaymentHistory();

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Сумма",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      render: (amount: number) => `${amount}₽`,
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: "Дата",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => formatDateTime(date),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ padding: 24 }}>
        <Title level={2}>История платежей</Title>
        <Text>Загрузка...</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>История платежей</Title>
      <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
        Все ваши транзакции
      </Text>

      <Card>
        {payments.length > 0 ? (
          <Table
            columns={columns}
            dataSource={payments}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <Empty description="История платежей пуста" />
        )}
      </Card>
    </div>
  );
}
