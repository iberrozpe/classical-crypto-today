"use client";

import { useState } from "react";
import type { Challenge } from "@/lib/challenges";
import { useChallengeProgress } from "@/lib/challengeProgress";

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export default function ChallengeSolver({ challenge }: { challenge: Challenge }) {
  const { solved, markSolved } = useChallengeProgress();
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);

  const isSolved = solved.has(challenge.slug);

  function submit() {
    if (!value.trim()) return;
    if (normalize(value) === normalize(challenge.flag)) {
      setWrong(false);
      markSolved(challenge.slug);
    } else {
      setWrong(true);
    }
  }

  return (
    <div className="mt-8 space-y-4">
      {challenge.hints && challenge.hints.length > 0 && !isSolved && (
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Hints</p>
          <div className="mt-2 space-y-2">
            {challenge.hints.slice(0, revealedHints).map((h, i) => (
              <p key={i} className="text-sm leading-relaxed text-muted">
                {i + 1}. {h}
              </p>
            ))}
          </div>
          {revealedHints < challenge.hints.length && (
            <button
              type="button"
              onClick={() => setRevealedHints((n) => n + 1)}
              className="mt-2 text-xs font-medium text-accent underline underline-offset-4"
            >
              Reveal hint {revealedHints + 1} of {challenge.hints.length}
            </button>
          )}
        </div>
      )}

      {isSolved ? (
        <div className="rounded-lg border border-accent bg-accent-soft p-5">
          <p className="font-semibold text-accent">Solved — {challenge.points} points</p>
          <p className="mt-1 font-mono text-sm text-foreground">{challenge.flag}</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface p-5">
          <label htmlFor="flag-input" className="text-xs font-semibold uppercase tracking-wide text-muted">
            Submit flag
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input
              id="flag-input"
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setWrong(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="cct{...}"
              className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={submit}
              disabled={!value.trim()}
              className="rounded-full border border-accent bg-accent-soft px-4 py-2 text-sm font-semibold text-accent transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              Submit
            </button>
          </div>
          {wrong && (
            <p className="mt-2 text-sm text-red-400">Not quite — keep trying, or reveal another hint.</p>
          )}
          <p className="mt-3 text-xs text-muted">
            Checked entirely in your browser — nothing you submit here leaves your device.
          </p>
        </div>
      )}

      {isSolved && (
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">How it works</p>
          <div className="mt-2 space-y-3">
            {challenge.explanation.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
