export interface TimelineEvent {
  date: string;
  label: string;
  detail?: string;
}

export default function TimelineDiagram({
  title,
  events,
}: {
  title?: string;
  events: TimelineEvent[];
}) {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-surface p-5">
      {title && (
        <p className="mb-5 text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
      )}
      <ol className="relative space-y-6 border-l-2 border-border pl-6">
        {events.map((e, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[1.97rem] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-accent bg-background" />
            <span className="block text-xs font-mono font-semibold uppercase tracking-wide text-accent">
              {e.date}
            </span>
            <p className="mt-0.5 font-medium text-foreground">{e.label}</p>
            {e.detail && <p className="mt-1 text-sm text-muted">{e.detail}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
