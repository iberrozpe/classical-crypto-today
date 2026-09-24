import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getModule } from "@/lib/content";
import { getQuiz, quizzes } from "@/lib/quiz";
import QuizRunner from "@/components/QuizRunner";

export async function generateStaticParams() {
  return quizzes.map((q) => ({ slug: q.moduleSlug }));
}

export async function generateMetadata(props: PageProps<"/learn/[slug]/quiz">): Promise<Metadata> {
  const { slug } = await props.params;
  const mod = getModule(slug);
  if (!mod) return {};
  return {
    title: `Knowledge check: ${mod.title} — Classical Crypto Today`,
    description: `A short quiz testing what you learned in ${mod.title}.`,
  };
}

export default async function ModuleQuizPage(props: PageProps<"/learn/[slug]/quiz">) {
  const { slug } = await props.params;
  const mod = getModule(slug);
  const quiz = getQuiz(slug);
  if (!mod || !quiz) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href={`/learn/${slug}`} className="text-sm text-muted hover:text-foreground">
        ← Back to the module
      </Link>

      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-accent">Knowledge check</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{mod.title}</h1>
      <p className="mt-4 text-lg text-muted">
        {quiz.questions.length} questions testing what you just read — no login, no tracking, just
        immediate feedback.
      </p>

      <QuizRunner questions={quiz.questions} moduleSlug={slug} moduleTitle={mod.title} />
    </div>
  );
}
