import Link from "next/link";
import type { Metadata } from "next";
import { standardsBodies } from "@/lib/standards";

export const metadata: Metadata = {
  title: "Standards — Classical Crypto Today",
  description: "The standardization bodies behind the cryptography on this site — NIST, the IETF, ISO/IEC, and OASIS — and what each has actually published.",
};

export default function StandardsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Standards</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Who actually writes the standards
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Every algorithm and protocol in this catalog traces back to a specific document from a
        specific standards body. These pages cover the bodies themselves — how each one actually
        works, what it&apos;s published, and where to find the real reference.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {standardsBodies.map((s) => (
          <Link
            key={s.slug}
            href={`/standards/${s.slug}`}
            className="flex flex-col rounded-lg border border-border bg-surface p-5 transition hover:border-accent hover:bg-surface-hover"
          >
            <span className="font-semibold">{s.title}</span>
            <p className="mt-2 flex-1 text-sm text-muted">{s.summary}</p>
            <span className="mt-3 text-xs font-medium text-muted">{s.minutes} min</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
