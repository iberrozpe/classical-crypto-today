import type { Metadata } from "next";
import { referenceGroups } from "@/lib/references";

export const metadata: Metadata = {
  title: "References — Classical Crypto Today",
  description: "The standards, RFCs, and papers this site's content is drawn from.",
};

export default function ReferencesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">References</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Where this content comes from
      </h1>
      <div className="mt-4 space-y-3 text-muted">
        <p>
          Every module on this site is written from the official standards, RFCs, and original
          papers that actually define these algorithms — listed below, grouped the same way the
          Learn catalog is. Worked examples (like the toy RSA and Diffie-Hellman key pairs) are
          computed directly from those specifications, not copied from a textbook.
        </p>
        <p>
          The diagrams are original illustrations built for this site, in some cases inspired by
          the layout of well-known public explanations (including relevant Wikipedia articles) —
          not reproductions of any single source.
        </p>
        <p>
          The explanatory text itself was drafted with Claude (Anthropic), synthesizing the
          sources below rather than quoting them, and reviewed for technical accuracy during
          writing. If you spot something that doesn&apos;t match the underlying spec, treat the
          spec as authoritative — and consider it a bug in this site worth reporting.
        </p>
      </div>

      <div className="mt-12 space-y-12">
        {referenceGroups.map((group) => (
          <section key={group.heading}>
            <h2 className="text-lg font-semibold text-foreground">{group.heading}</h2>
            {group.intro && <p className="mt-1.5 text-sm text-muted">{group.intro}</p>}
            <ul className="mt-4 space-y-4">
              {group.references.map((ref) => (
                <li key={ref.url} className="border-b border-border pb-4 last:border-0">
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground underline decoration-border underline-offset-4 hover:text-accent hover:decoration-accent"
                  >
                    {ref.title} ↗
                  </a>
                  <p className="mt-1 text-sm text-muted">{ref.publisher}</p>
                  {ref.note && <p className="mt-1 text-sm text-muted">{ref.note}</p>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
