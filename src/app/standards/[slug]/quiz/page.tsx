import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStandardsBody } from "@/lib/standards";
import { getStandardsQuiz, standardsQuizzes } from "@/lib/standards-quiz";
import QuizRunner from "@/components/QuizRunner";

export async function generateStaticParams() {
  return standardsQuizzes.map((q) => ({ slug: q.bodySlug }));
}

export async function generateMetadata(props: PageProps<"/standards/[slug]/quiz">): Promise<Metadata> {
  const { slug } = await props.params;
  const body = getStandardsBody(slug);
  if (!body) return {};
  return {
    title: `Knowledge check: ${body.title} — Classical Crypto Today`,
    description: `A short quiz testing what you learned in ${body.title}.`,
  };
}

export default async function StandardsQuizPage(props: PageProps<"/standards/[slug]/quiz">) {
  const { slug } = await props.params;
  const body = getStandardsBody(slug);
  const quiz = getStandardsQuiz(slug);
  if (!body || !quiz) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href={`/standards/${slug}`} className="text-sm text-muted hover:text-foreground">
        ← Back to the standards body
      </Link>

      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-accent">Knowledge check</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{body.title}</h1>
      <p className="mt-4 text-lg text-muted">
        {quiz.questions.length} questions testing what you just read — no login, no tracking, just
        immediate feedback.
      </p>

      <QuizRunner
        questions={quiz.questions}
        moduleSlug={slug}
        moduleTitle={body.title}
        basePath="/standards"
      />
    </div>
  );
}
