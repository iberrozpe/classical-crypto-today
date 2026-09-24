import Link from "next/link";
import type { Metadata } from "next";
import { comparisonTables } from "@/lib/compare";
import { getModule } from "@/lib/content";

export const metadata: Metadata = {
  title: "Compare — Classical Crypto Today",
  description: "Side-by-side cheat sheets comparing algorithms, modes, and constructions at a glance.",
};

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Compare</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Cheat sheets, side by side
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Quick-reference tables for when you already know the material and just need the numbers —
        each one links back to the full module for the reasoning behind it.
      </p>

      <div className="mt-8 flex flex-wrap gap-1.5">
        {comparisonTables.map((t) => (
          <a
            key={t.slug}
            href={`#${t.slug}`}
            className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted hover:border-accent hover:text-accent"
          >
            {t.title}
          </a>
        ))}
      </div>

      <div className="mt-12 space-y-14">
        {comparisonTables.map((t) => {
          const modules = (t.relatedModules ?? [])
            .map((slug) => getModule(slug))
            .filter((m): m is NonNullable<typeof m> => Boolean(m));
          return (
            <section key={t.slug} id={t.slug} className="scroll-mt-20">
              <h2 className="text-xl font-semibold text-foreground">{t.title}</h2>
              <p className="mt-1.5 text-sm text-muted">{t.blurb}</p>

              <div className="mt-4 overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[480px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface">
                      {t.columns.map((col, i) => (
                        <th
                          key={i}
                          className={`px-4 py-2.5 text-left font-semibold text-foreground ${
                            i === 0 ? "text-muted" : "text-accent"
                          }`}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.rows.map((row, ri) => (
                      <tr key={ri} className={ri % 2 === 1 ? "bg-surface/50" : ""}>
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className={`px-4 py-2.5 align-top ${
                              ci === 0 ? "font-medium text-foreground" : "text-muted"
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {modules.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {modules.map((m) => (
                    <Link
                      key={m.slug}
                      href={`/learn/${m.slug}`}
                      className="text-xs font-medium text-accent underline underline-offset-4"
                    >
                      Full explanation: {m.title} →
                    </Link>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
