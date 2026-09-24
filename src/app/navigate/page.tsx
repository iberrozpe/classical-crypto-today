import type { Metadata } from "next";
import { buildGraph } from "@/lib/graph";
import NavigateGraph from "@/components/NavigateGraph";

export const metadata: Metadata = {
  title: "Navigate — Classical Crypto Today",
  description: "Every Learn module and Playground tool, mapped as a graph you can explore.",
};

export default function NavigatePage() {
  const { nodes, links } = buildGraph();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Navigate</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        The whole catalog, as a map
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Every category, Learn module, and Playground tool on this site, laid out by how they
        connect. Click a node for a quick summary and a link straight in — drag the canvas to
        pan, scroll to zoom, or drag a node to reposition it.
      </p>

      <NavigateGraph nodes={nodes} links={links} />
    </div>
  );
}
