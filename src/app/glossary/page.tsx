import type { Metadata } from "next";
import { glossaryTerms } from "@/lib/glossary";
import GlossaryBrowser from "@/components/GlossaryBrowser";

export const metadata: Metadata = {
  title: "Glossary — Classical Crypto Today",
  description: "A searchable A–Z glossary of every cryptography term used across this site.",
};

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Glossary</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Every term, in one place
      </h1>
      <p className="mt-4 text-muted">
        {glossaryTerms.length} terms used across this site, defined plainly and cross-linked back
        to the module that covers them in depth.
      </p>
      <GlossaryBrowser terms={glossaryTerms} />
    </div>
  );
}
