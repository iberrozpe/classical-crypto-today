export interface StructureBlock {
  label: string;
  detail?: string;
}

export default function StructureDiagram({
  title,
  blocks,
}: {
  title?: string;
  blocks: StructureBlock[];
}) {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-surface p-5">
      {title && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
      )}
      <div className="space-y-2">
        {blocks.map((b, i) => (
          <div key={i} className="rounded-md border border-border bg-background px-4 py-3">
            <p className="font-mono text-sm font-semibold text-accent">{b.label}</p>
            {b.detail && <p className="mt-1 text-sm text-muted">{b.detail}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
