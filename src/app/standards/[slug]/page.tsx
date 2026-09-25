import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStandardsBody, standardsBodies } from "@/lib/standards";
import { getModule, roleLabels } from "@/lib/content";
import { getUseCase } from "@/lib/usecases";
import { getStandardsQuiz } from "@/lib/standards-quiz";
import { slugify } from "@/lib/slugify";
import Math from "@/components/Math";
import DiagramRenderer from "@/components/diagrams/DiagramRenderer";
import PracticeProblems from "@/components/PracticeProblems";
import DeepLinkDetails from "@/components/DeepLinkDetails";

export async function generateStaticParams() {
  return standardsBodies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/standards/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const body = getStandardsBody(slug);
  if (!body) return {};
  return {
    title: `${body.title} — Classical Crypto Today`,
    description: body.summary,
  };
}

export default async function StandardsBodyPage(props: PageProps<"/standards/[slug]">) {
  const { slug } = await props.params;
  const body = getStandardsBody(slug);
  if (!body) notFound();

  const currentIndex = standardsBodies.findIndex((s) => s.slug === slug);
  const next = standardsBodies[currentIndex + 1];
  const relatedModules = body.relatedModules
    .map((s) => getModule(s))
    .filter((m) => m !== undefined);
  const relatedUseCases = (body.relatedUseCases ?? [])
    .map((s) => getUseCase(s))
    .filter((u) => u !== undefined);
  const quiz = getStandardsQuiz(slug);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <DeepLinkDetails />
      <Link href="/standards" className="text-sm text-muted hover:text-foreground">
        ← All standards
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide text-accent">
        <span>Standards</span>
        <span className="text-muted">·</span>
        <span className="text-muted">{body.minutes} min</span>
      </div>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{body.title}</h1>
      <p className="mt-4 text-lg text-muted">{body.summary}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {body.tags.map((t) => (
          <span key={t} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
            {roleLabels[t]}
          </span>
        ))}
      </div>

      {(relatedModules.length > 0 || relatedUseCases.length > 0) && (
        <div className="mt-6 rounded-lg border border-border bg-surface p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Builds on these Learn modules
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {relatedModules.map((m) => (
              <Link
                key={m.slug}
                href={`/learn/${m.slug}`}
                className="rounded-full border border-accent/40 bg-accent-soft px-3 py-1 text-xs font-medium text-accent transition hover:border-accent"
              >
                {m.title} →
              </Link>
            ))}
            {relatedUseCases.map((u) => (
              <Link
                key={u.slug}
                href={`/use-cases/${u.slug}`}
                className="rounded-full border border-accent/40 bg-accent-soft px-3 py-1 text-xs font-medium text-accent transition hover:border-accent"
              >
                {u.title} →
              </Link>
            ))}
          </div>
        </div>
      )}

      <article className="mt-12 space-y-10">
        {body.sections.map((s) =>
          s.advanced ? (
            <details
              key={s.heading}
              id={slugify(s.heading)}
              className="group scroll-mt-20 rounded-lg border border-border open:border-transparent"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 marker:content-none">
                <span className="flex items-center gap-3">
                  <span className="shrink-0 rounded-full border border-accent/40 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-accent">
                    Go deeper
                  </span>
                  <span className="text-xl font-semibold text-foreground">{s.heading}</span>
                </span>
                <span className="shrink-0 text-muted transition group-open:rotate-180">⌄</span>
              </summary>
              <div className="px-5 pb-5">
                <div className="space-y-4">
                  {s.body.map((p, i) => (
                    <p key={i} className="leading-relaxed text-muted">
                      {p}
                    </p>
                  ))}
                </div>
                {s.diagram && <DiagramRenderer diagram={s.diagram} />}
                {s.math?.map((m, i) => <Math key={i} expr={m.expr} caption={m.caption} />)}
                {s.practice && <PracticeProblems problems={s.practice} />}
              </div>
            </details>
          ) : (
            <section key={s.heading} id={slugify(s.heading)} className="scroll-mt-20">
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
          )
        )}
      </article>

      {quiz && (
        <div className="mt-16 rounded-lg border border-border bg-surface p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Knowledge check</p>
          <Link
            href={`/standards/${slug}/quiz`}
            className="mt-2 block text-lg font-semibold hover:text-accent"
          >
            Test what you just learned →
          </Link>
          <p className="mt-1 text-sm text-muted">
            {quiz.questions.length} quick questions, with an explanation for every answer.
          </p>
        </div>
      )}

      {next && (
        <div className="mt-16 rounded-lg border border-border bg-surface p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Up next</p>
          <Link
            href={`/standards/${next.slug}`}
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
