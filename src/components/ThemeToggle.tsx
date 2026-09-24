"use client";

import { useLayoutEffect, useState } from "react";

function IconSun() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
    </svg>
  );
}

export default function ThemeToggle({ collapsed }: { collapsed?: boolean }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useLayoutEffect(() => {
    // Re-applies the inline script's choice after React Strict Mode's dev-only
    // remount clears attributes it doesn't manage from JSX; a no-op in production.
    try {
      const stored = localStorage.getItem("theme");
      const current = (stored ?? document.documentElement.getAttribute("data-theme") ?? "dark") as "dark" | "light";
      document.documentElement.setAttribute("data-theme", current);
      // Syncing React's icon state to the DOM attribute the inline script (or
      // this same effect, after a dev Strict Mode remount) just set — not
      // state derived from a render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(current);
    } catch {
      // ignore
    }
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore
    }
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={`flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium text-muted transition hover:bg-surface-hover hover:text-foreground ${
        collapsed ? "justify-center" : ""
      }`}
    >
      {theme === "dark" ? <IconSun /> : <IconMoon />}
      {!collapsed && (theme === "dark" ? "Light mode" : "Dark mode")}
    </button>
  );
}
