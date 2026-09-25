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
  Challenges: "#f472b6",
  Standards: "#fbbf24",
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
  if (type === "challenge") return 7;
  if (type === "standard") return 8;
  return 6;
}

function typeLabel(type: GraphNode["type"]) {
  if (type === "module") return "Learn module";
  if (type === "usecase") return "Use case";
  if (type === "challenge") return "Challenge";
  if (type === "standard") return "Standards body";
  return "Playground tool";
}

// setPointerCapture can throw (e.g. NotFoundError) if the browser's own
// gesture/scroll recognizer has already invalidated the pointer session by
// the time this runs — confirmed to happen in real drags, not just theory.
// Uncaught, that exception crashes the whole page (this app has no error
// boundary): dragging just doesn't lock onto the pointer that one time,
// rather than tearing down the tree.
function trySetPointerCapture(el: Element, pointerId: number) {
  try {
    el.setPointerCapture(pointerId);
  } catch {
    // ignore
  }
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
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
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
  // How far a wheel gesture may zoom out — normally MIN_ZOOM, but lowered to
  // match the initial fit-to-bounds scale when the graph is too spread out
  // to fit at MIN_ZOOM, so zooming out further never snaps back up to it.
  const minZoomRef = useRef(MIN_ZOOM);

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

    // Fit the initial view to every node's bounding box, padded for their
    // radius and label text, instead of a fixed transform that assumes the
    // layout always settles within the viewBox — d3-force's spread varies
    // with node/link count, and a fixed identity transform can start with
    // nodes clipped outside view.
    const PADDING = 50;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const n of simNodes) {
      const r = radiusFor(n.type);
      minX = Math.min(minX, (n.x ?? 0) - r);
      maxX = Math.max(maxX, (n.x ?? 0) + r);
      minY = Math.min(minY, (n.y ?? 0) - r);
      maxY = Math.max(maxY, (n.y ?? 0) + r);
    }
    const boundsWidth = Math.max(maxX - minX, 1);
    const boundsHeight = Math.max(maxY - minY, 1);
    // Not clamped to MIN_ZOOM here — the point is to fit everything, even if
    // that needs a smaller scale than the comfortable manual-zoom floor.
    // ABSOLUTE_MIN_K is just a sanity backstop against a degenerate (e.g.
    // near-zero) scale if the layout were ever extremely spread out.
    const ABSOLUTE_MIN_K = 0.2;
    const fitK = Math.min(
      MAX_ZOOM,
      Math.max(ABSOLUTE_MIN_K, Math.min((WIDTH - PADDING * 2) / boundsWidth, (HEIGHT - PADDING * 2) / boundsHeight)),
    );
    const fitTransform = {
      x: WIDTH / 2 - ((minX + maxX) / 2) * fitK,
      y: HEIGHT / 2 - ((minY + maxY) / 2) * fitK,
      k: fitK,
    };
    minZoomRef.current = Math.min(MIN_ZOOM, fitK);

    // One-time layout computed by an external physics engine (d3-force), not
    // derived from render state — there's no way to compute node positions
    // during render itself.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNodes(simNodes);
    setLinks(simLinks as unknown as { source: SimNode; target: SimNode }[]);
    setTransform(fitTransform);
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

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function isNodeDimmed(n: SimNode) {
    if (selectedCategories.size > 0 && !selectedCategories.has(n.category)) return true;
    if (connectedIds && !connectedIds.has(n.id)) return true;
    return false;
  }

  // With ~55+ non-category nodes, labeling everything at once makes them
  // unreadably overlap. The category hubs stay labeled as fixed landmarks;
  // every other label only appears once something brings it into focus —
  // hovering/selecting it (or a neighbor), or filtering its category in via
  // the legend — instead of all at once by default.
  function showLabel(n: SimNode) {
    if (n.type === "category") return true;
    if (n.type === "tool") return false;
    const focusActive = hoverId !== null || selectedId !== null;
    if (!focusActive && selectedCategories.size === 0) return false;
    return !isNodeDimmed(n);
  }

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
    trySetPointerCapture(e.target as Element, e.pointerId);
    drag.current = { id, moved: false, startX: e.clientX, startY: e.clientY };
  }

  function onNodePointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    if (Math.hypot(dx, dy) > CLICK_THRESHOLD) drag.current.moved = true;
    if (!drag.current.moved) return;

    const world = clientToWorld(e.clientX, e.clientY);
    const draggedId = drag.current.id;
    setNodes((prev) => {
      // Read the dragged id from a local captured above, not drag.current
      // itself — React can batch/defer this updater, and by the time it
      // runs, a pointerup in between may have already nulled drag.current
      // out, which crashed the whole page with no error boundary in place.
      // Mutate the node in place rather than replacing it with a new object —
      // the links array's source/target were resolved by d3-force to these
      // exact node instances, so swapping in a copy would leave rendered
      // lines pointing at the node's old, stale position forever.
      const node = prev.find((n) => n.id === draggedId);
      if (node) {
        node.x = world.x;
        node.y = world.y;
        node.fx = world.x;
        node.fy = world.y;
      }
      return [...prev];
    });
  }

  function onNodePointerUp(e: React.PointerEvent, node: SimNode) {
    const wasDrag = drag.current?.moved;
    drag.current = null;
    if (!wasDrag) {
      setSelectedId((prev) => (prev === node.id ? null : node.id));
    }
  }

  function onBackgroundPointerDown(e: React.PointerEvent) {
    e.preventDefault();
    pan.current = { startX: e.clientX, startY: e.clientY, origX: transform.x, origY: transform.y, moved: false };
    trySetPointerCapture(e.target as Element, e.pointerId);
  }

  function onBackgroundPointerMove(e: React.PointerEvent) {
    if (!pan.current) return;
    e.preventDefault();
    const dx = e.clientX - pan.current.startX;
    const dy = e.clientY - pan.current.startY;
    if (Math.hypot(dx, dy) > CLICK_THRESHOLD) pan.current.moved = true;
    if (!pan.current.moved) return;
    // Same reasoning as onNodePointerMove: capture before queuing the
    // updater, not pan.current!.origX inside it, since a pointerup can null
    // pan.current out before a batched update actually runs.
    const origX = pan.current.origX;
    const origY = pan.current.origY;
    setTransform((t) => ({ ...t, x: origX + dx, y: origY + dy }));
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
        const next = Math.min(MAX_ZOOM, Math.max(minZoomRef.current, t.k - e.deltaY * 0.0015));
        return { ...t, k: next };
      });
    }
    svg.addEventListener("wheel", handleWheel, { passive: false });
    return () => svg.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-muted">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => {
          const active = selectedCategories.has(cat);
          return (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              aria-pressed={active}
              className={`flex items-center gap-1.5 rounded-full border px-2 py-1 transition ${
                active
                  ? "border-current"
                  : selectedCategories.size > 0
                    ? "border-transparent opacity-40 hover:opacity-70"
                    : "border-transparent hover:border-border"
              }`}
              style={active ? { color, background: `${color}1a` } : undefined}
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />
              <span className={active ? "font-medium" : ""}>{cat}</span>
            </button>
          );
        })}
        {selectedCategories.size > 0 && (
          <button
            type="button"
            onClick={() => setSelectedCategories(new Set())}
            className="text-muted underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-accent"
          >
            Clear
          </button>
        )}
        <span className="ml-auto text-muted">Hover or click a node to see its name · drag to pan · scroll to zoom</span>
      </div>

      <div className="relative mt-3 overflow-hidden overscroll-none rounded-lg border border-border bg-surface">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-[560px] w-full touch-none select-none overscroll-none"
          style={{ overscrollBehavior: "none" }}
          onPointerDown={onBackgroundPointerDown}
          onPointerMove={onBackgroundPointerMove}
          onPointerUp={onBackgroundPointerUp}
        >
          <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}>
            {links.map((l, i) => {
              const dimmed = isNodeDimmed(l.source) || isNodeDimmed(l.target);
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
              const dimmed = isNodeDimmed(n);
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
                  {showLabel(n) && (
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
                Open {selected.type === "module" ? "module" : selected.type === "usecase" ? "use case" : selected.type === "challenge" ? "challenge" : selected.type === "standard" ? "standards page" : "tool"} →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
