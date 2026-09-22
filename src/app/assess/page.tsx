import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assess — Classical Crypto Today",
};

export default function AssessPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Assess</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Coming in the full version</h1>
      <p className="mt-4 text-muted">
        A short questionnaire that maps what your systems actually rely on — which algorithms,
        which key sizes, which protocols — and points you at the modules that matter most. This
        MVP ships the content catalog first; the assessment is next.
      </p>
      <Link
        href="/learn"
        className="mt-8 inline-block rounded-full border border-accent bg-accent-soft px-5 py-2 text-sm font-semibold text-accent"
      >
        Browse the module catalog instead →
      </Link>
    </div>
  );
}
