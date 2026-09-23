function Box({ x, y, w, h, label, accent }: { x: number; y: number; w: number; h: number; label: string; accent?: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="7"
        fill={accent ? "var(--accent-soft)" : "var(--background)"}
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 4}
        textAnchor="middle"
        fill={accent ? "var(--accent)" : "currentColor"}
        fontSize="11"
        fontFamily="monospace"
        fontWeight={accent ? 700 : 400}
      >
        {label}
      </text>
    </g>
  );
}

function Op({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="14" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.5" />
      <text x={cx} y={cy + 5} textAnchor="middle" fill="var(--accent)" fontSize="14" fontWeight="700">
        ⊕
      </text>
    </g>
  );
}

export default function OaepDiagram() {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-lg border border-border bg-surface p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
        OAEP encoding: two rounds of masking
      </p>
      <svg viewBox="0 0 480 320" className="mx-auto h-auto w-full max-w-[480px]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="oaep-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
          </marker>
        </defs>

        {/* Row 0: inputs */}
        <Box x={20} y={20} w={70} h={34} label="seed" accent />
        <Box x={95} y={20} w={70} h={34} label="DB" />

        {/* Row 1: mask DB */}
        <line x1={55} y1={54} x2={55} y2={86} stroke="var(--accent)" strokeWidth="1.5" markerEnd="url(#oaep-arrow)" />
        <Box x={20} y={90} w={70} h={34} label="MGF1" />
        <line x1={130} y1={54} x2={130} y2={89} stroke="var(--muted)" strokeWidth="1.5" markerEnd="url(#oaep-arrow)" />
        <line x1={90} y1={107} x2={112} y2={107} stroke="var(--accent)" strokeWidth="1.5" markerEnd="url(#oaep-arrow)" />
        <Op cx={130} cy={107} />
        <line x1={144} y1={107} x2={172} y2={107} stroke="var(--accent)" strokeWidth="1.5" markerEnd="url(#oaep-arrow)" />
        <Box x={176} y={90} w={84} h={34} label="maskedDB" accent />

        {/* Row 2: mask seed */}
        <line x1={218} y1={124} x2={218} y2={156} stroke="var(--accent)" strokeWidth="1.5" markerEnd="url(#oaep-arrow)" />
        <Box x={176} y={160} w={84} h={34} label="MGF1" />
        <line x1={260} y1={177} x2={296} y2={177} stroke="var(--accent)" strokeWidth="1.5" markerEnd="url(#oaep-arrow)" />
        <Op cx={314} cy={177} />
        <path
          d="M 55 54 L 55 235 L 314 235 L 314 195"
          fill="none"
          stroke="var(--muted)"
          strokeWidth="1.5"
          markerEnd="url(#oaep-arrow)"
        />
        <line x1={328} y1={177} x2={356} y2={177} stroke="var(--accent)" strokeWidth="1.5" markerEnd="url(#oaep-arrow)" />
        <Box x={360} y={160} w={90} h={34} label="maskedSeed" accent />

        {/* Row 3: assemble EM */}
        <line x1={218} y1={124} x2={150} y2={260} stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#oaep-arrow)" />
        <line x1={405} y1={194} x2={330} y2={260} stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#oaep-arrow)" />

        <Box x={20} y={264} w={440} h={32} label="EM  =  0x00 ‖ maskedSeed ‖ maskedDB" accent />
      </svg>
      <p className="mt-3 text-xs text-muted">
        The seed masks DB (top); the resulting maskedDB then masks the seed right back (middle,
        dashed line shows the original seed feeding that second XOR) — each half depends on the
        other, which is what makes recovering any part of the message require recovering the
        entire encoded block.
      </p>
    </div>
  );
}
