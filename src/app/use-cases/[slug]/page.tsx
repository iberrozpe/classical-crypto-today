import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getUseCase, useCases } from "@/lib/usecases";
import { getModule, roleLabels } from "@/lib/content";
import { playgroundTools } from "@/lib/playground";
import { getUseCaseQuiz } from "@/lib/usecase-quiz";
import { slugify } from "@/lib/slugify";
import Math from "@/components/Math";
import DiagramRenderer from "@/components/diagrams/DiagramRenderer";
import PracticeProblems from "@/components/PracticeProblems";
import DeepLinkDetails from "@/components/DeepLinkDetails";

export async function generateStaticParams() {
  return useCases.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata(props: PageProps<"/use-cases/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const useCase = getUseCase(slug);
  if (!useCase) return {};
  return {
    title: `${useCase.title} — Classical Crypto Today`,
    description: useCase.summary,
  };
}

export default async function UseCasePage(props: PageProps<"/use-cases/[slug]">) {
  const { slug } = await props.params;
  const useCase = getUseCase(slug);
  if (!useCase) notFound();

  const currentIndex = useCases.findIndex((u) => u.slug === slug);
  const next = useCases[currentIndex + 1];
  const relatedModules = useCase.relatedModules
    .map((s) => getModule(s))
    .filter((m) => m !== undefined);
  const relatedTools = playgroundTools.filter((t) => t.relatedUseCases?.includes(slug));
  const quiz = getUseCaseQuiz(slug);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <DeepLinkDetails />
      <Link href="/use-cases" className="text-sm text-muted hover:text-foreground">
        ← All use cases
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide text-accent">
        <span>{useCase.category}</span>
        <span className="text-muted">·</span>
        <span className="text-muted">{useCase.minutes} min</span>
      </div>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{useCase.title}</h1>
      <p className="mt-4 text-lg text-muted">{useCase.summary}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {useCase.tags.map((t) => (
          <span key={t} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
            {roleLabels[t]}
          </span>
        ))}
      </div>

      {relatedModules.length > 0 && (
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
          </div>
        </div>
      )}

      <article className="mt-12 space-y-10">
        {useCase.sections.map((s) =>
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
            href={`/use-cases/${slug}/quiz`}
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
            href={`/use-cases/${next.slug}`}
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
