"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "cct-solved-challenges";

export function useChallengeProgress() {
  // Starts empty on both server and first client render to avoid a
  // hydration mismatch, then syncs to the visitor's saved progress.
  const [solved, setSolved] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage (external system), not derived render state
        setSolved(new Set(JSON.parse(raw)));
      }
    } catch {
      // ignore
    }
  }, []);

  const markSolved = useCallback((slug: string) => {
    setSolved((prev) => {
      if (prev.has(slug)) return prev;
      const next = new Set(prev);
      next.add(slug);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { solved, markSolved };
}
