import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getUseCase } from "@/lib/usecases";
import { getUseCaseQuiz, useCaseQuizzes } from "@/lib/usecase-quiz";
import QuizRunner from "@/components/QuizRunner";

export async function generateStaticParams() {
  return useCaseQuizzes.map((q) => ({ slug: q.useCaseSlug }));
}

export async function generateMetadata(props: PageProps<"/use-cases/[slug]/quiz">): Promise<Metadata> {
  const { slug } = await props.params;
  const useCase = getUseCase(slug);
  if (!useCase) return {};
  return {
    title: `Knowledge check: ${useCase.title} — Classical Crypto Today`,
    description: `A short quiz testing what you learned in ${useCase.title}.`,
  };
}

export default async function UseCaseQuizPage(props: PageProps<"/use-cases/[slug]/quiz">) {
  const { slug } = await props.params;
  const useCase = getUseCase(slug);
  const quiz = getUseCaseQuiz(slug);
  if (!useCase || !quiz) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href={`/use-cases/${slug}`} className="text-sm text-muted hover:text-foreground">
        ← Back to the use case
      </Link>

      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-accent">Knowledge check</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{useCase.title}</h1>
      <p className="mt-4 text-lg text-muted">
        {quiz.questions.length} questions testing what you just read — no login, no tracking, just
        immediate feedback.
      </p>

      <QuizRunner
        questions={quiz.questions}
        moduleSlug={slug}
        moduleTitle={useCase.title}
        basePath="/use-cases"
      />
    </div>
  );
}
