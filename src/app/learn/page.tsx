import Link from "next/link";
import type { Metadata } from "next";
import { getPersona, modules, personas } from "@/lib/content";

export const metadata: Metadata = {
  title: "Learn — Classical Crypto Today",
};

const categoryOrder = ["Foundations", "Symmetric-key", "Public-key", "Protocols", "Practice"] as const;

export default async function LearnPage(props: PageProps<"/learn">) {
  const searchParams = await props.searchParams;
  const roleParam = typeof searchParams.role === "string" ? searchParams.role : undefined;
  const persona = roleParam ? getPersona(roleParam) : undefined;

  const recommendedSlugs = new Set(persona?.moduleSlugs ?? []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Learn</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        The full module catalog
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Eight modules covering the cryptography behind every HTTPS connection: how it works,
        why it&apos;s trusted, and why it&apos;s the thing post-quantum cryptography replaces.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted">View as:</span>
        <Link
          href="/learn"
          className={`rounded-full border px-3 py-1 text-sm transition ${
            !persona
              ? "border-accent bg-accent-soft text-accent"
              : "border-border text-muted hover:text-foreground"
          }`}
        >
          Everyone
        </Link>
        {personas.map((p) => (
          <Link
            key={p.id}
            href={`/learn?role=${p.id}`}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              persona?.id === p.id
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            {p.label}
          </Link>
        ))}
      </div>

      {persona && (
        <div className="mt-6 rounded-lg border border-accent bg-accent-soft p-5">
          <p className="text-sm text-foreground">{persona.pitch}</p>
          <Link
            href={`/learn/${persona.firstWin.slug}`}
            className="mt-3 inline-block text-sm font-semibold text-accent underline underline-offset-4"
          >
            Start with your first win: {persona.firstWin.label} ({persona.firstWin.minutes} min) →
          </Link>
        </div>
      )}

      <div className="mt-12 space-y-12">
        {categoryOrder.map((category) => {
          const inCategory = modules.filter((m) => m.category === category);
          if (inCategory.length === 0) return null;
          return (
            <div key={category}>
              <h2 className="text-lg font-semibold text-foreground">{category}</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {inCategory.map((m) => {
                  const recommended = recommendedSlugs.has(m.slug);
                  return (
                    <Link
                      key={m.slug}
                      href={`/learn/${m.slug}`}
                      className={`flex flex-col rounded-lg border p-5 transition hover:border-accent hover:bg-surface-hover ${
                        persona && recommended
                          ? "border-accent/60 bg-surface"
                          : "border-border bg-surface"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{m.title}</span>
                        {persona && recommended && (
                          <span className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                            recommended
                          </span>
                        )}
                      </div>
                      <p className="mt-2 flex-1 text-sm text-muted">{m.summary}</p>
                      <span className="mt-3 text-xs font-medium text-muted">
                        {m.minutes} min
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
