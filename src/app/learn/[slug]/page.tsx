import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getModule, modules, roleLabels } from "@/lib/content";
import { playgroundTools } from "@/lib/playground";
import { getQuiz } from "@/lib/quiz";
import Math from "@/components/Math";
import DiagramRenderer from "@/components/diagrams/DiagramRenderer";
import PracticeProblems from "@/components/PracticeProblems";

export async function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata(props: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const mod = getModule(slug);
  if (!mod) return {};
  return {
    title: `${mod.title} — Classical Crypto Today`,
    description: mod.summary,
  };
}

export default async function ModulePage(props: PageProps<"/learn/[slug]">) {
  const { slug } = await props.params;
  const mod = getModule(slug);
  if (!mod) notFound();

  const currentIndex = modules.findIndex((m) => m.slug === slug);
  const next = modules[currentIndex + 1];
  const relatedTools = playgroundTools.filter((t) => t.relatedModule === slug);
  const quiz = getQuiz(slug);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/learn" className="text-sm text-muted hover:text-foreground">
        ← All modules
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide text-accent">
        <span>{mod.category}</span>
        <span className="text-muted">·</span>
        <span className="text-muted">{mod.minutes} min</span>
      </div>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{mod.title}</h1>
      <p className="mt-4 text-lg text-muted">{mod.summary}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {mod.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
          >
            {roleLabels[t]}
          </span>
        ))}
      </div>

      <article className="mt-12 space-y-10">
        {mod.sections.map((s) => (
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
            {s.practice && <PracticeProblems problems={s.practice} />}
          </section>
        ))}
      </article>

      {quiz && (
        <div className="mt-16 rounded-lg border border-border bg-surface p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Knowledge check</p>
          <Link
            href={`/learn/${slug}/quiz`}
            className="mt-2 block text-lg font-semibold hover:text-accent"
          >
            Test what you just learned →
          </Link>
          <p className="mt-1 text-sm text-muted">
            {quiz.questions.length} quick questions, with an explanation for every answer.
          </p>
        </div>
      )}

      {relatedTools.length > 0 && (
        <div className="mt-16 rounded-lg border border-accent/40 bg-accent-soft p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">Try it yourself</p>
          <div className="mt-3 space-y-3">
            {relatedTools.map((t) => (
              <Link key={t.slug} href={`/playground/${t.slug}`} className="block hover:text-accent">
                <span className="text-lg font-semibold">{t.title} →</span>
                <p className="text-sm text-muted">{t.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {next && (
        <div className="mt-16 rounded-lg border border-border bg-surface p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Up next</p>
          <Link
            href={`/learn/${next.slug}`}
            className="mt-2 block text-lg font-semibold hover:text-accent"
          >
            {next.title} →
          </Link>
          <p className="mt-1 text-sm text-muted">{next.summary}</p>
        </div>
      )}
    </div>
  );
}
