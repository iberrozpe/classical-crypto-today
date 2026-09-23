"use client";

import { useState, type ReactNode } from "react";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {hint && <span className="ml-2 text-xs text-muted">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${inputClass} font-mono resize-y ${props.className ?? ""}`}
    />
  );
}

export function Button({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }) {
  const styles =
    variant === "primary"
      ? "border-accent bg-accent-soft text-accent hover:bg-accent-soft/80"
      : "border-border text-muted hover:text-foreground hover:border-accent";
  return (
    <button
      {...props}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${styles} ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function OutputBox({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "success" | "error";
}) {
  const [copied, setCopied] = useState(false);
  const toneClass =
    tone === "success"
      ? "border-accent"
      : tone === "error"
        ? "border-red-500/60"
        : "border-border";

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <div className={`rounded-md border bg-background p-3 ${toneClass}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
        {value && (
          <button
            type="button"
            onClick={copy}
            className="text-xs text-muted hover:text-accent"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      <p className="mt-1.5 break-all font-mono text-sm text-foreground">{value || "—"}</p>
    </div>
  );
}

export function StatusBanner({
  tone,
  children,
}: {
  tone: "success" | "error" | "info";
  children: ReactNode;
}) {
  const styles =
    tone === "success"
      ? "border-accent bg-accent-soft text-accent"
      : tone === "error"
        ? "border-red-500/60 bg-red-500/10 text-red-400"
        : "border-border bg-surface text-muted";
  return <div className={`rounded-md border px-4 py-3 text-sm ${styles}`}>{children}</div>;
}

export function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">{children}</div>
  );
}
