export default function CurvePointAdditionDiagram() {
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
          d="M 40 60 C 120 20, 160 280, 230 150 C 280 60, 340 40, 440 90"
          fill="none"
          stroke="var(--border)"
          strokeWidth="2"
        />
        <path
          d="M 40 240 C 120 280, 160 20, 230 150 C 280 240, 340 260, 440 210"
          fill="none"
          stroke="var(--border)"
          strokeWidth="2"
        />

        <line x1="70" y1="216" x2="330" y2="66" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="330" y1="66" x2="330" y2="234" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="4 4" />

        <circle cx="70" cy="216" r="5" fill="var(--accent)" />
        <text x="55" y="200" fill="currentColor" fontSize="15" fontFamily="monospace">P</text>

        <circle cx="245" cy="141" r="5" fill="var(--accent)" />
        <text x="255" y="130" fill="currentColor" fontSize="15" fontFamily="monospace">Q</text>

        <circle cx="330" cy="66" r="5" fill="var(--muted)" />
        <text x="340" y="60" fill="currentColor" fontSize="13" fontFamily="monospace" opacity="0.7">
          −R
        </text>

        <circle cx="330" cy="234" r="5" fill="var(--accent)" />
        <text x="340" y="250" fill="currentColor" fontSize="15" fontFamily="monospace">R = P+Q</text>
      </svg>
      <p className="mt-3 text-xs text-muted">
        Draw a line through P and Q; it crosses the curve at one more point. Reflect that point
        across the x-axis to get R = P + Q. Every step here is simple algebra — the difficulty
        is entirely in reversing it.
      </p>
    </div>
  );
}
