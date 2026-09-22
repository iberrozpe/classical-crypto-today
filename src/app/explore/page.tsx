import Link from "next/link";
import type { Metadata } from "next";
import { modules, type Module } from "@/lib/content";

export const metadata: Metadata = {
  title: "Explore — Classical Crypto Today",
};

const categories: { name: Module["category"]; blurb: string }[] = [
  {
    name: "Foundations",
    blurb:
      "The math and primitives underneath everything else — modular arithmetic, hashing, randomness, key derivation.",
  },
  {
    name: "Symmetric-key",
    blurb:
      "One shared key encrypts and decrypts. Fast, and doing most of the actual work in any connection.",
  },
  {
    name: "Public-key",
    blurb:
      "Two mathematically linked keys solve the problem symmetric crypto can't: sharing a secret with a stranger.",
  },
  {
    name: "Protocols",
    blurb:
      "How the primitives above get composed into systems you actually use — HTTPS, SSH, certificates, messaging.",
  },
  {
    name: "Practice",
    blurb: "Where cryptography meets the real world — attacks, blockchains, and the risk that's already here.",
  },
];

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Explore</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Every topic, in plain words
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        A one-line answer for each of the {modules.length} topics on this site, grouped by kind,
        with a first stop for each when you&apos;re ready to go deeper.
      </p>

      <nav className="mt-8 flex flex-wrap gap-2 border-y border-border py-4">
        {categories.map((c) => (
          <a
            key={c.name}
            href={`#${c.name.toLowerCase()}`}
            className="rounded-full border border-border px-3 py-1 text-sm text-muted transition hover:border-accent hover:text-foreground"
          >
            {c.name}
            <span className="ml-1.5 text-xs text-muted">
              {modules.filter((m) => m.category === c.name).length}
            </span>
          </a>
        ))}
      </nav>

      <div className="mt-4 space-y-16">
        {categories.map((c) => {
          const inCategory = modules.filter((m) => m.category === c.name);
          if (inCategory.length === 0) return null;
          return (
            <section key={c.name} id={c.name.toLowerCase()} className="scroll-mt-20">
              <h2 className="text-xl font-semibold text-foreground">{c.name}</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted">{c.blurb}</p>

              <dl className="mt-6 divide-y divide-border border-t border-border">
                {inCategory.map((m) => (
                  <div key={m.slug} className="py-5">
                    <dt>
                      <Link
                        href={`/learn/${m.slug}`}
                        className="text-base font-semibold hover:text-accent"
                      >
                        {m.title}
                      </Link>
                    </dt>
                    <dd className="mt-1.5 text-muted">{m.summary}</dd>
                    <Link
                      href={`/learn/${m.slug}`}
                      className="mt-2 inline-block text-sm font-medium text-accent underline underline-offset-4"
                    >
                      First stop: read the module ({m.minutes} min) →
                    </Link>
                  </div>
                ))}
              </dl>
            </section>
          );
        })}
      </div>
    </div>
  );
}
