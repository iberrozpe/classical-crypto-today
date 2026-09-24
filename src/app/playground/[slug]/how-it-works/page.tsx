import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPlaygroundTool, playgroundTools } from "@/lib/playground";
import { getModule } from "@/lib/content";
import { getUseCase } from "@/lib/usecases";
import Math from "@/components/Math";
import DiagramRenderer from "@/components/diagrams/DiagramRenderer";

export async function generateStaticParams() {
  return playgroundTools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(
  props: PageProps<"/playground/[slug]/how-it-works">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const tool = getPlaygroundTool(slug);
  if (!tool) return {};
  return {
    title: `How ${tool.title} works — Classical Crypto Today`,
    description: `What's actually happening under the hood in the ${tool.title} playground tool.`,
  };
}

export default async function HowItWorksPage(props: PageProps<"/playground/[slug]/how-it-works">) {
  const { slug } = await props.params;
  const tool = getPlaygroundTool(slug);
  if (!tool) notFound();

  const related = tool.relatedModule ? getModule(tool.relatedModule) : undefined;
  const relatedUseCases = (tool.relatedUseCases ?? [])
    .map((s) => getUseCase(s))
    .filter((u) => u !== undefined);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href={`/playground/${slug}`} className="text-sm text-muted hover:text-foreground">
        ← Back to the tool
      </Link>

      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-accent">
        {tool.category} · Under the hood
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{tool.title}</h1>
      <p className="mt-4 text-lg text-muted">
        What each button in the tool actually computes, step by step — with the real formulas.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/playground/${slug}`}
          className="text-sm font-medium text-accent underline underline-offset-4"
        >
          ← Try it yourself in the tool
        </Link>
        {related && (
          <>
            <span className="text-sm text-muted">·</span>
            <Link
              href={`/learn/${related.slug}`}
              className="text-sm font-medium text-accent underline underline-offset-4"
            >
              Read the {related.title} module for the full background →
            </Link>
          </>
        )}
        {relatedUseCases.map((u) => (
          <span key={u.slug} className="flex items-center gap-3">
            <span className="text-sm text-muted">·</span>
            <Link
              href={`/use-cases/${u.slug}`}
              className="text-sm font-medium text-accent underline underline-offset-4"
            >
              See the {u.title} use case →
            </Link>
          </span>
        ))}
      </div>

      <article className="mt-12 space-y-10">
        {tool.howItWorks.map((s) => (
          <section key={s.heading}>
            <h2 className="text-xl font-semibold text-foreground">{s.heading}</h2>
            <div className="mt-3 space-y-4">
              {s.body.map((p, i) => (
                <p key={i} className="leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>
            {s.diagram && <DiagramRenderer diagram={s.diagram} />}
            {s.math?.map((m, i) => <Math key={i} expr={m.expr} caption={m.caption} />)}
          </section>
        ))}
      </article>

      <div className="mt-16 rounded-lg border border-border bg-surface p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Now try it</p>
        <Link
          href={`/playground/${slug}`}
          className="mt-2 block text-lg font-semibold hover:text-accent"
        >
          Back to {tool.title} →
        </Link>
        <p className="mt-1 text-sm text-muted">{tool.summary}</p>
      </div>
    </div>
  );
}
