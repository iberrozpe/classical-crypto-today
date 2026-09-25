"use client";

import Link from "next/link";
import { categoryOrder, challenges } from "@/lib/challenges";
import { useChallengeProgress } from "@/lib/challengeProgress";

const difficultyColor: Record<string, string> = {
  easy: "text-accent",
  medium: "text-muted",
  hard: "text-red-400",
};

export default function ChallengesOverview() {
  const { solved } = useChallengeProgress();
  const totalPoints = challenges.reduce((sum, c) => sum + c.points, 0);
  const earnedPoints = challenges
    .filter((c) => solved.has(c.slug))
    .reduce((sum, c) => sum + c.points, 0);

  return (
    <div>
      <div className="mt-8 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-surface p-4">
        <span className="text-sm font-medium text-foreground">
          {solved.size} / {challenges.length} solved
        </span>
        <span className="text-muted">·</span>
        <span className="text-sm font-medium text-foreground">
          {earnedPoints} / {totalPoints} points
        </span>
        <span className="ml-auto text-xs text-muted">Progress is saved only in this browser</span>
      </div>

      <div className="mt-12 space-y-12">
        {categoryOrder.map((category) => {
          const inCategory = challenges.filter((c) => c.category === category);
          if (inCategory.length === 0) return null;
          return (
            <div key={category}>
              <h2 className="text-lg font-semibold text-foreground">{category}</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {inCategory.map((c) => {
                  const isSolved = solved.has(c.slug);
                  return (
                    <Link
                      key={c.slug}
                      href={`/challenges/${c.slug}`}
                      className={`flex flex-col rounded-lg border p-5 transition hover:border-accent hover:bg-surface-hover ${
                        isSolved ? "border-accent/50 bg-accent-soft/30" : "border-border bg-surface"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{c.title}</span>
                        {isSolved && <span className="shrink-0 text-accent">✓</span>}
                      </div>
                      <p className="mt-2 flex-1 text-sm text-muted">{c.summary}</p>
                      <div className="mt-3 flex items-center gap-3 text-xs font-medium">
                        <span className={difficultyColor[c.difficulty]}>{c.difficulty}</span>
                        <span className="text-muted">·</span>
                        <span className="text-muted">{c.points} pts</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
