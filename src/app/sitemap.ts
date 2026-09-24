import type { MetadataRoute } from "next";
import { modules } from "@/lib/content";
import { playgroundTools } from "@/lib/playground";
import { quizzes } from "@/lib/quiz";

const siteUrl = "https://classicalcryptotoday.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/explore",
    "/learn",
    "/playground",
    "/compare",
    "/glossary",
    "/migration-checklist",
    "/assess",
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

  const playgroundRoutes = playgroundTools.flatMap((t) => [
    { url: `${siteUrl}/playground/${t.slug}`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${siteUrl}/playground/${t.slug}/how-it-works`, changeFrequency: "monthly" as const, priority: 0.5 },
  ]);

  return [...staticRoutes, ...moduleRoutes, ...quizRoutes, ...playgroundRoutes];
}
