export default function CurvePointAdditionDiagram() {
  // P, Q, and −R are constructed to be exactly collinear (−R = P + 1.9·(Q−P)),
  // and R is the exact reflection of −R across the curve's horizontal symmetry
  // axis at y=150 — the line drawn below passes through all three by construction.
  const P = { x: 75, y: 195 };
  const Q = { x: 229, y: 134 };
  const negR = { x: 368, y: 79 };
  const R = { x: 368, y: 221 };

  return (
    <div className="not-prose my-6 overflow-x-auto rounded-lg border border-border bg-surface p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
        Point addition, geometrically: P + Q = R
      </p>
      <svg
        viewBox="0 0 480 300"
        className="mx-auto h-auto w-full max-w-[480px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 30 105 C 100 50, 160 170, 229 134 C 270 110, 330 60, 368 79 C 400 95, 425 100, 450 105"
          fill="none"
          stroke="var(--border)"
          strokeWidth="2"
        />
        <path
          d="M 30 195 C 100 250, 160 130, 229 166 C 270 190, 330 240, 368 221 C 400 205, 425 200, 450 195"
          fill="none"
          stroke="var(--border)"
          strokeWidth="2"
        />

        <line
          x1={P.x}
          y1={P.y}
          x2={negR.x}
          y2={negR.y}
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <line
          x1={negR.x}
          y1={negR.y}
          x2={R.x}
          y2={R.y}
          stroke="var(--muted)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        <circle cx={P.x} cy={P.y} r="5" fill="var(--accent)" />
        <text x={P.x - 18} y={P.y + 20} fill="currentColor" fontSize="15" fontFamily="monospace">
          P
        </text>

        <circle cx={Q.x} cy={Q.y} r="5" fill="var(--accent)" />
        <text x={Q.x + 10} y={Q.y - 10} fill="currentColor" fontSize="15" fontFamily="monospace">
          Q
        </text>

        <circle cx={negR.x} cy={negR.y} r="5" fill="var(--muted)" />
        <text
          x={negR.x + 10}
          y={negR.y - 8}
          fill="currentColor"
          fontSize="13"
          fontFamily="monospace"
          opacity="0.7"
        >
          −R
        </text>

        <circle cx={R.x} cy={R.y} r="5" fill="var(--accent)" />
        <text x={R.x + 10} y={R.y + 18} fill="currentColor" fontSize="15" fontFamily="monospace">
          R = P+Q
        </text>
      </svg>
      <p className="mt-3 text-xs text-muted">
        Draw a line through P and Q; it crosses the curve at one more point. Reflect that point
        across the curve&apos;s horizontal axis of symmetry to get R = P + Q. Every step here is
        simple algebra — the difficulty is entirely in reversing it.
      </p>
    </div>
  );
}
