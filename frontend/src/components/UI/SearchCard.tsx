import { Card, Tag } from "antd";
import { ReactNode } from "react";
import { ISearch } from "@/types/Search";
import { getAreaNamesByIds } from "@/utils/areaNames";
import { formatDateTime } from "@/utils/formatDateTime";
import { getExperienceNamesByIds, getScheduleNamesByIds } from "@/utils/dictionaries";
import { StartSearchButton } from "@/components/UI/StartSearchButton";
import { StopSearchButton } from "@/components/UI/StopSearchButton";
import { MenuSearch } from "@/components/UI/MenuSearch";

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div
    className="odd:bg-white odd:dark:bg-transparent even:bg-gray-100 even:dark:bg-gray-700 p-2 rounded-lg flex gap-2">
    <div className="font-bold text-gray-900 dark:text-white/60 whitespace-nowrap">
      {label}
    </div>
    <div className="text-gray-700 dark:text-gray-300 min-w-0 flex-1">{children}</div>
  </div>
);

type SearchCardProps = {
  data: ISearch;
  onDelete: (searchId: number) => void;
};

export const SearchCard = ({ data, onDelete }: SearchCardProps) => {
  // const regions = await getAllAreasFlat();
  // const dictionaries = await getAllDictionaries();
  // const { schedule, experience, employment_form } = dictionaries.data;

  // const getValueById = (mass: { id: string; name: string }[], id: string) => {
  //   return mass.find((item: { id: string }) => item.id === id)?.name;
  // };

  return (
    <Card
      key={data.id}
      className="max-w-full w-full dark:!bg-gray-800 dark:!border-gray-700"
      title={
        <div className="flex items-center gap-3">
          <h3 className="text-gray-900 dark:text-white">{data.title}</h3>
          {data.is_active ? (
            <Tag color="green">Запущен</Tag>
          ) : (
            <Tag color="red">Остановлен</Tag>
          )}
        </div>
      }
      extra={
        <MenuSearch
          userId={data.user_id}
          searchId={data.id}
          title={data.title}
          onDelete={onDelete}
        />
      }
    >
      <div>
        <Row label="Найдено вакансий:">{data.count_vacancies || 0}</Row>

        {/*<Row label="Резюме:">*/}
        {/*  <a href={`https://hh.ru/resume/${data.resumeId}`} target="_blank">*/}
        {/*    Открыть*/}
        {/*  </a>*/}
        {/*</Row>*/}

        <Row label="Ключевые слова:">{data.keywords || "Нет"}</Row>

        <Row label="Исключенные слова:">{data.excluded_text || "Нет"}</Row>

        {/*<Row label="Исключенные компании:">*/}
        {/*  <div>*/}
        {/*    {(data.excludedCompanies.length &&*/}
        {/*        data.excludedCompanies.map((company, index) => (*/}
        {/*          <div key={index}>*/}
        {/*            <a href={`https://hh.ru/employer/${company}`}>{company}</a>*/}
        {/*            {index !== data.excludedCompanies.length - 1 && ", "}*/}
        {/*          </div>*/}
        {/*        ))) ||*/}
        {/*      "Не добавлено"}*/}
        {/*  </div>*/}
        {/*</Row>*/}

        <Row label="Желаемая зарплата:">{data.salary ? `${data.salary} ${data.currency}` : "Не добавлена"}</Row>

        <Row label="Скрыть вакансии без зарплаты:">
          {data.only_with_salary ? "Да" : "Нет"}
        </Row>

        <Row label="Регион:">
          {data.area.length ? (
            <div className="flex gap-1 items-center overflow-x-auto scrollbar-hidden">
              {getAreaNamesByIds(data.area.map(String)).map((name) => (
                <Tag key={name} className="shrink-0 !bg-gray-200 dark:!bg-gray-600">{name}</Tag>
              ))}
            </div>
          ) : (
            <div>Не добавлен</div>
          )}
        </Row>

        <Row label="График работы:">
          {data.schedule.length
            ? (
              <div className="flex gap-1 items-center overflow-x-auto scrollbar-hidden">
                {
                  getScheduleNamesByIds(data.schedule).map((name, index) => (
                    <Tag key={`${data.id + name + index}`} className="shrink-0 !bg-gray-200 dark:!bg-gray-600">
                      {name}
                    </Tag>
                  ))
                }
              </div>
            ) : "Не добавлен"}
        </Row>

        <Row label="Опыт работы:">
          {data.experience.length
            ? (
              <div className="flex gap-1 items-center overflow-x-auto scrollbar-hidden">
                {
                  getExperienceNamesByIds(data.experience).map((name, index) => (
                    <Tag key={`${data.id + name + index}`} className="shrink-0 !bg-gray-200 dark:!bg-gray-600">
                      {name}
                    </Tag>
                  ))
                }
              </div>
            ) : "Не добавлен"}
        </Row>

        <Row label="Сопроводительное письмо:">
          <p className="truncate">{data.cover_letter || "Не добавлено"}</p>
        </Row>

        <Row label="Дата создания:">
          <div>{formatDateTime(data.created_at)}</div>
        </Row>
      </div>

      <div className="mt-4 flex justify-end">
        {data.is_active ? (
          <StopSearchButton searchId={data.id} />
        ) : (
          <StartSearchButton searchId={data.id} />
        )}
      </div>
    </Card>
  );
};
