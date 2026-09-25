"use client";

import { useMemo, useState } from "react";
import type { LibraryEntry, LibraryType } from "@/lib/library";
import { libraryTypeLabels } from "@/lib/library";
import { slugify } from "@/lib/slugify";

const TYPE_ORDER: LibraryType[] = ["paper", "standard", "site", "book"];

export default function LibraryBrowser({ entries }: { entries: LibraryEntry[] }) {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<LibraryType | "all">("all");

  const counts = useMemo(() => {
    const c: Record<LibraryType, number> = { paper: 0, standard: 0, site: 0, book: 0 };
    for (const e of entries) c[e.type]++;
    return c;
  }, [entries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (activeType !== "all" && e.type !== activeType) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.publisher.toLowerCase().includes(q) ||
        e.topic.toLowerCase().includes(q) ||
        (e.note?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [entries, query, activeType]);

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveType("all")}
          className={`rounded-full border px-3 py-1.5 text-sm transition ${
            activeType === "all"
              ? "border-accent bg-accent-soft text-accent"
              : "border-border text-muted hover:text-foreground"
          }`}
        >
          All <span className="text-xs opacity-70">({entries.length})</span>
        </button>
        {TYPE_ORDER.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveType(t)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              activeType === t
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            {libraryTypeLabels[t]} <span className="text-xs opacity-70">({counts[t]})</span>
          </button>
        ))}
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title, publisher, or topic…"
        className="mt-4 w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
      />

      <p className="mt-4 text-xs text-muted">
        {filtered.length} of {entries.length} entries
      </p>

      <ul className="mt-4 space-y-4">
        {filtered.map((e) => (
          <li
            key={e.url}
            id={slugify(e.title)}
            className="scroll-mt-20 rounded-lg border border-border bg-surface p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
                {libraryTypeLabels[e.type]}
              </span>
              <span className="text-xs text-muted">{e.topic}</span>
            </div>
            <a
              href={e.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block font-medium text-foreground underline decoration-border underline-offset-4 hover:text-accent hover:decoration-accent"
            >
              {e.title} ↗
            </a>
            <p className="mt-1 text-sm text-muted">{e.publisher}</p>
            {e.note && <p className="mt-1.5 text-sm text-muted">{e.note}</p>}
          </li>
        ))}
        {filtered.length === 0 && <p className="text-muted">No entries match &ldquo;{query}&rdquo;.</p>}
      </ul>
    </div>
  );
}
