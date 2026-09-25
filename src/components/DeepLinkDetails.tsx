"use client";

import { useEffect } from "react";

/**
 * If the page was loaded (or navigated to client-side) with a #hash that
 * points at, or inside, a collapsed <details> "Go deeper" section, force it
 * open and re-scroll to it — the browser's native fragment-navigation only
 * scrolls to the element, it doesn't open a closed <details> in every case.
 */
export default function DeepLinkDetails() {
  useEffect(() => {
    function openTarget() {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      let el: Element | null = null;
      try {
        el = document.getElementById(hash);
      } catch {
        return;
      }
      if (!el) return;
      const details = el instanceof HTMLDetailsElement ? el : el.closest("details");
      if (details && !details.open) {
        details.open = true;
        requestAnimationFrame(() => el!.scrollIntoView({ block: "start" }));
      }
    }
    openTarget();
    window.addEventListener("hashchange", openTarget);
    return () => window.removeEventListener("hashchange", openTarget);
  }, []);

  return null;
}
