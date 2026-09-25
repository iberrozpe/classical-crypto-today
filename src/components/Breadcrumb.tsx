"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getModule } from "@/lib/content";
import { getPlaygroundTool } from "@/lib/playground";
import { getUseCase } from "@/lib/usecases";
import { getChallenge } from "@/lib/challenges";
import { getStandardsBody } from "@/lib/standards";

const STATIC_LABELS: Record<string, string> = {
  explore: "Explore",
  learn: "Learn",
  "use-cases": "Use Cases",
  playground: "Playground",
  challenges: "Challenges",
  standards: "Standards",
  compare: "Compare",
  glossary: "Glossary",
  "migration-checklist": "Checklist",
  quizzes: "Quizzes",
  assess: "Assess",
  navigate: "Navigate",
  references: "References",
  about: "About",
  changelog: "Changelog",
  quiz: "Knowledge check",
  "how-it-works": "How it works",
};

interface Crumb {
  label: string;
  href: string;
}

export default function Breadcrumb() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [];
  let href = "";

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    href += `/${seg}`;
    const prev = segments[i - 1];

    let label = STATIC_LABELS[seg];
    if (!label && prev === "learn") {
      label = getModule(seg)?.title ?? seg;
    } else if (!label && prev === "playground") {
      label = getPlaygroundTool(seg)?.title ?? seg;
    } else if (!label && prev === "use-cases") {
      label = getUseCase(seg)?.title ?? seg;
    } else if (!label && prev === "challenges") {
      label = getChallenge(seg)?.title ?? seg;
    } else if (!label && prev === "standards") {
      label = getStandardsBody(seg)?.title ?? seg;
    } else if (!label) {
      label = seg;
    }

    crumbs.push({ label, href });
  }

  return (
    <nav aria-label="Breadcrumb" className="border-b border-border px-4 py-2.5 sm:px-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
        <li>
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
        </li>
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1.5">
            <span className="text-border">/</span>
            {i === crumbs.length - 1 ? (
              <span className="font-medium text-foreground">{c.label}</span>
            ) : (
              <Link href={c.href} className="hover:text-foreground">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
