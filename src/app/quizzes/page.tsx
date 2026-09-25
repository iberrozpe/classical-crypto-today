import Link from "next/link";
import type { Metadata } from "next";
import { modules } from "@/lib/content";
import { getQuiz } from "@/lib/quiz";
import { useCases } from "@/lib/usecases";
import { getUseCaseQuiz } from "@/lib/usecase-quiz";

export const metadata: Metadata = {
  title: "Quizzes — Classical Crypto Today",
  description: "Every knowledge-check quiz on the site, in one place — one per Learn module and Use Case.",
};

export default function QuizzesPage() {
  const moduleQuizzes = modules
    .map((m) => ({ module: m, quiz: getQuiz(m.slug) }))
    .filter((mq) => mq.quiz !== undefined);
  const useCaseQuizzes = useCases
    .map((u) => ({ useCase: u, quiz: getUseCaseQuiz(u.slug) }))
    .filter((uq) => uq.quiz !== undefined);

  const totalQuestions =
    moduleQuizzes.reduce((sum, mq) => sum + mq.quiz!.questions.length, 0) +
    useCaseQuizzes.reduce((sum, uq) => sum + uq.quiz!.questions.length, 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Quizzes</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Every knowledge check, in one place
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        {moduleQuizzes.length + useCaseQuizzes.length} quizzes, {totalQuestions} questions total —
        one for every Learn module and Use Case, each with an explanation for every answer. No
        login, no tracking, just immediate feedback.
      </p>

      <div className="mt-12 space-y-12">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Learn modules</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {moduleQuizzes.map(({ module: m, quiz }) => (
              <Link
                key={m.slug}
                href={`/learn/${m.slug}/quiz`}
                className="flex flex-col rounded-lg border border-border bg-surface p-5 transition hover:border-accent hover:bg-surface-hover"
              >
                <span className="font-semibold">{m.title}</span>
                <p className="mt-2 flex-1 text-sm text-muted">{m.summary}</p>
                <span className="mt-3 text-xs font-medium text-muted">
                  {quiz!.questions.length} questions
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">Use Cases</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {useCaseQuizzes.map(({ useCase: u, quiz }) => (
              <Link
                key={u.slug}
                href={`/use-cases/${u.slug}/quiz`}
                className="flex flex-col rounded-lg border border-border bg-surface p-5 transition hover:border-accent hover:bg-surface-hover"
              >
                <span className="font-semibold">{u.title}</span>
                <p className="mt-2 flex-1 text-sm text-muted">{u.summary}</p>
                <span className="mt-3 text-xs font-medium text-muted">
                  {quiz!.questions.length} questions
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
