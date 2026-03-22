import { Card, Descriptions, Typography } from "antd";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import { Wrapper } from "@/components/common/Wrapper";
import Head from "next/head";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const { Title, Text } = Typography;

export default function RequisitesPage() {
  const fio = process.env.NEXT_PUBLIC_FIO || "Иванов Иван Иванович";
  const inn = process.env.NEXT_PUBLIC_INN || "999999999999";

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="flex-1 py-12">
        <Wrapper className="!max-w-3xl">
          <Title level={2} className="text-gray-900 dark:text-white mb-2">
            Реквизиты
          </Title>
          <Text
            type="secondary"
            className="text-gray-500 dark:text-gray-400 block mb-8"
          >
            Информация для оплаты и документооборота
          </Text>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <Descriptions
              bordered
              column={1}
            >
              <Descriptions.Item label="ФИО">
                <div className="flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300">
                  {fio}
                </span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="ИНН">
                <div className="flex items-center gap-2">
                  <SafetyCertificateOutlined className="text-primary-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                  {inn}
                </span>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Wrapper>
      </main>
    </>
  );
}
