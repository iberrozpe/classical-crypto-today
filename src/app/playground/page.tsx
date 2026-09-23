import Link from "next/link";
import type { Metadata } from "next";
import { playgroundTools } from "@/lib/playground";

export const metadata: Metadata = {
  title: "Playground — Classical Crypto Today",
};

export default function PlaygroundIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Playground</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Real cryptography, running in your browser
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Every tool here uses the Web Crypto API — your browser&apos;s own, audited cryptography
        implementation. Nothing is simulated and nothing is sent to a server: keys are generated,
        used, and discarded entirely on your device.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {playgroundTools.map((tool) => (
          <div
            key={tool.slug}
            className="flex flex-col rounded-lg border border-border bg-surface p-5 transition hover:border-accent hover:bg-surface-hover"
          >
            <Link href={`/playground/${tool.slug}`} className="flex flex-1 flex-col">
              <span className="text-xs font-medium uppercase tracking-wide text-accent">
                {tool.category}
              </span>
              <span className="mt-2 text-lg font-semibold">{tool.title}</span>
              <p className="mt-2 flex-1 text-sm text-muted">{tool.summary}</p>
            </Link>
            <Link
              href={`/playground/${tool.slug}/how-it-works`}
              className="mt-3 text-sm font-medium text-accent underline underline-offset-4"
            >
              What&apos;s happening under the hood →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
