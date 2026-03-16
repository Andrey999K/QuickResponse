"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { SearchForm } from "@/components/UI/SearchForm";
import { currencies } from "@/utils/currencies";
import { employments, experiences, schedules } from "@/utils/dictionaries";
import { areasMock } from "@/utils/areas";
import { PageLoader } from "@/components/common/PageLoader";
import { message } from "antd";
import { useSearch } from "@/hooks/useSearchApi";

export default function EditSearchPage() {
  const params = useParams();
  const router = useRouter();
  const searchId = Number(params.id);

  const { search, isLoading, error } = useSearch(searchId);

  React.useEffect(() => {
    if (error) {
      message.error("Ошибка при загрузке данных поиска");
      console.error("Search load error:", error);
    }
  }, [error]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!search) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Поиск не найден
        </h3>
        <button
          onClick={() => router.push("/dashboard/search")}
          className="text-blue-600 hover:underline"
        >
          Вернуться к списку поисков
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-full w-full">
      <div className="shrink-0">
        <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
          Редактирование поиска
        </h2>
      </div>
      <div className="mt-6 flex flex-col gap-5 w-full max-w-full overflow-y-auto min-h-0 pb-4 scrollbar-hidden">
        <div className="max-w-3xl">
          <SearchForm
            currencies={currencies}
            schedules={schedules}
            employment={employments}
            experiences={experiences}
            areas={areasMock.data.map((area) => ({ label: area.name, value: area.id }))}
            mode="edit"
            initialData={search}
            searchId={searchId}
          />
        </div>
      </div>
    </div>
  );
}
