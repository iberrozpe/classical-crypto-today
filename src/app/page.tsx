import Link from "next/link";
import { personas, getPersonaTrackStats, modules } from "@/lib/content";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Classical cryptography, explained and grounded
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          The cryptography running the internet, right now.
        </h1>
        <p className="mt-6 text-lg text-muted">
          RSA. ECC. Diffie-Hellman. AES. SHA-2. TLS. This is the &ldquo;classical&rdquo;
          cryptography that post-quantum algorithms are set to replace — and almost none of it
          is going anywhere overnight. Understand what it actually does before you plan around
          what comes next.
        </p>
        <p className="mt-3 text-sm text-muted">{modules.length} modules · growing catalog</p>
      </div>

      <div className="mt-16">
        <h2 className="text-xl font-semibold">Who&apos;s asking?</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Pick the closest fit and we&apos;ll lead with what&apos;s most useful to you. You&apos;ll
          still see everything — nothing gets hidden, and you can change this on any page.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {personas.map((p) => {
            const stats = getPersonaTrackStats(p);
            return (
              <Link
                key={p.id}
                href={`/learn?role=${p.id}`}
                className="group flex flex-col rounded-lg border border-border bg-surface p-6 transition hover:border-accent hover:bg-surface-hover"
              >
                <span className="text-xs font-medium uppercase tracking-wide text-accent">
                  {p.tagline}
                </span>
                <span className="mt-2 text-lg font-semibold">{p.label}</span>
                <p className="mt-2 flex-1 text-sm text-muted">{p.pitch}</p>
                <span className="mt-4 text-sm font-medium text-foreground">
                  First win — {p.firstWin.label} · {p.firstWin.minutes} min
                  <span className="ml-1 inline-block transition group-hover:translate-x-1">
                    →
                  </span>
                </span>
                <span className="mt-1 text-xs text-muted">
                  then {stats.count} modules · {stats.minutes} min
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-6">
          <Link
            href="/learn"
            className="text-sm font-medium text-muted underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-accent"
          >
            Not sure, or don&apos;t want to commit? See the full catalog, unfiltered →
          </Link>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/explore"
          className="rounded-lg border border-border p-6 transition hover:border-accent"
        >
          <h3 className="font-semibold">Explore</h3>
          <p className="mt-2 text-sm text-muted">
            Every topic on the site in plain words, with a first stop for each.
          </p>
        </Link>
        <Link
          href="/learn"
          className="rounded-lg border border-border p-6 transition hover:border-accent"
        >
          <h3 className="font-semibold">Learn</h3>
          <p className="mt-2 text-sm text-muted">
            The full module catalog — symmetric crypto, public-key crypto, and how TLS
            combines them.
          </p>
        </Link>
        <Link
          href="/playground"
          className="rounded-lg border border-border p-6 transition hover:border-accent"
        >
          <h3 className="font-semibold">Playground</h3>
          <p className="mt-2 text-sm text-muted">
            Real cryptography running in your browser — encrypt, sign, and verify with the Web
            Crypto API.
          </p>
        </Link>
        <Link
          href="/assess"
          className="rounded-lg border border-border p-6 transition hover:border-accent"
        >
          <h3 className="font-semibold">Assess</h3>
          <p className="mt-2 text-sm text-muted">
            Eight quick questions about what you run today, mapped to a prioritized reading list.
          </p>
        </Link>
      </div>
    </div>
  );
}
