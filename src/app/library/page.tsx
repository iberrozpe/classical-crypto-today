import type { Metadata } from "next";
import { libraryEntries } from "@/lib/library";
import LibraryBrowser from "@/components/LibraryBrowser";

export const metadata: Metadata = {
  title: "Library — Classical Crypto Today",
  description: "The standards, RFCs, papers, sites, and books this site's content is drawn from and points toward — searchable and filterable in one place.",
};

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Library</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Where this content comes from — and where to go deeper
      </h1>
      <div className="mt-4 space-y-3 text-muted">
        <p>
          Every module on this site is written from the official standards, RFCs, and original
          papers that actually define these algorithms. Worked examples (like the toy RSA and
          Diffie-Hellman key pairs) are computed directly from those specifications, not copied
          from a textbook.
        </p>
        <p>
          Alongside those primary sources, this library also collects the sites, blogs, courses,
          and books worth reading once a module raises more questions than it answers — search or
          filter by type to find either.
        </p>
        <p>
          The explanatory text itself was drafted with Claude (Anthropic), synthesizing the
          sources below rather than quoting them, and reviewed for technical accuracy during
          writing. If you spot something that doesn&apos;t match the underlying spec, treat the
          spec as authoritative — and consider it a bug in this site worth reporting.
        </p>
      </div>

      <LibraryBrowser entries={libraryEntries} />
    </div>
  );
}
