"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { search, type SearchEntry } from "@/lib/search";

export const OPEN_SEARCH_EVENT = "cct-open-search";

export function openSearchPalette() {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}

export default function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => search(query), [query]);

  function updateQuery(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    function handleOpenEvent() {
      setOpen(true);
    }
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener(OPEN_SEARCH_EVENT, handleOpenEvent);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener(OPEN_SEARCH_EVENT, handleOpenEvent);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      // Focus needs to happen after the modal actually mounts into the DOM.
      const id = setTimeout(() => inputRef.current?.focus(), 0);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(id);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  function close() {
    setOpen(false);
    setQuery("");
  }

  function go(entry: SearchEntry) {
    router.push(entry.href);
    close();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const entry = results[activeIndex];
      if (entry) go(entry);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close search"
        onClick={close}
        className="absolute inset-0 cursor-default"
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-lg border border-border bg-surface shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search modules, use cases, playground tools, glossary…"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted sm:block">
            esc
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() === "" && (
            <p className="px-4 py-8 text-center text-sm text-muted">
              Search across every module, use case, playground tool, and glossary term on the site.
            </p>
          )}
          {query.trim() !== "" && results.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted">No results for &quot;{query}&quot;.</p>
          )}
          {results.map((entry, i) => (
            <button
              key={`${entry.href}-${i}`}
              type="button"
              onClick={() => go(entry)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex w-full items-start gap-3 px-4 py-3 text-left transition ${
                i === activeIndex ? "bg-accent-soft" : "hover:bg-surface-hover"
              }`}
            >
              <span className="mt-0.5 shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
                {entry.typeLabel}
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-sm font-medium ${i === activeIndex ? "text-accent" : "text-foreground"}`}>
                  {entry.title}
                </span>
                <span className="block truncate text-xs text-muted">{entry.subtitle}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[11px] text-muted">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border px-1">↑</kbd>
            <kbd className="rounded border border-border px-1">↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border px-1">↵</kbd> select
          </span>
          <span className="ml-auto">Nothing you type here leaves your browser</span>
        </div>
      </div>
    </div>
  );
}
