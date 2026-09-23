import katex from "katex";

export default function Math({
  expr,
  caption,
}: {
  expr: string;
  caption?: string;
}) {
  const html = katex.renderToString(expr, {
    throwOnError: false,
    displayMode: true,
  });
  return (
    <div className="not-prose my-4 overflow-x-auto rounded-lg border border-border bg-surface px-5 py-4">
      <div
        className="text-foreground [&_.katex]:text-base sm:[&_.katex]:text-lg"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {caption && <p className="mt-2 text-xs text-muted">{caption}</p>}
    </div>
  );
}
