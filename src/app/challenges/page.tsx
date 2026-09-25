import type { Metadata } from "next";
import ChallengesOverview from "@/components/ChallengesOverview";

export const metadata: Metadata = {
  title: "Challenges — Classical Crypto Today",
  description:
    "Hands-on cryptography challenges: recover flags by breaking classical ciphers, XOR, RSA, and Diffie-Hellman/ECC mistakes — all checked in your browser.",
};

export default function ChallengesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Challenges</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Break it yourself
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        The Learn modules explain how these primitives are supposed to work. These challenges are
        about how they fail: each one hands you ciphertext, a leaked value, or a flawed
        implementation, and asks you to recover a hidden flag of the form{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-sm">cct{"{...}"}</code>.
        Everything is solved and checked entirely in your browser — no accounts, no server, no
        leaderboard.
      </p>

      <ChallengesOverview />
    </div>
  );
}
