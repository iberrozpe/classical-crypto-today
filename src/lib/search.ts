import { modules } from "./content";
import { useCases } from "./usecases";
import { playgroundTools } from "./playground";
import { glossaryTerms } from "./glossary";
import { challenges } from "./challenges";
import { standardsBodies } from "./standards";
import { libraryEntries } from "./library";
import { slugify } from "./slugify";

export type SearchEntryType = "module" | "usecase" | "tool" | "glossary" | "section" | "challenge" | "standard" | "library";

export interface SearchEntry {
  type: SearchEntryType;
  typeLabel: string;
  title: string;
  subtitle: string;
  href: string;
}

function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const m of modules) {
    entries.push({
      type: "module",
      typeLabel: "Learn",
      title: m.title,
      subtitle: m.summary,
      href: `/learn/${m.slug}`,
    });
    for (const s of m.sections) {
      entries.push({
        type: "section",
        typeLabel: "Learn",
        title: s.heading,
        subtitle: m.title,
        href: `/learn/${m.slug}#${slugify(s.heading)}`,
      });
    }
  }

  for (const u of useCases) {
    entries.push({
      type: "usecase",
      typeLabel: "Use Case",
      title: u.title,
      subtitle: u.summary,
      href: `/use-cases/${u.slug}`,
    });
    for (const s of u.sections) {
      entries.push({
        type: "section",
        typeLabel: "Use Case",
        title: s.heading,
        subtitle: u.title,
        href: `/use-cases/${u.slug}#${slugify(s.heading)}`,
      });
    }
  }

  for (const t of playgroundTools) {
    entries.push({
      type: "tool",
      typeLabel: "Playground",
      title: t.title,
      subtitle: t.summary,
      href: `/playground/${t.slug}`,
    });
  }

  for (const c of challenges) {
    entries.push({
      type: "challenge",
      typeLabel: "Challenge",
      title: c.title,
      subtitle: c.summary,
      href: `/challenges/${c.slug}`,
    });
  }

  for (const s of standardsBodies) {
    entries.push({
      type: "standard",
      typeLabel: "Standards",
      title: s.title,
      subtitle: s.summary,
      href: `/standards/${s.slug}`,
    });
    for (const sec of s.sections) {
      entries.push({
        type: "section",
        typeLabel: "Standards",
        title: sec.heading,
        subtitle: s.title,
        href: `/standards/${s.slug}#${slugify(sec.heading)}`,
      });
    }
  }

  for (const e of libraryEntries) {
    entries.push({
      type: "library",
      typeLabel: "Library",
      title: e.title,
      subtitle: e.publisher,
      href: `/library#${slugify(e.title)}`,
    });
  }

  for (const g of glossaryTerms) {
    entries.push({
      type: "glossary",
      typeLabel: "Glossary",
      title: g.term,
      subtitle: g.definition,
      href: `/glossary#${slugify(g.term)}`,
    });
  }

  return entries;
}

export const searchIndex: SearchEntry[] = buildIndex();

function scoreMatch(query: string, text: string): number {
  const t = text.toLowerCase();
  if (t === query) return 100;
  if (t.startsWith(query)) return 80;
  const idx = t.indexOf(query);
  if (idx !== -1) return 60 - Math.min(idx, 25);
  const words = query.split(/\s+/).filter(Boolean);
  if (words.length > 1 && words.every((w) => t.includes(w))) return 30;
  return 0;
}

export function search(query: string, limit = 20): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of searchIndex) {
    const titleScore = scoreMatch(q, entry.title);
    const subtitleScore = scoreMatch(q, entry.subtitle) * 0.4;
    const score = Math.max(titleScore, subtitleScore);
    if (score > 0) scored.push({ entry, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((r) => r.entry);
}
