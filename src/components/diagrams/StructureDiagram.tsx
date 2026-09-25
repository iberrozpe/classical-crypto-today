export interface StructureBlock {
  label: string;
  detail?: string;
  href?: string;
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
            {b.href ? (
              <a
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
              >
                {b.label}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            ) : (
              <p className="font-mono text-sm font-semibold text-accent">{b.label}</p>
            )}
            {b.detail && <p className="mt-1 text-sm text-muted">{b.detail}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
