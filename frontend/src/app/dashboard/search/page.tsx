// import { CreateSearchButton } from "@/components/UI/CreateSearchButton";
// import { getSearches } from "@/actions/search-actions";
// import { getCurrentUser } from "@/actions/user-actions";

import { Search } from "@/types/Search";
import { SearchCard } from "@/components/UI/SearchCard";
import { CreateSearchButton } from "@/components/UI/CreateSearchButton";

const MOCK_SEARCHES: Search[] = [
  {
    id: "1",
    title: "Frontend разработчик",
    isActive: true,
    userId: "user_1",
    countVacancies: 42,
    resumeId: "abc123def456",
    text: "React, TypeScript, Next.js",
    excludedText: "1С, PHP",
    excludedCompanies: ["Вервэб", "Anykey"],
    salary: 150000,
    onlyWithSalary: true,
    area: ["1", "2"],
    schedule: ["remote", "flexible"],
    experience: ["between1And3", "between3And6"],
    coverLetter: "Здравствуйте! Меня заинтересовала ваша вакансия, так как я имею опыт работы с React и TypeScript более 3 лет.",
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Fullstack разработчик",
    isActive: false,
    userId: "user_1",
    countVacancies: 18,
    resumeId: "xyz789ghi012",
    text: "Node.js, Express, PostgreSQL",
    excludedText: "",
    excludedCompanies: [],
    salary: null,
    onlyWithSalary: false,
    area: ["1"],
    schedule: [],
    experience: ["between3And6"],
    coverLetter: "",
    createdAt: "2025-02-20T14:00:00Z",
  },
];

export default function SearchPage() {
  return (
    <div className="flex flex-col h-full max-w-full w-full">
      {MOCK_SEARCHES.length > 0 ? (
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
            <div className="max-w-screen-lg">
              {MOCK_SEARCHES.map((search) => (
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