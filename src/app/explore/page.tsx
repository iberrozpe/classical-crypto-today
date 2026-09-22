import Link from "next/link";
import type { Metadata } from "next";
import { modules } from "@/lib/content";

export const metadata: Metadata = {
  title: "Explore — Classical Crypto Today",
};

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Explore</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Every topic, in plain words
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        A one-line answer for each topic, and a link to go deeper when you&apos;re ready.
      </p>

      <dl className="mt-12 divide-y divide-border">
        {modules.map((m) => (
          <div key={m.slug} className="py-6">
            <dt className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-lg font-semibold">{m.title}</span>
              <span className="text-xs text-muted">{m.category}</span>
            </dt>
            <dd className="mt-2 text-muted">{m.summary}</dd>
            <Link
              href={`/learn/${m.slug}`}
              className="mt-3 inline-block text-sm font-medium text-accent underline underline-offset-4"
            >
              First stop: read the module ({m.minutes} min) →
            </Link>
          </div>
        ))}
      </dl>
    </div>
  );
}
