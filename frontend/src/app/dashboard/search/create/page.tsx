import React from "react";
// import { getUserResumes } from "@/actions/getUserResume";
// import { getAllDictionaries } from "@/actions/dictionary-actions";
// import { CreateSearchForm } from "@/components/UI/CreateSearchForm";
// import { getAllAreasFlat } from "@/actions/area-actions";
// import { getCurrencies } from "@/actions/getCurrencies";

export default async function CreateSearchPage() {
  // const resumes = await getUserResumes();
  // const dictionaries = await getAllDictionaries();
  // const areas = await getAllAreasFlat();
  // const currencies = await getCurrencies();

  // if (!dictionaries) return;

  // const { schedule, experience, employment_form, work_schedule_by_days } =
  //   dictionaries.data;
  // console.log("dictionaries", dictionaries);
  // console.log("employment", dictionaries.data.employment);
  // console.log("employment_form", dictionaries.data.employment_form);
  // console.log("resume_work_format", dictionaries.data.resume_work_format);
  // console.log("work_format", dictionaries.data.work_format);

  return (
    <div className="w-full max-w-3xl">
      <h2 className="font-bold text-2xl mb-6">Создание поиска</h2>
      {/*<CreateSearchForm*/}
      {/*  resumes={resumes?.data?.items || []}*/}
      {/*  currencies={currencies}*/}
      {/*  schedules={schedule || []}*/}
      {/*  employment={employment_form}*/}
      {/*  experiences={experience}*/}
      {/*  areas={areas.data.map((area) => ({ label: area.name, value: area.id }))}*/}
      {/*/>*/}
    </div>
  );
}
