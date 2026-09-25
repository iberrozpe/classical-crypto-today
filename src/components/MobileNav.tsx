"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, isActiveLink, IconMenu, IconX, IconSearch } from "./nav-links";
import ThemeToggle from "./ThemeToggle";
import { openSearchPalette } from "./SearchPalette";

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Classical Crypto <span className="text-accent">Today</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openSearchPalette}
            aria-label="Search"
            className="rounded-md border border-border p-2 text-muted hover:text-foreground"
          >
            <IconSearch />
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            className="rounded-md border border-border p-2 text-muted hover:text-foreground"
          >
            <IconMenu />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <div className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">
                Classical Crypto <span className="text-accent">Today</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="rounded-md p-1 text-muted hover:text-foreground"
              >
                <IconX />
              </button>
            </div>
            <nav className="mt-6 flex flex-col gap-1">
              {navLinks.map((l) => {
                const active = isActiveLink(pathname, l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-accent-soft text-accent"
                        : "text-muted hover:bg-surface-hover hover:text-foreground"
                    }`}
                  >
                    <l.icon />
                    {l.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto border-t border-border pt-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
