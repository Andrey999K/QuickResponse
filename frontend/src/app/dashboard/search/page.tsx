// import { CreateSearchButton } from "@/components/UI/CreateSearchButton";
// import { getSearches } from "@/actions/search-actions";
// import { SearchType } from "@/types/Search";
// import { SearchCard } from "@/components/UI/SearchCard";
// import { getCurrentUser } from "@/actions/user-actions";

import { SearchCard } from "@/components/UI/SearchCard";

export default async function SearchPage() {
  // const currentUser = await getCurrentUser();
  // const searches: SearchType[] = await getSearches(
  //   Number(currentUser?.userInfo?.id)
  // );

  // const response = await fetch("http://localhost:3000/api/searches");
  // console.log("response", response);

  const searches = [
    {
      id: 1,
      name: "Поиск 1",
    },
    {
      id: 2,
      name: "Поиск 2",
    },
    {
      id: 3,
      name: "Поиск 3",
    },
  ];

  return (
    <div className="flex flex-col h-full max-w-screen-lg">
      {searches.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold w-full">Мои поиски</h2>
            {/*<CreateSearchButton />*/}
          </div>
          <div className="mt-6 flex flex-col gap-5 w-full max-w-screen-lg overflow-y-auto">
            {searches.map((search) => (
              <SearchCard key={search.id} data={search} />
              // <div key={search.id}>{search.name}</div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4 h-full items-center justify-center mb-20">
          <h3 className="text-xl font-bold">У вас ещё нет ни одного поиска</h3>
          {/*<CreateSearchButton />*/}
        </div>
      )}
    </div>
  );
}
