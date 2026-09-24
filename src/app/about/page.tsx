import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Classical Crypto Today",
  description: "What this site is, how it's built, and what it's deliberately not.",
};

const sections = [
  { href: "/explore", title: "Explore", body: "Pick a persona — executive, GRC, developer, architect, IT ops, researcher, or curious — and get a reading path tailored to it. Nothing is hidden from anyone; a persona just reorders what you see first." },
  { href: "/learn", title: "Learn", body: "21 modules, from the history of cryptography through RSA, ECC, AES, TLS, and the post-quantum threat, each with diagrams, worked examples, and real formulas." },
  { href: "/playground", title: "Playground", body: "10 tools that run real cryptography in your browser via the Web Crypto API — AES-GCM, RSA-OAEP, ECDSA, X3DH, and more. Nothing is simulated, and nothing leaves your browser." },
  { href: "/navigate", title: "Navigate", body: "Every module, tool, and category as a single connected graph, for when you'd rather explore by clicking around than by reading a list." },
  { href: "/compare", title: "Compare", body: "Side-by-side cheat sheets — RSA vs. ECC vs. Diffie-Hellman, AES modes, hash functions — for when you already know the material and just need the numbers." },
  { href: "/glossary", title: "Glossary", body: "76 terms used across the site, defined plainly and linked back to the module that covers each one in depth." },
  { href: "/migration-checklist", title: "Checklist", body: "A practical PQC-migration inventory for GRC and architecture teams — not a compliance audit, a starting point." },
  { href: "/assess", title: "Assess", body: "Eight questions about what you actually run today, mapped to a prioritized reading list." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">About</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Classical cryptography, explained and grounded
      </h1>

      <div className="mt-6 space-y-4 text-muted">
        <p>
          Classical Crypto Today is a reference for the cryptography actually running the
          internet right now — RSA, ECC, Diffie-Hellman, AES, SHA-2, TLS — the algorithms that
          post-quantum cryptography is set to replace. Understanding what&apos;s being replaced,
          and why, turns out to be the fastest way to understand what comes next.
        </p>
        <p>
          Every claim on this site is meant to be checkable. Diagrams are computed from the real
          math, not hand-waved; Playground tools run your browser&apos;s actual Web Crypto API,
          not a simulation; and every module traces back to a real standard, RFC, or paper —
          listed in full on the{" "}
          <Link href="/references" className="text-accent underline underline-offset-4">
            References
          </Link>{" "}
          page.
        </p>
      </div>

      <h2 className="mt-14 text-xl font-semibold text-foreground">What&apos;s here</h2>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-lg border border-border bg-surface p-5 transition hover:border-accent/50 hover:bg-surface-hover"
          >
            <span className="font-semibold text-foreground">{s.title} →</span>
            <p className="mt-1.5 text-sm text-muted">{s.body}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-14 text-xl font-semibold text-foreground">What this deliberately isn&apos;t</h2>
      <div className="mt-4 space-y-3 text-muted">
        <p>
          This isn&apos;t a compliance tool, a certification body, or a vendor evaluation
          platform — the Assess quiz and migration checklist are explicitly starting points for a
          conversation, not a substitute for a real cryptographic inventory or an audit.
        </p>
        <p>
          There&apos;s no scoring or trust-rating system for the content itself, no login, no
          tracking of what you read, and nothing you type into a Playground tool or the checklist
          is ever sent to a server — the checklist saves to your browser&apos;s local storage
          only, and every cryptographic operation runs entirely client-side.
        </p>
      </div>

      <h2 className="mt-14 text-xl font-semibold text-foreground">Open source</h2>
      <p className="mt-4 text-muted">
        The full source — content, diagrams, and every Playground tool — is public on GitHub.
        Corrections, issues, and pull requests are welcome.
      </p>
      <div className="mt-4 flex flex-wrap gap-4">
        <a
          href="https://github.com/iberrozpe/classical-crypto-today"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-accent underline underline-offset-4"
        >
          View the repository ↗
        </a>
        <a
          href="https://github.com/iberrozpe/classical-crypto-today/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-accent underline underline-offset-4"
        >
          Report an issue ↗
        </a>
      </div>
    </div>
  );
}
