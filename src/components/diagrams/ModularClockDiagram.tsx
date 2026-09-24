function pointOn(radius: number, hour: number, mod: number, cx: number, cy: number) {
  const angle = (hour / mod) * 2 * Math.PI - Math.PI / 2;
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

export default function ModularClockDiagram({
  modulus = 12,
  start = 9,
  add = 5,
}: {
  modulus?: number;
  start?: number;
  add?: number;
}) {
  const cx = 150;
  const cy = 150;
  const radius = 110;
  const end = (start + add) % modulus;
  const numbers = Array.from({ length: modulus }, (_, i) => i);

  const startPt = pointOn(radius, start, modulus, cx, cy);
  const arcRadius = radius + 26;
  const arcStart = pointOn(arcRadius, start, modulus, cx, cy);
  const arcEnd = pointOn(arcRadius, end, modulus, cx, cy);
  const largeArcFlag = add % modulus > modulus / 2 ? 1 : 0;

  return (
    <div className="not-prose my-6 overflow-x-auto rounded-lg border border-border bg-surface p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
        {start} + {add} mod {modulus} = {end}, shown as a clock
      </p>
      <svg viewBox="0 0 300 300" className="mx-auto h-auto w-full max-w-[300px]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="clock-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
          </marker>
        </defs>

        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--border)" strokeWidth="1.5" />

        <path
          d={`M ${arcStart.x} ${arcStart.y} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 1 ${arcEnd.x} ${arcEnd.y}`}
          fill="none"
          stroke="var(--muted)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          markerEnd="url(#clock-arrow)"
        />

        {numbers.map((n) => {
          const pt = pointOn(radius, n, modulus, cx, cy);
          const isStart = n === start;
          const isEnd = n === end;
          return (
            <g key={n}>
              {(isStart || isEnd) && (
                <circle cx={pt.x} cy={pt.y} r="15" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.5" />
              )}
              <text
                x={pt.x}
                y={pt.y + 5}
                textAnchor="middle"
                fontSize="14"
                fontFamily="monospace"
                fontWeight={isStart || isEnd ? 700 : 400}
                fill={isStart || isEnd ? "var(--accent)" : "currentColor"}
              >
                {n}
              </text>
            </g>
          );
        })}

        <line x1={cx} y1={cy} x2={startPt.x} y2={startPt.y} stroke="var(--muted)" strokeWidth="1" opacity="0.4" />
      </svg>
      <p className="mt-3 text-xs text-muted">
        Starting at {start} and counting {add} steps forward wraps around past {modulus - 1} back
        to 0, landing on {end} — exactly the remainder you&apos;d get dividing {start + add} by {modulus}.
      </p>
    </div>
  );
}
