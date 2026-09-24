import { modules } from "./content";
import { playgroundTools } from "./playground";

export interface GraphNode {
  id: string;
  label: string;
  type: "category" | "module" | "tool";
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

  return { nodes, links };
}
