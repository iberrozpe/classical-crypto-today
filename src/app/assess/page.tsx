import type { Metadata } from "next";
import AssessQuiz from "@/components/AssessQuiz";

export const metadata: Metadata = {
  title: "Assess — Classical Crypto Today",
};

export default function AssessPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Assess</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        What does your stack actually rely on?
      </h1>
      <p className="mt-4 text-muted">
        Eight yes/no questions about what you run today. You&apos;ll get a prioritized reading
        list, not a compliance report — this is a starting point for the conversation, not a
        substitute for a real cryptographic inventory.
      </p>
      <AssessQuiz />
    </div>
  );
}
