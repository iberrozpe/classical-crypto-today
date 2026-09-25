import type { MetadataRoute } from "next";
import { modules } from "@/lib/content";
import { playgroundTools } from "@/lib/playground";
import { quizzes } from "@/lib/quiz";
import { useCases } from "@/lib/usecases";
import { useCaseQuizzes } from "@/lib/usecase-quiz";
import { challenges } from "@/lib/challenges";
import { standardsBodies } from "@/lib/standards";
import { standardsQuizzes } from "@/lib/standards-quiz";

const siteUrl = "https://classicalcryptotoday.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/explore",
    "/navigate",
    "/learn",
    "/use-cases",
    "/standards",
    "/playground",
    "/challenges",
    "/quizzes",
    "/compare",
    "/glossary",
    "/references",
    "/migration-checklist",
    "/assess",
    "/about",
    "/changelog",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const moduleRoutes = modules.map((m) => ({
    url: `${siteUrl}/learn/${m.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const quizRoutes = quizzes.map((q) => ({
    url: `${siteUrl}/learn/${q.moduleSlug}/quiz`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const useCaseRoutes = useCases.map((u) => ({
    url: `${siteUrl}/use-cases/${u.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const useCaseQuizRoutes = useCaseQuizzes.map((q) => ({
    url: `${siteUrl}/use-cases/${q.useCaseSlug}/quiz`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const challengeRoutes = challenges.map((c) => ({
    url: `${siteUrl}/challenges/${c.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const playgroundRoutes = playgroundTools.flatMap((t) => [
    { url: `${siteUrl}/playground/${t.slug}`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${siteUrl}/playground/${t.slug}/how-it-works`, changeFrequency: "monthly" as const, priority: 0.5 },
  ]);

  const standardsRoutes = standardsBodies.map((s) => ({
    url: `${siteUrl}/standards/${s.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const standardsQuizRoutes = standardsQuizzes.map((q) => ({
    url: `${siteUrl}/standards/${q.bodySlug}/quiz`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...moduleRoutes,
    ...quizRoutes,
    ...useCaseRoutes,
    ...useCaseQuizRoutes,
    ...challengeRoutes,
    ...playgroundRoutes,
    ...standardsRoutes,
    ...standardsQuizRoutes,
  ];
}
