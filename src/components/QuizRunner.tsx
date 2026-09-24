"use client";

import { useState } from "react";
import Link from "next/link";
import type { QuizQuestion } from "@/lib/quiz";

export default function QuizRunner({
  questions,
  moduleSlug,
  moduleTitle,
  basePath = "/learn",
}: {
  questions: QuizQuestion[];
  moduleSlug: string;
  moduleTitle: string;
  basePath?: string;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = Object.keys(answers).length === questions.length;
  const correctCount = questions.reduce(
    (n, q, i) => (answers[i] === q.correctIndex ? n + 1 : n),
    0,
  );

  function choose(qIndex: number, optIndex: number) {
    if (revealed[qIndex]) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
    setRevealed((prev) => ({ ...prev, [qIndex]: true }));
  }

  function retake() {
    setAnswers({});
    setRevealed({});
    setSubmitted(false);
  }

  return (
    <div className="mt-10">
      <div className="space-y-6">
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          const isRevealed = revealed[qi];
          return (
            <fieldset key={qi} className="rounded-lg border border-border bg-surface p-5">
              <legend className="px-1 text-xs font-semibold text-muted">
                Question {qi + 1} of {questions.length}
              </legend>
              <p className="font-medium text-foreground">{q.question}</p>
              <div className="mt-3 space-y-2">
                {q.options.map((opt, oi) => {
                  const isCorrect = oi === q.correctIndex;
                  const isChosen = oi === chosen;
                  let style = "border-border text-muted hover:border-accent/50 hover:text-foreground";
                  if (isRevealed && isCorrect) {
                    style = "border-accent bg-accent-soft text-accent";
                  } else if (isRevealed && isChosen && !isCorrect) {
                    style = "border-red-500/60 bg-red-500/10 text-red-400";
                  }
                  return (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => choose(qi, oi)}
                      disabled={isRevealed}
                      className={`block w-full rounded-md border px-4 py-2.5 text-left text-sm transition disabled:cursor-default ${style}`}
                    >
                      {opt}
                      {isRevealed && isCorrect && " ✓"}
                      {isRevealed && isChosen && !isCorrect && " ✗"}
                    </button>
                  );
                })}
              </div>
              {isRevealed && (
                <p className="mt-3 text-sm leading-relaxed text-muted">{q.explanation}</p>
              )}
            </fieldset>
          );
        })}
      </div>

      {!submitted ? (
        <div className="mt-8 flex items-center gap-4">
          <button
            type="button"
            disabled={!allAnswered}
            onClick={() => setSubmitted(true)}
            className="rounded-full border border-accent bg-accent-soft px-6 py-2 text-sm font-semibold text-accent transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            See my score →
          </button>
          <span className="text-sm text-muted">
            {Object.keys(answers).length} / {questions.length} answered
          </span>
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-accent bg-accent-soft p-6">
          <h2 className="text-lg font-semibold text-foreground">
            {correctCount} / {questions.length} correct
          </h2>
          <p className="mt-2 text-sm text-muted">
            {correctCount === questions.length
              ? `Clean sweep on ${moduleTitle}.`
              : "Review the explanations above, or revisit the module for anything that didn't stick."}
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={retake}
              className="text-sm font-medium text-muted underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-accent"
            >
              Retake →
            </button>
            <Link
              href={`${basePath}/${moduleSlug}`}
              className="text-sm font-medium text-accent underline underline-offset-4"
            >
              Back to the module →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
