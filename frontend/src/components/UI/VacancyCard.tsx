import { Card, Tag, Button, Space } from "antd";
import { IVacancy } from "@/types/Vacancy";
import { useMarkVacancyAsRead } from "@/hooks/useVacancyApi";
import { CheckCircleOutlined, LinkOutlined } from "@ant-design/icons";

type VacancyCardProps = {
  vacancy: IVacancy;
  onMarkAsRead: () => void;
};

export const VacancyCard = ({ vacancy, onMarkAsRead }: VacancyCardProps) => {
  const { markVacancyAsRead } = useMarkVacancyAsRead();

  const handleMarkAsRead = async () => {
    await markVacancyAsRead(vacancy.id);
    onMarkAsRead();
  };

  const handleCardClick = () => {
    // Открываем вакансию на hh.ru в новой вкладке
    window.open(vacancy.url, "_blank");
    
    // Если вакансия новая, помечаем как прочитанную
    if (vacancy.is_new) {
      handleMarkAsRead();
    }
  };

  return (
    <Card
      className={`dark:!bg-gray-800 dark:!border-gray-700 cursor-pointer transition-all hover:shadow-md ${
        vacancy.is_new ? "border-green-500 dark:border-green-600 border-l-4" : ""
      }`}
      onClick={handleCardClick}
      title={
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {vacancy.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {vacancy.company && (
                <span className="text-gray-600 dark:text-gray-400">
                  {vacancy.company}
                </span>
              )}
              {vacancy.salary && (
                <Tag color="blue" className="shrink-0">
                  {vacancy.salary} {vacancy.currency}
                </Tag>
              )}
              {vacancy.is_new && (
                <Tag color="green" className="shrink-0">
                  Новая
                </Tag>
              )}
            </div>
          </div>
          <Button
            type="text"
            icon={<LinkOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          />
        </div>
      }
      extra={
        <Space>
          {vacancy.is_new && (
            <Button
              size="small"
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAsRead();
              }}
            >
              Прочитано
            </Button>
          )}
        </Space>
      }
    >
      {vacancy.description && (
        <div className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-3">
          {vacancy.description}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {vacancy.schedule && (
          <Tag className="shrink-0 !bg-gray-200 dark:!bg-gray-600">
            {vacancy.schedule}
          </Tag>
        )}
        {vacancy.employment && (
          <Tag className="shrink-0 !bg-gray-200 dark:!bg-gray-600">
            {vacancy.employment}
          </Tag>
        )}
        {vacancy.experience && (
          <Tag className="shrink-0 !bg-gray-200 dark:!bg-gray-600">
            {vacancy.experience}
          </Tag>
        )}
      </div>
    </Card>
  );
};
