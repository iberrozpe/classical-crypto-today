import type { Metadata } from "next";
import { changelog } from "@/lib/changelog";

export const metadata: Metadata = {
  title: "Changelog — Classical Crypto Today",
  description: "Every dated update to this site, most recent first.",
};

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Changelog</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Every update, in order
      </h1>
      <p className="mt-4 text-muted">
        This site changes often — new modules, new Playground tools, corrections to existing
        content. Nothing changes silently: every dated entry below corresponds to a real,
        published commit.
      </p>

      <div className="mt-12 space-y-12">
        {changelog.map((entry) => (
          <div key={entry.date} className="relative border-l border-border pl-6">
            <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
            <p className="font-mono text-xs font-medium uppercase tracking-wide text-accent">
              {entry.date}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{entry.title}</h2>
            <ul className="mt-3 space-y-2">
              {entry.items.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-border" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-12 text-xs text-muted">
        Generated from this project&apos;s own git history — see the{" "}
        <a
          href="https://github.com/iberrozpe/classical-crypto-today/commits/main"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-4"
        >
          full commit log ↗
        </a>{" "}
        for exact diffs.
      </p>
    </div>
  );
}
