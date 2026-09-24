import { modules } from "./content";
import { playgroundTools } from "./playground";
import { useCases } from "./usecases";

export interface GraphNode {
  id: string;
  label: string;
  type: "category" | "module" | "tool" | "usecase";
  category: string;
  href?: string;
  summary?: string;
  minutes?: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

const CATEGORIES = ["Foundations", "Public-key", "Symmetric-key", "Protocols", "Practice"] as const;

export function buildGraph(): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  for (const cat of CATEGORIES) {
    nodes.push({ id: `category:${cat}`, label: cat, type: "category", category: cat });
  }

  for (const m of modules) {
    nodes.push({
      id: `module:${m.slug}`,
      label: m.title,
      type: "module",
      category: m.category,
      href: `/learn/${m.slug}`,
      summary: m.summary,
      minutes: m.minutes,
    });
    links.push({ source: `category:${m.category}`, target: `module:${m.slug}` });
  }

  for (const t of playgroundTools) {
    nodes.push({
      id: `tool:${t.slug}`,
      label: t.title,
      type: "tool",
      category: t.category,
      href: `/playground/${t.slug}`,
      summary: t.summary,
    });
    if (t.relatedModule) {
      links.push({ source: `module:${t.relatedModule}`, target: `tool:${t.slug}` });
    }
  }

  for (const u of useCases) {
    nodes.push({
      id: `usecase:${u.slug}`,
      label: u.title,
      type: "usecase",
      category: "Use Cases",
      href: `/use-cases/${u.slug}`,
      summary: u.summary,
      minutes: u.minutes,
    });
    for (const relatedSlug of u.relatedModules) {
      links.push({ source: `module:${relatedSlug}`, target: `usecase:${u.slug}` });
    }
  }

  return { nodes, links };
}
