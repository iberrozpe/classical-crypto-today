import Link from "next/link";
import type { Metadata } from "next";
import { furtherReadingSites, furtherReadingBooks } from "@/lib/further-reading";
import { modules } from "@/lib/content";
import { playgroundTools } from "@/lib/playground";
import { glossaryTerms } from "@/lib/glossary";
import { useCases } from "@/lib/usecases";
import { challenges } from "@/lib/challenges";
import { quizzes } from "@/lib/quiz";
import { useCaseQuizzes } from "@/lib/usecase-quiz";
import { standardsBodies } from "@/lib/standards";
import { standardsQuizzes } from "@/lib/standards-quiz";

export const metadata: Metadata = {
  title: "About — Classical Crypto Today",
  description: "What this site is, how it's built, and what it's deliberately not.",
};

const sections = [
  { href: "/explore", title: "Explore", body: "Pick a persona — executive, GRC, developer, architect, IT ops, researcher, or curious — and get a reading path tailored to it. Nothing is hidden from anyone; a persona just reorders what you see first." },
  { href: "/learn", title: "Learn", body: `${modules.length} modules, from the history of cryptography through RSA, ECC, AES, TLS, and the post-quantum threat, each with diagrams, worked examples, and real formulas.` },
  { href: "/use-cases", title: "Use Cases", body: `${useCases.length} deep dives into how those primitives combine in production — envelope encryption, key wrapping, running a PKI, OAuth2/OIDC/SAML — each linking back to Learn instead of re-explaining the math.` },
  { href: "/standards", title: "Standards", body: `${standardsBodies.length} pages on the standardization bodies themselves — NIST, the IETF, ISO/IEC, and OASIS — how each actually works, what it's published, and where the real reference document lives.` },
  { href: "/playground", title: "Playground", body: `${playgroundTools.length} tools that run real cryptography in your browser via the Web Crypto API — AES-GCM, RSA-OAEP, ECDSA, X3DH, and more. Nothing is simulated, and nothing leaves your browser.` },
  { href: "/challenges", title: "Challenges", body: `${challenges.length} CryptoHack/Cryptopals-style puzzles — recover a hidden flag by breaking a classical cipher, an XOR mistake, or a flawed RSA/Diffie-Hellman setup. Checked and tracked entirely in your browser, with no accounts or leaderboard.` },
  { href: "/navigate", title: "Navigate", body: "Every module, tool, and category as a single connected graph, for when you'd rather explore by clicking around than by reading a list." },
  { href: "/compare", title: "Compare", body: "Side-by-side cheat sheets — RSA vs. ECC vs. Diffie-Hellman, AES modes, hash functions — for when you already know the material and just need the numbers." },
  { href: "/glossary", title: "Glossary", body: `${glossaryTerms.length} terms used across the site, defined plainly and linked back to the module that covers each one in depth.` },
  { href: "/migration-checklist", title: "Checklist", body: "A practical PQC-migration inventory for GRC and architecture teams — not a compliance audit, a starting point." },
  { href: "/quizzes", title: "Quizzes", body: `Every knowledge check on the site in one list — ${quizzes.length + useCaseQuizzes.length + standardsQuizzes.length} quizzes across every Learn module, Use Case, and Standards body, with an explanation for every answer.` },
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

      <h2 className="mt-14 text-xl font-semibold text-foreground">Disclaimer</h2>
      <div className="mt-4 space-y-3 text-muted">
        <p>
          Classical Crypto Today is an independent, single-maintainer educational project. It has
          not received endorsement from NIST, IETF, Signal, or any other organization, standards
          body, or individual referenced in its content.
        </p>
        <p>
          All information is sourced from publicly available standards, RFCs, and papers — listed
          in full on the{" "}
          <Link href="/references" className="text-accent underline underline-offset-4">
            References
          </Link>{" "}
          page — and cross-checked against them during writing. Despite that effort, the content
          may still contain inaccuracies; where this site and the underlying specification
          disagree, treat the specification as authoritative.
        </p>
        <p>
          The explanatory text was drafted with Claude (Anthropic), synthesizing those sources
          rather than quoting them. If you spot an error, please{" "}
          <a
            href="https://github.com/iberrozpe/classical-crypto-today/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-4"
          >
            open an issue on GitHub
          </a>{" "}
          — see the{" "}
          <Link href="/changelog" className="text-accent underline underline-offset-4">
            Changelog
          </Link>{" "}
          for how corrections get published.
        </p>
      </div>

      <h2 className="mt-14 text-xl font-semibold text-foreground">Data privacy</h2>
      <div className="mt-4 space-y-3 text-muted">
        <p>
          Classical Crypto Today is a static site — there is no backend server, no database, and
          no user accounts.
        </p>
        <ul className="space-y-2">
          <li>
            <span className="font-medium text-foreground">No personal data collection</span> — no
            names, emails, or form submissions. There are no forms anywhere on this site.
          </li>
          <li>
            <span className="font-medium text-foreground">Local-only persistence</span> — your
            theme preference, sidebar state, and migration-checklist progress live in your
            browser&apos;s localStorage only. None of it ever leaves your device.
          </li>
          <li>
            <span className="font-medium text-foreground">Client-side cryptography</span> — every
            Playground operation runs entirely in your browser via the Web Crypto API. No keys,
            plaintexts, or ciphertexts are ever transmitted, because there&apos;s no server to
            send them to.
          </li>
          <li>
            <span className="font-medium text-foreground">The only third-party data flow</span> is{" "}
            <a
              href="https://vercel.com/docs/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4"
            >
              Vercel Web Analytics
            </a>
            , which records anonymized, aggregated page views to show which modules people
            actually read. It doesn&apos;t use cookies, identifies visits with a hash that&apos;s
            discarded after 24 hours, and can&apos;t track you across other sites or identify you
            individually.
          </li>
          <li>
            <span className="font-medium text-foreground">Full transparency</span> — the entire
            source code, including this policy, is public on GitHub.
          </li>
        </ul>
      </div>

      <h2 className="mt-14 text-xl font-semibold text-foreground">Software Bill of Materials (SBOM)</h2>
      <div className="mt-4 space-y-4 text-muted">
        <div className="rounded-lg border border-accent/40 bg-accent-soft p-4">
          <p className="text-sm font-medium text-accent">0 known vulnerabilities</p>
          <p className="mt-1 text-sm">
            Across all 447 dependencies (25 production, the rest dev-only), per{" "}
            <code className="text-xs">npm audit</code> — verified 2026-09-24, and re-checked
            automatically by CI on every push via the workflow linked below.
          </p>
        </div>
        <div>
          <p className="font-medium text-foreground">Runtime dependencies</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            <li>Next.js 16, React 19, React DOM 19 — the application framework</li>
            <li>KaTeX — renders every formula on the site from hardcoded LaTeX strings</li>
            <li>d3-force — computes node positions for the Navigate graph</li>
            <li>@vercel/analytics — the cookieless page-view analytics described above</li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-foreground">Deliberately not a dependency</p>
          <p className="mt-1.5 text-sm">
            No cryptography library. Every Playground tool calls the browser&apos;s own Web
            Crypto API directly — nothing simulated, nothing third-party standing between you and
            the actual algorithm.
          </p>
        </div>
        <div>
          <p className="font-medium text-foreground">Security posture, checked against this codebase</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            <li>
              <code className="text-xs">dangerouslySetInnerHTML</code> appears in exactly two
              places: the theme-switch script (a fixed string, no user input) and KaTeX rendering
              (compiled from this site&apos;s own hardcoded formulas, never from anything a
              visitor types) — neither is reachable by user-supplied data
            </li>
            <li>No <code className="text-xs">eval()</code> and no direct <code className="text-xs">innerHTML</code> assignment anywhere in the codebase</li>
            <li>No hardcoded secrets or API keys — the demo values in the HMAC and JWT Playground tools are placeholders meant to be edited by you, and never leave your browser</li>
            <li>Every external link uses <code className="text-xs">rel=&quot;noopener noreferrer&quot;</code></li>
            <li>
              A GitHub Actions workflow lints, builds, and runs{" "}
              <code className="text-xs">npm audit --audit-level=high</code> on every push and
              pull request
            </li>
          </ul>
        </div>
      </div>

      <h2 className="mt-14 text-xl font-semibold text-foreground">License</h2>
      <div className="mt-4 space-y-3 text-muted">
        <p>
          The site&apos;s source code — everything under <code className="text-xs">src/</code>,
          config files, and build tooling — is released under the{" "}
          <span className="font-medium text-foreground">MIT License</span>: free to use, copy,
          modify, and redistribute, with no warranty.
        </p>
        <p>
          The written educational content — Learn module text, diagrams, glossary definitions,
          comparison tables, and quiz questions — is licensed separately, under{" "}
          <span className="font-medium text-foreground">
            Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 (CC BY-NC-ND 4.0)
          </span>
          : you can share it non-commercially with attribution, but not modify or resell it
          without permission.
        </p>
        <div className="flex flex-wrap gap-4 pt-1">
          <a
            href="https://github.com/iberrozpe/classical-crypto-today/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-accent underline underline-offset-4"
          >
            Code license (MIT) ↗
          </a>
          <a
            href="https://github.com/iberrozpe/classical-crypto-today/blob/main/CONTENT-LICENSE.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-accent underline underline-offset-4"
          >
            Content license (CC BY-NC-ND 4.0) ↗
          </a>
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

      <h2 className="mt-14 text-xl font-semibold text-foreground">Further reading</h2>
      <p className="mt-4 text-muted">Curated sites and books for going deeper than any single module can.</p>

      <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted">
        Websites &amp; blogs
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {furtherReadingSites.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border bg-surface p-4 transition hover:border-accent/50 hover:bg-surface-hover"
          >
            <span className="font-medium text-foreground">{item.title} ↗</span>
            <p className="mt-0.5 text-xs text-muted">{item.author}</p>
            <p className="mt-1.5 text-sm text-muted">{item.description}</p>
          </a>
        ))}
      </div>

      <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted">
        Essential books
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {furtherReadingBooks.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border bg-surface p-4 transition hover:border-accent/50 hover:bg-surface-hover"
          >
            <span className="font-medium text-foreground">{item.title} ↗</span>
            <p className="mt-0.5 text-xs text-muted">{item.author}</p>
            <p className="mt-1.5 text-sm text-muted">{item.description}</p>
          </a>
        ))}
      </div>

      <div className="mt-14 rounded-lg border border-border bg-surface p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Change control</p>
        <Link href="/changelog" className="mt-2 block text-lg font-semibold hover:text-accent">
          See every dated update →
        </Link>
        <p className="mt-1 text-sm text-muted">
          Nothing on this site changes silently — the Changelog lists every published update, most
          recent first.
        </p>
      </div>
    </div>
  );
}
