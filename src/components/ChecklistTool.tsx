"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChecklistCategory } from "@/lib/checklist";

const STORAGE_KEY = "cct-migration-checklist";

export default function ChecklistTool({ categories }: { categories: ChecklistCategory[] }) {
  // Starts empty on both server and first client render to avoid a hydration
  // mismatch, then syncs to whatever the visitor previously checked off.
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage (external system), not derived render state
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const totalItems = useMemo(() => categories.reduce((n, c) => n + c.items.length, 0), [categories]);
  const checkedCount = Object.values(checked).filter(Boolean).length;

  function toggle(id: string) {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  function reset() {
    setChecked({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-2 w-32 overflow-hidden rounded-full bg-background sm:w-48">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${totalItems === 0 ? 0 : (checkedCount / totalItems) * 100}%` }}
            />
          </div>
          <span className="text-sm text-muted">
            {checkedCount} / {totalItems}
          </span>
        </div>
        {checkedCount > 0 && (
          <button
            type="button"
            onClick={reset}
            className="text-xs font-medium text-muted underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-accent"
          >
            Reset
          </button>
        )}
      </div>

      <div className="mt-8 space-y-10">
        {categories.map((cat) => (
          <div key={cat.title}>
            <h2 className="text-lg font-semibold text-foreground">{cat.title}</h2>
            <p className="mt-1 text-sm text-muted">{cat.intro}</p>
            <div className="mt-4 space-y-2">
              {cat.items.map((item) => (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-4 transition hover:border-accent/50"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(checked[item.id])}
                    onChange={() => toggle(item.id)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
                  />
                  <span>
                    <span
                      className={`font-medium ${checked[item.id] ? "text-muted line-through" : "text-foreground"}`}
                    >
                      {item.label}
                    </span>
                    {item.detail && <p className="mt-1 text-sm text-muted">{item.detail}</p>}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
