export default function PipelineDiagram({
  title,
  steps,
  loopLabel,
  caption,
}: {
  title?: string;
  steps: string[];
  loopLabel?: string;
  caption?: string;
}) {
  const boxWidth = 100;
  const gap = 24;
  const boxHeight = 44;
  const y = loopLabel ? 46 : 20;
  const totalWidth = steps.length * boxWidth + (steps.length - 1) * gap + 40;
  const height = y + boxHeight + (loopLabel ? 50 : 20);

  return (
    <div className="not-prose my-6 overflow-x-auto rounded-lg border border-border bg-surface p-5">
      {title && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
      )}
      <svg
        viewBox={`0 0 ${totalWidth} ${height}`}
        className="mx-auto h-auto"
        style={{ minWidth: `${Math.min(totalWidth, 640)}px` }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="pipeline-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
          </marker>
        </defs>

        {steps.map((step, i) => {
          const x = 20 + i * (boxWidth + gap);
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={boxWidth}
                height={boxHeight}
                rx="8"
                fill="var(--background)"
                stroke="var(--accent)"
                strokeWidth="1.5"
              />
              <text
                x={x + boxWidth / 2}
                y={y + boxHeight / 2 + 4}
                textAnchor="middle"
                fill="currentColor"
                fontSize="12"
                fontFamily="monospace"
              >
                {step}
              </text>
              {i < steps.length - 1 && (
                <line
                  x1={x + boxWidth}
                  y1={y + boxHeight / 2}
                  x2={x + boxWidth + gap}
                  y2={y + boxHeight / 2}
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  markerEnd="url(#pipeline-arrow)"
                />
              )}
            </g>
          );
        })}

        {loopLabel && (
          <>
            <path
              d={`M ${20 + (steps.length - 1) * (boxWidth + gap) + boxWidth / 2} ${y} C ${20 + (steps.length - 1) * (boxWidth + gap) + boxWidth / 2} ${y - 26}, ${20 + boxWidth / 2} ${y - 26}, ${20 + boxWidth / 2} ${y}`}
              fill="none"
              stroke="var(--muted)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              markerEnd="url(#pipeline-arrow)"
            />
            <text
              x={totalWidth / 2}
              y={y - 30}
              textAnchor="middle"
              fill="var(--muted)"
              fontSize="11"
              fontFamily="monospace"
            >
              {loopLabel}
            </text>
          </>
        )}
      </svg>
      {caption && <p className="mt-3 text-xs text-muted">{caption}</p>}
    </div>
  );
}
