// import { CreateSearchButton } from "@/components/UI/CreateSearchButton";
// import { getSearches } from "@/actions/search-actions";
// import { SearchType } from "@/types/Search";
// import { SearchCard } from "@/components/UI/SearchCard";
// import { getCurrentUser } from "@/actions/user-actions";

export default async function SearchPage() {
  // const currentUser = await getCurrentUser();
  // const searches: SearchType[] = await getSearches(
  //   Number(currentUser?.userInfo?.id)
  // );

  // const response = await fetch("http://localhost:3000/api/searches");
  // console.log("response", response);

  return (
    <div className="flex flex-col h-full max-w-screen-lg">
      {/*{searches.length > 0 ? (*/}
      {/*  <>*/}
      {/*    <div className="flex items-center justify-between">*/}
      {/*      <h2 className="text-2xl font-bold w-full">Мои поиски</h2>*/}
      {/*      <CreateSearchButton />*/}
      {/*    </div>*/}
      {/*    <div className="mt-6 flex flex-col gap-5 w-full max-w-screen-lg">*/}
      {/*      {searches.map((search) => (*/}
      {/*        <SearchCard key={search.id} data={search} />*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  </>*/}
      {/*) : (*/}
      {/*  <div className="flex flex-col gap-4 h-full items-center justify-center mb-20">*/}
      {/*    <h3 className="text-xl font-bold">У вас ещё нет ни одного поиска</h3>*/}
      {/*    <CreateSearchButton />*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
}
