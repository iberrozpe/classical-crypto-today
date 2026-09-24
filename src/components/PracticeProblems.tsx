"use client";

import { useState } from "react";
import type { PracticeProblem } from "@/lib/content";

function normalize(s: string): string {
  // Strips all whitespace and parens, and a leading "0x", so equivalent
  // answers like "0, 6" / "(0,6)" / "0x1b" / "1B" all compare equal.
  return s
    .trim()
    .toLowerCase()
    .replace(/^0x/, "")
    .replace(/[()\s]/g, "");
}

function Problem({ problem, index }: { problem: PracticeProblem; index: number }) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isCorrect = checked && normalize(value) === normalize(problem.answer);

  function check() {
    if (!value.trim()) return;
    setChecked(true);
  }

  function reset() {
    setValue("");
    setChecked(false);
  }

  return (
    <div className="rounded-lg border border-accent/30 bg-accent-soft/40 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        Practice {index > 1 ? `#${index}` : ""}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground">{problem.prompt}</p>

      {problem.hint && !checked && (
        <button
          type="button"
          onClick={() => setShowHint((s) => !s)}
          className="mt-2 text-xs font-medium text-accent underline underline-offset-4"
        >
          {showHint ? "Hide hint" : "Show hint"}
        </button>
      )}
      {problem.hint && showHint && !checked && (
        <p className="mt-2 text-xs text-muted">{problem.hint}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder={problem.placeholder ?? "Your answer"}
          disabled={checked}
          className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-60"
        />
        {!checked ? (
          <button
            type="button"
            onClick={check}
            disabled={!value.trim()}
            className="rounded-full border border-accent bg-accent-soft px-4 py-1.5 text-sm font-medium text-accent transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check
          </button>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="text-sm font-medium text-muted underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-accent"
          >
            Try again
          </button>
        )}
      </div>

      {checked && (
        <div className={`mt-3 rounded-md border p-3 text-sm ${isCorrect ? "border-accent text-accent" : "border-red-500/50 text-red-400"}`}>
          <p className="font-medium">
            {isCorrect ? "Correct." : `Not quite — the answer is ${problem.answer}.`}
          </p>
          <p className="mt-1 text-muted">{problem.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default function PracticeProblems({ problems }: { problems: PracticeProblem[] }) {
  return (
    <div className="not-prose mt-4 space-y-3">
      {problems.map((p, i) => (
        <Problem key={i} problem={p} index={i + 1} />
      ))}
    </div>
  );
}
