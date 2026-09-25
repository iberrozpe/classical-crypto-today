import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { challenges, getChallenge } from "@/lib/challenges";
import { getModule } from "@/lib/content";
import { OutputBox } from "@/components/playground/ui";
import ChallengeSolver from "@/components/ChallengeSolver";

export async function generateStaticParams() {
  return challenges.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/challenges/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const challenge = getChallenge(slug);
  if (!challenge) return {};
  return {
    title: `${challenge.title} — Classical Crypto Today`,
    description: challenge.summary,
  };
}

const difficultyColor: Record<string, string> = {
  easy: "text-accent",
  medium: "text-muted",
  hard: "text-red-400",
};

export default async function ChallengePage(props: PageProps<"/challenges/[slug]">) {
  const { slug } = await props.params;
  const challenge = getChallenge(slug);
  if (!challenge) notFound();

  const currentIndex = challenges.findIndex((c) => c.slug === slug);
  const next = challenges[currentIndex + 1];
  const relatedModules = (challenge.relatedModules ?? [])
    .map((s) => getModule(s))
    .filter((m) => m !== undefined);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/challenges" className="text-sm text-muted hover:text-foreground">
        ← All challenges
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide">
        <span className="text-accent">{challenge.category}</span>
        <span className="text-muted">·</span>
        <span className={difficultyColor[challenge.difficulty]}>{challenge.difficulty}</span>
        <span className="text-muted">·</span>
        <span className="text-muted">{challenge.points} pts</span>
      </div>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{challenge.title}</h1>
      <p className="mt-4 text-lg text-muted">{challenge.summary}</p>

      <div className="mt-10 space-y-4">
        {challenge.prompt.map((p, i) => (
          <p key={i} className="leading-relaxed text-foreground">
            {p}
          </p>
        ))}
      </div>

      {challenge.data && challenge.data.length > 0 && (
        <div className="mt-6 space-y-3">
          {challenge.data.map((d, i) => (
            <OutputBox key={i} label={d.label} value={d.value} />
          ))}
        </div>
      )}

      <ChallengeSolver challenge={challenge} />

      {relatedModules.length > 0 && (
        <div className="mt-10 rounded-lg border border-border bg-surface p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Background on this technique
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

      {next && (
        <div className="mt-16 rounded-lg border border-border bg-surface p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Up next</p>
          <Link
            href={`/challenges/${next.slug}`}
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
