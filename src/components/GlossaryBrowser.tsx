"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { GlossaryTerm } from "@/lib/glossary";
import { getModule } from "@/lib/content";
import { getUseCase } from "@/lib/usecases";
import { getStandardsBody } from "@/lib/standards";
import { slugify } from "@/lib/slugify";

export default function GlossaryBrowser({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return terms;
    return terms.filter(
      (t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q),
    );
  }, [terms, query]);

  const grouped = useMemo(() => {
    const groups = new Map<string, GlossaryTerm[]>();
    for (const t of filtered) {
      const letter = t.term[0].toUpperCase();
      if (!groups.has(letter)) groups.set(letter, []);
      groups.get(letter)!.push(t);
    }
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const letters = useMemo(
    () => [...new Set(terms.map((t) => t.term[0].toUpperCase()))].sort(),
    [terms],
  );

  return (
    <div className="mt-8">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search terms and definitions…"
        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
      />

      {!query && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {letters.map((l) => (
            <a
              key={l}
              href={`#letter-${l}`}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-xs font-medium text-muted hover:border-accent hover:text-accent"
            >
              {l}
            </a>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-muted">
        {filtered.length} of {terms.length} terms
      </p>

      <div className="mt-6 space-y-10">
        {grouped.map(([letter, items]) => (
          <div key={letter} id={`letter-${letter}`} className="scroll-mt-20">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">{letter}</h2>
            <div className="mt-3 space-y-5">
              {items.map((t) => {
                const modules = (t.relatedModules ?? [])
                  .map((slug) => getModule(slug))
                  .filter((m): m is NonNullable<typeof m> => Boolean(m));
                const useCaseLinks = (t.relatedModules ?? [])
                  .map((slug) => getUseCase(slug))
                  .filter((u): u is NonNullable<typeof u> => Boolean(u));
                const standardsLinks = (t.relatedModules ?? [])
                  .map((slug) => getStandardsBody(slug))
                  .filter((s): s is NonNullable<typeof s> => Boolean(s));
                return (
                  <div key={t.term} id={slugify(t.term)} className="scroll-mt-20 border-b border-border pb-5 last:border-0">
                    <p className="font-semibold text-foreground">{t.term}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{t.definition}</p>
                    {(modules.length > 0 || useCaseLinks.length > 0 || standardsLinks.length > 0) && (
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                        {modules.map((m) => (
                          <Link
                            key={m.slug}
                            href={`/learn/${m.slug}`}
                            className="text-xs font-medium text-accent underline underline-offset-4"
                          >
                            {m.title} →
                          </Link>
                        ))}
                        {useCaseLinks.map((u) => (
                          <Link
                            key={u.slug}
                            href={`/use-cases/${u.slug}`}
                            className="text-xs font-medium text-accent underline underline-offset-4"
                          >
                            {u.title} →
                          </Link>
                        ))}
                        {standardsLinks.map((s) => (
                          <Link
                            key={s.slug}
                            href={`/standards/${s.slug}`}
                            className="text-xs font-medium text-accent underline underline-offset-4"
                          >
                            {s.title} →
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted">No terms match &ldquo;{query}&rdquo;.</p>
        )}
      </div>
    </div>
  );
}
