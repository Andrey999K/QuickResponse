import { Card, Tag } from "antd";
import { ReactNode } from "react";
// import { getAllAreasFlat } from "@/actions/area-actions";
// import { getAllDictionaries } from "@/actions/dictionary-actions";
// import { StartSearchButton } from "@/components/UI/StartSearchButton";
// import { StopSearchButton } from "@/components/UI/StopSearchButton";
// import { MenuSearch } from "@/components/UI/MenuSearch";
// import { convertDataTime } from "@/utils/function/convertDataTime";
// import { SearchType } from "@/types/Search";

// type SearchCardProps = {
//   data: SearchType;
// };

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div
    className="odd:bg-white odd:dark:bg-transparent even:bg-gray-100 even:dark:bg-gray-700 p-2 rounded-lg flex gap-2">
    <div className="font-bold text-gray-900 dark:text-white/60 whitespace-nowrap">
      {label}
    </div>
    <div className="text-gray-700 dark:text-gray-300">{children}</div>
  </div>
);

type SearchCardProps = {
  data: {
    id: string,
    title: string,
    isActive: boolean,
    userId: string,
    countVacancies: number,
    resumeId: number,
    text: number,
    excludedText: number,
    excludedCompanies: [],
    salary: [],
    onlyWithSalary: string,
    area: [],
    schedule: [],
    experience: [],
    coverLetter: string,
    createdAt: string,
  };
};

export const SearchCard = async ({ data }: SearchCardProps) => {
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
          {data.isActive ? (
            <Tag color="green">Запущен</Tag>
          ) : (
            <Tag color="red">Остановлен</Tag>
          )}
        </div>
      }
      // extra={
      //   <MenuSearch
      //     userId={data.userId}
      //     searchId={data.id}
      //     title={data.title}
      //   />
      // }
    >
      <div>
        <Row label="Найдено вакансий:">{data.countVacancies || 0}</Row>

        <Row label="Резюме:">
          <a href={`https://hh.ru/resume/${data.resumeId}`} target="_blank">
            Открыть
          </a>
        </Row>

        <Row label="Ключевые слова:">{data.text || "Нет"}</Row>

        <Row label="Исключенные слова:">{data.excludedText || "Нет"}</Row>

        <Row label="Исключенные компании:">
          {/*<div>*/}
          {/*  {(data.excludedCompanies.length &&*/}
          {/*      data.excludedCompanies.map((company, index) => (*/}
          {/*        <>*/}
          {/*          <a href={`https://hh.ru/employer/${company}`}>{company}</a>*/}
          {/*          {index !== data.excludedCompanies.length - 1 && ","}*/}
          {/*        </>*/}
          {/*      ))) ||*/}
          {/*    "Не добавлено"}*/}
          {/*</div>*/}
        </Row>

        <Row label="Желаемая зарплата:">{data.salary || "Не добавлена"}</Row>

        <Row label="Скрыть вакансии без зарплаты:">
          {data.onlyWithSalary ? "Да" : "Нет"}
        </Row>

        <Row label="Регион:">
          {/*{data.area.length ? (*/}
          {/*  <div className="flex">*/}
          {/*    {data.area.map((item) => (*/}
          {/*      <Tag key={item}>{getValueById(regions.data, String(item))}</Tag>*/}
          {/*    ))}*/}
          {/*  </div>*/}
          {/*) : (*/}
          {/*  <div>Не добавлен</div>*/}
          {/*)}*/}
        </Row>

        <Row label="График работы:">
          {/*{data.schedule.length*/}
          {/*  ? data.schedule.map((item, index) => (*/}
          {/*    <Tag key={`${data.id + item + index}`}>*/}
          {/*      {getValueById(schedule, item)}*/}
          {/*    </Tag>*/}
          {/*  ))*/}
          {/*  : "Не добавлен"}*/}
        </Row>

        <Row label="Опыт работы:">
          {/*{data.experience.length*/}
          {/*  ? data.experience.map((item, index) => (*/}
          {/*    <Tag key={`${data.id + item + index}`}>*/}
          {/*      {getValueById(experience, item)}*/}
          {/*    </Tag>*/}
          {/*  ))*/}
          {/*  : "Не добавлен"}*/}
        </Row>

        <Row label="Сопроводительное письмо:">
          <p className="truncate">{data.coverLetter || "Не добавлено"}</p>
        </Row>

        <Row label="Дата создания:">
          {/*<div>{convertDataTime(data.createdAt)}</div>*/}
        </Row>
      </div>

      <div className="mt-4 flex justify-end">
        {/*{data.isActive ? (*/}
        {/*  <StopSearchButton userId={data.userId} searchId={data.id} />*/}
        {/*) : (*/}
        {/*  <StartSearchButton userId={data.userId} searchId={data.id} />*/}
        {/*)}*/}
      </div>
    </Card>
  );
};
