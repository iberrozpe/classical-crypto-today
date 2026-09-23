export default function GridDiagram({
  title,
  rows,
  caption,
}: {
  title?: string;
  rows: string[][];
  caption?: string;
}) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-lg border border-border bg-surface p-5">
      {title && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
      )}
      <div className="inline-block min-w-full">
        {rows.map((row, i) => (
          <div key={i} className="flex">
            {row.map((cell, j) => (
              <div
                key={j}
                className="flex h-12 w-16 shrink-0 items-center justify-center border border-border bg-background font-mono text-xs text-foreground"
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      {caption && <p className="mt-3 text-xs text-muted">{caption}</p>}
    </div>
  );
}
