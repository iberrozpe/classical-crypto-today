import Link from "next/link";
import type { Metadata } from "next";
import { useCases } from "@/lib/usecases";

export const metadata: Metadata = {
  title: "Use Cases — Classical Crypto Today",
  description: "How cryptographic primitives combine into the real systems that run on them — KMS, PKI, and federated identity.",
};

const categoryOrder = ["Key Management", "PKI & Certificates", "Identity & Access"] as const;

export default function UseCasesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Use Cases</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        How the primitives come together in production
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        The Learn catalog covers what each primitive is — RSA, AES, Diffie-Hellman, JWTs. This is
        the other half: the real systems built out of them, and the operational decisions that
        don&apos;t show up in a protocol spec. Each use case links back to the Learn modules that
        cover the underlying math, rather than re-explaining it.
      </p>

      <div className="mt-12 space-y-12">
        {categoryOrder.map((category) => {
          const inCategory = useCases.filter((u) => u.category === category);
          if (inCategory.length === 0) return null;
          return (
            <div key={category}>
              <h2 className="text-lg font-semibold text-foreground">{category}</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {inCategory.map((u) => (
                  <Link
                    key={u.slug}
                    href={`/use-cases/${u.slug}`}
                    className="flex flex-col rounded-lg border border-border bg-surface p-5 transition hover:border-accent hover:bg-surface-hover"
                  >
                    <span className="font-semibold">{u.title}</span>
                    <p className="mt-2 flex-1 text-sm text-muted">{u.summary}</p>
                    <span className="mt-3 text-xs font-medium text-muted">{u.minutes} min</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
