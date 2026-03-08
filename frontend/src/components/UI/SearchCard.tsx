import { Card, Tag } from "antd";
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
      className="max-w-full w-full"
      title={
        <div className="flex items-center gap-3">
          <h3>{data.title}</h3>
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
        <div className="odd:bg-white even:bg-gray-100 p-2 rounded-lg flex gap-2">
          <div className="font-bold">Найдено вакансий:</div>
          <div>{data.countVacancies || 0}</div>
        </div>
        <div className="odd:bg-white even:bg-gray-100 p-2 rounded-lg flex gap-2">
          <div className="font-bold">Резюме:</div>
          <a href={`https://hh.ru/resume/${data.resumeId}`} target="_blank">
            Открыть
          </a>
        </div>
        <div className="odd:bg-white even:bg-gray-100 p-2 rounded-lg flex gap-2">
          <span className="font-bold whitespace-nowrap">Ключевые слова:</span>
          <span>{data.text || "Нет"}</span>
        </div>
        {/*<div className="odd:bg-white even:bg-gray-100 p-2 rounded-lg flex gap-2">*/}
        {/*  <div className="font-bold">Специализации:</div>*/}
        {/*  <div>Программист, разработчик</div>*/}
        {/*</div>*/}
        <div className="odd:bg-white even:bg-gray-100 p-2 rounded-lg flex gap-2">
          <div className="font-bold whitespace-nowrap">Исключенные слова:</div>
          <div>{data.excludedText || "Нет"}</div>
        </div>
        <div className="odd:bg-white even:bg-gray-100 p-2 rounded-lg flex gap-2">
          <div className="font-bold">Исключенные компании:</div>
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
          {/*<div>*/}
          {/*  Туроператор Русь, Вервэб, ГУД ВУД, Мугинов Арслан Ильдарович,*/}
          {/*  Anykey, Яндекс Практикум*/}
          {/*</div>*/}
        </div>
        <div className="odd:bg-white even:bg-gray-100 p-2 rounded-lg flex gap-2">
          <div className="font-bold">Желаемая зарплата:</div>
          <div>{data.salary || "Не добавлена"}</div>
        </div>
        <div className="odd:bg-white even:bg-gray-100 p-2 rounded-lg flex gap-2">
          <div className="font-bold">Скрыть вакансии без зарплаты:</div>
          <div>{data.onlyWithSalary ? "Да" : "Нет"}</div>
        </div>
        <div className="odd:bg-white even:bg-gray-100 p-2 rounded-lg flex gap-2">
          <div className="font-bold">Регион:</div>
          {/*{data.area.length ? (*/}
          {/*  <div className="flex">*/}
          {/*    {data.area.map((item) => (*/}
          {/*      <Tag key={item}>{getValueById(regions.data, String(item))}</Tag>*/}
          {/*    ))}*/}
          {/*  </div>*/}
          {/*) : (*/}
          {/*  <div>Не добавлен</div>*/}
          {/*)}*/}
        </div>
        <div className="odd:bg-white even:bg-gray-100 p-2 rounded-lg flex gap-2">
          <div className="font-bold">График работы:</div>
          <div>
            {/*{data.schedule.length*/}
            {/*  ? data.schedule.map((item, index) => (*/}
            {/*    <Tag key={`${data.id + item + index}`}>*/}
            {/*      {getValueById(schedule, item)}*/}
            {/*    </Tag>*/}
            {/*  ))*/}
            {/*  : "Не добавлен"}*/}
          </div>
        </div>
        <div className="odd:bg-white even:bg-gray-100 p-2 rounded-lg flex gap-2">
          <div className="font-bold">Опыт работы:</div>
          <div>
            {/*{data.experience.length*/}
            {/*  ? data.experience.map((item, index) => (*/}
            {/*    <Tag key={`${data.id + item + index}`}>*/}
            {/*      {getValueById(experience, item)}*/}
            {/*    </Tag>*/}
            {/*  ))*/}
            {/*  : "Не добавлен"}*/}
          </div>
        </div>
        <div className="odd:bg-white even:bg-gray-100 p-2 rounded-lg flex gap-2 max-w-full">
          <div className="font-bold whitespace-nowrap">
            Сопроводительное письмо:
          </div>
          <p className="truncate">{data.coverLetter || "Не добавлено"}</p>
        </div>
        <div className="odd:bg-white even:bg-gray-100 p-2 rounded-lg flex gap-2">
          <div className="font-bold">Дата создания:</div>
          {/*<div>{convertDataTime(data.createdAt)}</div>*/}
        </div>
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
