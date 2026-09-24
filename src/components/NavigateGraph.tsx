"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from "d3-force";
import type { GraphNode, GraphLink } from "@/lib/graph";

type SimNode = GraphNode & SimulationNodeDatum;
type SimLink = SimulationLinkDatum<SimNode>;

const CATEGORY_COLORS: Record<string, string> = {
  Foundations: "#35e0c8",
  "Public-key": "#a78bfa",
  "Symmetric-key": "#f0b429",
  Protocols: "#38bdf8",
  Practice: "#fb7185",
  "Use Cases": "#4ade80",
};

const WIDTH = 900;
const HEIGHT = 640;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;
const CLICK_THRESHOLD = 5;

function radiusFor(type: GraphNode["type"]) {
  if (type === "category") return 16;
  if (type === "module") return 9;
  if (type === "usecase") return 8;
  return 6;
}

function typeLabel(type: GraphNode["type"]) {
  if (type === "module") return "Learn module";
  if (type === "usecase") return "Use case";
  return "Playground tool";
}

export default function NavigateGraph({
  nodes: rawNodes,
  links: rawLinks,
}: {
  nodes: GraphNode[];
  links: GraphLink[];
}) {
  const [nodes, setNodes] = useState<SimNode[]>([]);
  const [links, setLinks] = useState<{ source: SimNode; target: SimNode }[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const svgRef = useRef<SVGSVGElement>(null);

  const drag = useRef<{ id: string; moved: boolean; startX: number; startY: number } | null>(null);
  const pan = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    const simNodes: SimNode[] = rawNodes.map((n) => ({ ...n }));
    const simLinks: SimLink[] = rawLinks.map((l) => ({ ...l }));

    const sim = forceSimulation(simNodes)
      .force(
        "link",
        forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance((l) => {
            const s = l.source as SimNode;
            const t = l.target as SimNode;
            return s.type === "category" || t.type === "category" ? 140 : 55;
          })
          .strength(0.5),
      )
      .force("charge", forceManyBody().strength(-200))
      .force("center", forceCenter(WIDTH / 2, HEIGHT / 2))
      .force(
        "collide",
        forceCollide<SimNode>((d) => radiusFor(d.type) + 16),
      )
      .stop();

    for (let i = 0; i < 350; i++) sim.tick();

    // One-time layout computed by an external physics engine (d3-force), not
    // derived from render state — there's no way to compute node positions
    // during render itself.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNodes(simNodes);
    setLinks(simLinks as unknown as { source: SimNode; target: SimNode }[]);
  }, [rawNodes, rawLinks]);

  const selected = useMemo(() => nodes.find((n) => n.id === selectedId) ?? null, [nodes, selectedId]);

  const connectedIds = useMemo(() => {
    const focusId = hoverId ?? selectedId;
    if (!focusId) return null;
    const set = new Set<string>([focusId]);
    for (const l of links) {
      if (l.source.id === focusId) set.add(l.target.id);
      if (l.target.id === focusId) set.add(l.source.id);
    }
    return set;
  }, [links, hoverId, selectedId]);

  function clientToWorld(clientX: number, clientY: number) {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * WIDTH;
    const py = ((clientY - rect.top) / rect.height) * HEIGHT;
    return { x: (px - transform.x) / transform.k, y: (py - transform.y) / transform.k };
  }

  function onNodePointerDown(e: React.PointerEvent, id: string) {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = { id, moved: false, startX: e.clientX, startY: e.clientY };
  }

  function onNodePointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    if (Math.hypot(dx, dy) > CLICK_THRESHOLD) drag.current.moved = true;
    if (!drag.current.moved) return;

    const world = clientToWorld(e.clientX, e.clientY);
    setNodes((prev) =>
      prev.map((n) => (n.id === drag.current!.id ? { ...n, x: world.x, y: world.y, fx: world.x, fy: world.y } : n)),
    );
  }

  function onNodePointerUp(e: React.PointerEvent, node: SimNode) {
    const wasDrag = drag.current?.moved;
    drag.current = null;
    if (!wasDrag) {
      setSelectedId((prev) => (prev === node.id ? null : node.id));
    }
  }

  function onBackgroundPointerDown(e: React.PointerEvent) {
    pan.current = { startX: e.clientX, startY: e.clientY, origX: transform.x, origY: transform.y, moved: false };
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function onBackgroundPointerMove(e: React.PointerEvent) {
    if (!pan.current) return;
    const dx = e.clientX - pan.current.startX;
    const dy = e.clientY - pan.current.startY;
    if (Math.hypot(dx, dy) > CLICK_THRESHOLD) pan.current.moved = true;
    if (!pan.current.moved) return;
    setTransform((t) => ({ ...t, x: pan.current!.origX + dx, y: pan.current!.origY + dy }));
  }

  function onBackgroundPointerUp() {
    if (pan.current && !pan.current.moved) setSelectedId(null);
    pan.current = null;
  }

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    // React's synthetic onWheel handler is attached as a passive listener,
    // so preventDefault() inside it silently fails — a native listener is
    // required to actually stop the page from scrolling while zooming.
    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      setTransform((t) => {
        const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, t.k - e.deltaY * 0.0015));
        return { ...t, k: next };
      });
    }
    svg.addEventListener("wheel", handleWheel, { passive: false });
    return () => svg.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <span key={cat} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
            {cat}
          </span>
        ))}
        <span className="ml-auto text-muted">Drag to pan · scroll to zoom · drag a node to reposition it</span>
      </div>

      <div className="relative mt-3 overflow-hidden rounded-lg border border-border bg-surface">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-[560px] w-full touch-none select-none"
          onPointerDown={onBackgroundPointerDown}
          onPointerMove={onBackgroundPointerMove}
          onPointerUp={onBackgroundPointerUp}
        >
          <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}>
            {links.map((l, i) => {
              const dimmed = connectedIds ? !(connectedIds.has(l.source.id) && connectedIds.has(l.target.id)) : false;
              return (
                <line
                  key={i}
                  x1={l.source.x}
                  y1={l.source.y}
                  x2={l.target.x}
                  y2={l.target.y}
                  stroke="var(--border)"
                  strokeWidth={1}
                  opacity={dimmed ? 0.15 : 0.6}
                />
              );
            })}

            {nodes.map((n) => {
              const r = radiusFor(n.type);
              const color = CATEGORY_COLORS[n.category] ?? "var(--accent)";
              const dimmed = connectedIds ? !connectedIds.has(n.id) : false;
              const isSelected = n.id === selectedId;
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x} ${n.y})`}
                  opacity={dimmed ? 0.25 : 1}
                  onPointerDown={(e) => onNodePointerDown(e, n.id)}
                  onPointerMove={onNodePointerMove}
                  onPointerUp={(e) => onNodePointerUp(e, n)}
                  onPointerEnter={() => setHoverId(n.id)}
                  onPointerLeave={() => setHoverId(null)}
                  className="cursor-pointer"
                >
                  <circle
                    r={r}
                    fill={n.type === "category" ? "transparent" : color}
                    stroke={color}
                    strokeWidth={n.type === "category" ? 2.5 : isSelected ? 3 : 1.5}
                  />
                  {n.type !== "tool" && (
                    <text
                      y={-r - 6}
                      textAnchor="middle"
                      fontSize={n.type === "category" ? 13 : 10}
                      fontWeight={n.type === "category" ? 700 : 500}
                      fill={n.type === "category" ? color : "var(--foreground)"}
                      className="pointer-events-none"
                      style={{ textTransform: n.type === "category" ? "uppercase" as const : undefined, letterSpacing: n.type === "category" ? "0.05em" : undefined }}
                    >
                      {n.type === "category" ? n.label : n.label.length > 26 ? n.label.slice(0, 24) + "…" : n.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {selected && selected.type !== "category" && (
          <div className="absolute bottom-3 left-3 right-3 max-w-sm rounded-lg border border-accent/40 bg-background/95 p-4 shadow-lg backdrop-blur sm:right-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: CATEGORY_COLORS[selected.category] }}>
                  {selected.category} · {typeLabel(selected.type)}
                </p>
                <p className="mt-1 font-semibold text-foreground">{selected.label}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close"
                className="shrink-0 text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>
            {selected.summary && <p className="mt-2 text-sm text-muted">{selected.summary}</p>}
            {selected.href && (
              <Link href={selected.href} className="mt-3 inline-block text-sm font-medium text-accent underline underline-offset-4">
                Open {selected.type === "module" ? "module" : selected.type === "usecase" ? "use case" : "tool"} →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
