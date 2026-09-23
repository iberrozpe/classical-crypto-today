export interface CompareColumn {
  title: string;
  points: string[];
}

export default function CompareDiagram({
  left,
  right,
}: {
  left: CompareColumn;
  right: CompareColumn;
}) {
  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {[left, right].map((col, i) => (
        <div key={i} className="rounded-lg border border-border bg-surface p-5">
          <p className="font-semibold text-foreground">{col.title}</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {col.points.map((p, j) => (
              <li key={j} className="flex gap-2">
                <span className="text-accent">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
