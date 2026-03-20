"use client";

import { useParams, useRouter } from "next/navigation";
import { useVacancies, useMarkAllVacanciesAsRead } from "@/hooks/useVacancyApi";
import { VacancyCard } from "@/components/UI/VacancyCard";
import { PageLoader } from "@/components/common/PageLoader";
import { Button, Empty, Space, Tag } from "antd";
import { ArrowLeftOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { formatDateTime } from "@/utils/formatDateTime";

export default function VacanciesPage() {
  const params = useParams();
  const router = useRouter();
  const searchId = Number(params.searchId);

  const { vacancies, isLoading, error, mutate } = useVacancies(searchId);
  const { markAllVacanciesAsRead } = useMarkAllVacanciesAsRead();

  const handleMarkAllAsRead = async () => {
    await markAllVacanciesAsRead(searchId);
    mutate();
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Empty description="Ошибка загрузки вакансий" />
        <Button type="primary" onClick={() => router.back()} className="mt-4">
          Назад
        </Button>
      </div>
    );
  }

  // Считаем новые вакансии
  const newCount = vacancies.filter((v) => v.is_new).length;

  // Получаем последнюю дату сканирования из самой свежей вакансии
  const lastCheckedAt = vacancies.length > 0 
    ? vacancies[0].created_at 
    : null;

  return (
    <div className="flex flex-col h-full max-w-full w-full">
      {/* Заголовок — фиксированный */}
      <div className="flex shrink-0 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
          />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Вакансии
          </h2>
          {newCount > 0 && (
            <Tag color="green" className="text-sm">
              Новых: {newCount}
            </Tag>
          )}
        </div>
        <Space>
          {lastCheckedAt && (
            <span className="text-sm text-gray-500">
              Последнее сканирование: {formatDateTime(lastCheckedAt)}
            </span>
          )}
          {vacancies.length > 0 && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleMarkAllAsRead}
            >
              Пометить все как прочитанные
            </Button>
          )}
        </Space>
      </div>

      {/* Список вакансий */}
      <div className="mt-6 flex flex-col gap-4 w-full max-w-full overflow-y-auto min-h-0 pb-4">
        {vacancies.length > 0 ? (
          <div className="max-w-screen-lg flex flex-col gap-4">
            {vacancies.map((vacancy) => (
              <VacancyCard
                key={vacancy.id}
                vacancy={vacancy}
                searchId={searchId}
                onMarkAsRead={() => mutate()}
              />
            ))}
          </div>
        ) : (
          <Empty
            description="Пока нет вакансий"
            className="mt-20"
          />
        )}
      </div>
    </div>
  );
}
