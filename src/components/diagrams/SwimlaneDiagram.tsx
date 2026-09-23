export interface SwimlaneMessage {
  from: "left" | "right";
  label: string;
}

export default function SwimlaneDiagram({
  title,
  leftActor,
  rightActor,
  messages,
  caption,
}: {
  title?: string;
  leftActor: string;
  rightActor: string;
  messages: SwimlaneMessage[];
  caption?: string;
}) {
  const leftX = 90;
  const rightX = 390;
  const rowHeight = 56;
  const topY = 50;
  const bottomY = topY + messages.length * rowHeight + 20;
  const height = bottomY + 20;

  return (
    <div className="not-prose my-6 overflow-x-auto rounded-lg border border-border bg-surface p-5">
      {title && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
      )}
      <svg
        viewBox={`0 0 480 ${height}`}
        className="mx-auto h-auto w-full max-w-[480px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="swimlane-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
          </marker>
        </defs>

        <rect x={leftX - 45} y="10" width="90" height="28" rx="6" fill="var(--accent-soft)" stroke="var(--accent)" />
        <text x={leftX} y="29" textAnchor="middle" fill="var(--accent)" fontSize="13" fontFamily="monospace" fontWeight="600">
          {leftActor}
        </text>
        <rect x={rightX - 45} y="10" width="90" height="28" rx="6" fill="var(--accent-soft)" stroke="var(--accent)" />
        <text x={rightX} y="29" textAnchor="middle" fill="var(--accent)" fontSize="13" fontFamily="monospace" fontWeight="600">
          {rightActor}
        </text>

        <line x1={leftX} y1={topY} x2={leftX} y2={bottomY} stroke="var(--border)" strokeWidth="1.5" />
        <line x1={rightX} y1={topY} x2={rightX} y2={bottomY} stroke="var(--border)" strokeWidth="1.5" />

        {messages.map((m, i) => {
          const y = topY + i * rowHeight + 30;
          const x1 = m.from === "left" ? leftX : rightX;
          const x2 = m.from === "left" ? rightX : leftX;
          return (
            <g key={i}>
              <line
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
                stroke="var(--accent)"
                strokeWidth="1.5"
                markerEnd="url(#swimlane-arrow)"
              />
              <text
                x={(leftX + rightX) / 2}
                y={y - 8}
                textAnchor="middle"
                fill="currentColor"
                fontSize="11"
                fontFamily="monospace"
              >
                {m.label}
              </text>
            </g>
          );
        })}
      </svg>
      {caption && <p className="mt-3 text-xs text-muted">{caption}</p>}
    </div>
  );
}
