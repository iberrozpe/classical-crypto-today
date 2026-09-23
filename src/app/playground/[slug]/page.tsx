import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPlaygroundTool, playgroundTools } from "@/lib/playground";
import { getModule } from "@/lib/content";
import ToolRenderer from "@/components/playground/ToolRenderer";

export async function generateStaticParams() {
  return playgroundTools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props: PageProps<"/playground/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const tool = getPlaygroundTool(slug);
  if (!tool) return {};
  return {
    title: `${tool.title} — Classical Crypto Today`,
    description: tool.summary,
  };
}

export default async function PlaygroundToolPage(props: PageProps<"/playground/[slug]">) {
  const { slug } = await props.params;
  const tool = getPlaygroundTool(slug);
  if (!tool) notFound();

  const related = tool.relatedModule ? getModule(tool.relatedModule) : undefined;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/playground" className="text-sm text-muted hover:text-foreground">
        ← All tools
      </Link>

      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-accent">{tool.category}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{tool.title}</h1>
      <p className="mt-4 text-lg text-muted">{tool.summary}</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/playground/${slug}/how-it-works`}
          className="text-sm font-medium text-accent underline underline-offset-4"
        >
          What&apos;s happening under the hood →
        </Link>
        {related && (
          <>
            <span className="text-sm text-muted">·</span>
            <Link
              href={`/learn/${related.slug}`}
              className="text-sm font-medium text-accent underline underline-offset-4"
            >
              Read the {related.title} module for the full explanation →
            </Link>
          </>
        )}
      </div>

      <div className="mt-10">
        <ToolRenderer slug={slug} />
      </div>
    </div>
  );
}
