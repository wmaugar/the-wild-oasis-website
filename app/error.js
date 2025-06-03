"use client";

//This error component must be a CLIENT COMPONENT, because besides error info it will INTERACT with USER to take an action and for example return to previous page o reset.

//this Error.js component only will catch some error on Render, and won't catch errors that migght happen in the root layout

//There is another component to catch any error even inside root layout, for this you should create a file called global-error.js

export default function Error({ error, reset }) {
  return (
    <main className="flex justify-center items-center flex-col gap-6">
      <h1 className="text-3xl font-semibold">Something went wrong!</h1>
      <p className="text-lg">{error.message}</p>

      <button
        className="inline-block bg-accent-500 text-primary-800 px-6 py-3 text-lg"
        onClick={reset}
      >
        Try again
      </button>
    </main>
  );
}
