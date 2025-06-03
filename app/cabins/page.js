import CabinList from "../_components/CabinList";
import { Suspense } from "react";
import Spinner from "../_components/Spinner";
import Filter from "../_components/Filter";
import ReservationReminder from "../_components/ReservationReminder";

// this time of revalidation for INCREMENTAL SITE REGENERATION, should be in seconds.
// it will refresh the data and works for the second time that a user refresh page.
// this is only used for static render pages
export const revalidate = 3600;

export const metadata = {
  title: "Cabins",
};

export default function Page({ searchParams }) {
  // because of searchParams this component will be rendered dynamically, because at build-time REACT doesn't know which is its value, and this value will be obtained later at run-time.

  // searchParams could be used only on PAGE server component.
  // with this hook the page will be dynamically render

  const filter = searchParams.capacity ?? "all";

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Luxury Cabins
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        Cozy yet luxurious cabins, located right in the heart of the Italian
        Dolomites. Imagine waking up to beautiful mountain views, spending your
        days exploring the dark forests around, or just relaxing in your private
        hot tub under the stars. Enjoy nature&apos;s beauty in your own little
        home away from home. The perfect spot for a peaceful, calm vacation.
        Welcome to paradise.
      </p>
      <div className="flex justify-end mb-8">
        <Filter />
      </div>
      {/* ALL PAGE NAVIGATIONS are automatically wrapped in TRANSITIONS, so this Suspense component need a UNIQUE KEY to work properly and to show the fallback again, because of cabin List that actually perform some page navigation when user interact with cabin filter  */}
      <Suspense fallback={<Spinner />} key={filter}>
        <CabinList filter={filter} />
        <ReservationReminder />
      </Suspense>
    </div>
  );
}
