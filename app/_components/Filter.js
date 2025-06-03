"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function Filter() {
  //to Obtain params for this "client component" from the URL we should use useSearchParams() custom hook from next/navigation
  const searchParams = useSearchParams();
  const router = useRouter();
  // usePathName is a hook to obtain the pathname from URL
  const pathName = usePathname();
  // searchParams.get() receives the actual value of "capacity param", and if its null gives it a fallback value of "all"
  const activeFilter = searchParams.get("capacity") ?? "all";

  function handleFilter(filter) {
    // to use params from this "client component" we should use a web API called URL Search Params
    const params = new URLSearchParams(searchParams);
    // from this params we could do many things: set, delete.
    // Here we set params "capacity" to filter value.
    params.set("capacity", filter);
    // this params.set only builds the URL params but it does not navigate to a new page.
    // to redirect or navigate to this route we should use another function, "replace" function provided by useRouter hook from next/navigation  do this last work.
    router.replace(`${pathName}?${params.toString()}`, { scroll: false });
    // this optional parameter "scroll: false" says "no scroll back the page to the top"
  }

  return (
    <div className="border border-primary-800 flex">
      <Button
        filter="all"
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        All cabins
      </Button>
      <Button
        filter="small"
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        1&mdash;3 guests
      </Button>
      <Button
        filter="medium"
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        4&mdash;7 guests
      </Button>
      <Button
        filter="large"
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        8&mdash;12 guests
      </Button>
    </div>
  );
}

function Button({ filter, handleFilter, activeFilter, children }) {
  return (
    <button
      className={`px-5 py-2 hover:bg-primary-700 
        ${activeFilter === filter ? "bg-primary-700 text-primary-50" : ""}`}
      onClick={() => handleFilter(filter)}
      disabled={activeFilter === filter}
    >
      {children}
    </button>
  );
}

export default Filter;
