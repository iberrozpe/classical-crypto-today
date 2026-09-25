"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-start px-6 py-24">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Something went wrong</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">This page hit an unexpected error</h1>
      <p className="mt-4 text-muted">
        Nothing was lost — your progress and any local data are untouched. Try reloading this
        section, or head back to the homepage.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full border border-accent bg-accent-soft px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent-soft/80"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted transition hover:border-accent hover:text-foreground"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
