import { Card, Tag, Button, Space, Modal, Tooltip } from "antd";
import { IVacancy } from "@/types/Vacancy";
import { useMarkVacancyAsRead } from "@/hooks/useVacancyApi";
import { CheckCircleOutlined, LinkOutlined, RobotOutlined } from "@ant-design/icons";
import { useGenerateCoverLetter } from "@/hooks/useGenerateCoverLetter";
import { useAiLimitStatus } from "@/hooks/useSubscription";
import { useState } from "react";

type VacancyCardProps = {
  vacancy: IVacancy;
  searchId?: number;
  onMarkAsRead: () => void;
};

export const VacancyCard = ({ vacancy, searchId, onMarkAsRead }: VacancyCardProps) => {
  const { markVacancyAsRead } = useMarkVacancyAsRead();
  const { generateCoverLetter, isLoading: isGenerating } = useGenerateCoverLetter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(vacancy.cover_letter);

  // Получаем статус лимитов AI если указан searchId
  const { manual: manualLimit, isLoading: isLoadingLimit } = useAiLimitStatus(searchId ?? null);

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

  const handleGenerateCoverLetter = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const coverLetter = await generateCoverLetter({
      vacancyId: vacancy.id,
      searchId: searchId,
      vacancyTitle: vacancy.title,
      company: vacancy.company,
      description: vacancy.description,
    });

    if (coverLetter) {
      setGeneratedLetter(coverLetter);
      setIsModalOpen(true);
    }
  };

  const handleViewCoverLetter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGeneratedLetter(vacancy.cover_letter);
    setIsModalOpen(true);
  };

  return (
    <>
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
            <Space>
              <Button
                type="text"
                icon={<LinkOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick();
                }}
              />
              {vacancy.cover_letter ? (
                <Button
                  size="small"
                  type="default"
                  onClick={handleViewCoverLetter}
                >
                  Письмо
                </Button>
              ) : (
                <Tooltip
                  title={
                    !manualLimit?.allowed && manualLimit?.reason
                      ? manualLimit.reason
                      : undefined
                  }
                  open={
                    !isLoadingLimit && manualLimit && !manualLimit.allowed
                      ? undefined
                      : false
                  }
                >
                  <Button
                    size="small"
                    type={manualLimit?.allowed ? "primary" : "default"}
                    icon={<RobotOutlined />}
                    onClick={handleGenerateCoverLetter}
                    loading={isGenerating || isLoadingLimit}
                    disabled={!manualLimit?.allowed && !isLoadingLimit}
                  >
                    AI {manualLimit && !isLoadingLimit ? `(${manualLimit.remaining})` : ""}
                  </Button>
                </Tooltip>
              )}
            </Space>
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

      <Modal
        title="Сопроводительное письмо"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)}>
            Закрыть
          </Button>,
        ]}
        width={600}
      >
        {generatedLetter ? (
          <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
            {generatedLetter}
          </div>
        ) : (
          <div className="text-gray-500">Письмо ещё не сгенерировано</div>
        )}
      </Modal>
    </>
  );
};
