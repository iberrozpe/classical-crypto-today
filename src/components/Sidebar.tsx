"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, isActiveLink, IconChevronLeft, IconChevronRight } from "./nav-links";

const STORAGE_KEY = "cct-sidebar-collapsed";

export default function Sidebar() {
  const pathname = usePathname();
  // Starts expanded on both server and first client render to avoid a
  // hydration mismatch, then syncs to the visitor's remembered preference.
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage (external system), not derived render state
      if (localStorage.getItem(STORAGE_KEY) === "1") setCollapsed(true);
    } catch {
      // ignore
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  }

  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 sm:flex ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-3">
        {!collapsed && (
          <Link href="/" className="truncate text-sm font-semibold tracking-tight">
            Classical Crypto <span className="text-accent">Today</span>
          </Link>
        )}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          className={`rounded-md p-1.5 text-muted hover:bg-surface-hover hover:text-foreground ${
            collapsed ? "mx-auto" : ""
          }`}
        >
          {collapsed ? <IconChevronRight /> : <IconChevronLeft />}
        </button>
      </div>

      <nav className="flex flex-col gap-1 px-3 py-2">
        {navLinks.map((l) => {
          const active = isActiveLink(pathname, l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              title={collapsed ? l.label : undefined}
              className={`flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition ${
                active
                  ? "bg-accent-soft text-accent"
                  : "text-muted hover:bg-surface-hover hover:text-foreground"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <l.icon />
              {!collapsed && l.label}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="mt-auto px-4 py-4 text-xs text-muted">More sections coming soon.</div>
      )}
    </aside>
  );
}
