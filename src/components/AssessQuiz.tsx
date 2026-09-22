"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { assessQuestions } from "@/lib/assess";
import { getModule } from "@/lib/content";

type Answers = Record<string, boolean>;

export default function AssessQuiz() {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === assessQuestions.length;

  const results = useMemo(() => {
    if (!submitted) return null;

    const slugCounts = new Map<string, number>();
    for (const q of assessQuestions) {
      if (!answers[q.id]) continue;
      for (const slug of q.moduleSlugs) {
        slugCounts.set(slug, (slugCounts.get(slug) ?? 0) + 1);
      }
    }

    const recommended = [...slugCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([slug]) => getModule(slug))
      .filter((m): m is NonNullable<typeof m> => Boolean(m));

    const yesCount = Object.values(answers).filter(Boolean).length;
    const longLivedRisk = Boolean(answers["longlived"]) || Boolean(answers["https"]);
    const customCryptoRisk = Boolean(answers["custom-crypto"]);

    return { recommended, yesCount, longLivedRisk, customCryptoRisk };
  }, [submitted, answers]);

  function setAnswer(id: string, value: boolean) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setSubmitted(false);
  }

  if (submitted && results) {
    return (
      <div className="mt-10">
        <div className="rounded-lg border border-accent bg-accent-soft p-6">
          <h2 className="text-lg font-semibold text-foreground">Your rough footprint</h2>
          <p className="mt-2 text-sm text-muted">
            Based on {results.yesCount} of {assessQuestions.length} answers, here&apos;s where to
            start. This is an educational starting point, not a compliance audit.
          </p>
          {results.longLivedRisk && (
            <p className="mt-3 text-sm text-foreground">
              ⚠️ You flagged public HTTPS traffic and/or long-lived confidential data — that&apos;s
              exactly the &ldquo;harvest now, decrypt later&rdquo; risk profile. Worth reading
              that module first.
            </p>
          )}
          {results.customCryptoRisk && (
            <p className="mt-2 text-sm text-foreground">
              ⚠️ Custom cryptographic code is where most real-world vulnerabilities in this space
              actually happen — padding, randomness, and timing are covered in your list below.
            </p>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Recommended modules, in priority order
          </h3>
          {results.recommended.length === 0 ? (
            <p className="mt-3 text-muted">
              No specific matches — browse the full catalog instead.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {results.recommended.map((m) => (
                <Link
                  key={m.slug}
                  href={`/learn/${m.slug}`}
                  className="rounded-lg border border-border bg-surface p-4 transition hover:border-accent hover:bg-surface-hover"
                >
                  <span className="font-semibold">{m.title}</span>
                  <p className="mt-1 text-sm text-muted">{m.summary}</p>
                  <span className="mt-2 block text-xs text-muted">{m.minutes} min</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => {
            setSubmitted(false);
            setAnswers({});
          }}
          className="mt-8 text-sm font-medium text-muted underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-accent"
        >
          Start over →
        </button>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="space-y-4">
        {assessQuestions.map((q) => (
          <fieldset
            key={q.id}
            className="rounded-lg border border-border bg-surface p-5"
          >
            <legend className="sr-only">{q.question}</legend>
            <p className="font-medium text-foreground">{q.question}</p>
            {q.helper && <p className="mt-1 text-sm text-muted">{q.helper}</p>}
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setAnswer(q.id, true)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  answers[q.id] === true
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setAnswer(q.id, false)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  answers[q.id] === false
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                No
              </button>
            </div>
          </fieldset>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          type="button"
          disabled={!allAnswered}
          onClick={() => setSubmitted(true)}
          className="rounded-full border border-accent bg-accent-soft px-6 py-2 text-sm font-semibold text-accent transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          See my results →
        </button>
        <span className="text-sm text-muted">
          {answeredCount} / {assessQuestions.length} answered
        </span>
      </div>
    </div>
  );
}
