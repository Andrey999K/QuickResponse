"use client";

import { SearchCard } from "@/components/UI/SearchCard";
import { CreateSearchButton } from "@/components/UI/CreateSearchButton";
import { useSearches } from "@/hooks/useSearches";
import { PageLoader } from "@/components/common/PageLoader";

export default function SearchPage() {
  const { searches, isLoading } = useSearches();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex flex-col h-full max-w-full w-full">
      {searches.length > 0 ? (
        <>
          {/* Заголовок — фиксированный */}
          <div className="flex items-center justify-between shrink-0">
            <h2 className="text-2xl font-bold w-full text-gray-900 dark:text-white">
              Мои поиски
            </h2>
            <CreateSearchButton />
          </div>
          <div
            className="mt-6 flex flex-col gap-5 w-full max-w-full overflow-y-auto min-h-0 pb-4 scrollbar-hidden w-full">
            <div className="max-w-screen-lg flex flex-col gap-4">
              {searches.map((search) => (
                <SearchCard key={search.id} data={search} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4 h-full items-center justify-center mb-20">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            У вас ещё нет ни одного поиска
          </h3>
          <CreateSearchButton />
        </div>
      )}
    </div>
  );
}