"use client";

import { Card, Descriptions, Typography } from "antd";
import { UserOutlined, SafetyCertificateOutlined, FileTextOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function RequisitesPage() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Реквизиты</Title>
      <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
        Информация для оплаты и документооборота
      </Text>

      <Card>
        <Descriptions
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <UserOutlined style={{ fontSize: 20 }} />
              <span>Индивидуальный предприниматель</span>
            </div>
          }
          bordered
          column={1}
        >
          <Descriptions.Item label="ФИО">
            ИП Иванов Иван Иванович
          </Descriptions.Item>
          <Descriptions.Item label="ИНН">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SafetyCertificateOutlined />
              <span>999999999999</span>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="ОГРНИП">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FileTextOutlined />
              <span>999999999999999</span>
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
