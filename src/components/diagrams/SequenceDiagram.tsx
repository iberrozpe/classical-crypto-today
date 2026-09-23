export interface SequenceStep {
  label: string;
  detail?: string;
}

export default function SequenceDiagram({
  title,
  steps,
}: {
  title?: string;
  steps: SequenceStep[];
}) {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-surface p-5">
      {title && (
        <p className="mb-5 text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
      )}
      <ol className="relative space-y-6 border-l border-border pl-6">
        {steps.map((s, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[1.94rem] flex h-6 w-6 items-center justify-center rounded-full border border-accent bg-accent-soft text-xs font-semibold text-accent">
              {i + 1}
            </span>
            <p className="font-medium text-foreground">{s.label}</p>
            {s.detail && <p className="mt-1 text-sm text-muted">{s.detail}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
