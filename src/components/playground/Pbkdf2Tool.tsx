"use client";

import { useState } from "react";
import { Field, TextInput, Button, OutputBox, StatusBanner, Panel } from "./ui";
import { bufToHex, utf8ToBuf } from "@/lib/webcrypto-utils";

const ITERATION_OPTIONS = [1_000, 100_000, 600_000];

async function deriveKey(password: string, saltHex: string, iterations: number) {
  const saltBytes = new Uint8Array(saltHex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    utf8ToBuf(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const start = performance.now();
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBytes, iterations, hash: "SHA-256" },
    keyMaterial,
    256,
  );
  const elapsedMs = performance.now() - start;
  return { hex: bufToHex(bits), elapsedMs };
}

function randomSaltHex(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return bufToHex(bytes.buffer);
}

export default function Pbkdf2Tool() {
  const [password, setPassword] = useState("correct horse battery staple");
  const [saltHex, setSaltHex] = useState(randomSaltHex());
  const [iterations, setIterations] = useState(600_000);
  const [derived, setDerived] = useState("");
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const [verifyPassword, setVerifyPassword] = useState("");
  const [result, setResult] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [verifyBusy, setVerifyBusy] = useState(false);

  async function run() {
    setBusy(true);
    const { hex, elapsedMs } = await deriveKey(password, saltHex, iterations);
    setDerived(hex);
    setElapsed(elapsedMs);
    setVerifyPassword(password);
    setResult(null);
    setBusy(false);
  }

  async function verify() {
    if (!derived) return;
    setVerifyBusy(true);
    const { hex } = await deriveKey(verifyPassword, saltHex, iterations);
    setResult(
      hex === derived
        ? { tone: "success", text: "Match — deriving with this password, salt, and iteration count reproduces the exact same key." }
        : { tone: "error", text: "No match — a different password (or a different salt/iteration count) derives a completely different key, with no partial credit for being close." },
    );
    setVerifyBusy(false);
  }

  return (
    <div className="space-y-6">
      <Panel>
        <p className="mb-3 text-sm font-medium text-foreground">1. Derive a key from a password</p>
        <div className="space-y-3">
          <Field label="Password">
            <TextInput value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <Field label="Salt (hex)" hint="Randomly generated — regenerate to get a fresh one">
            <div className="flex gap-2">
              <TextInput className="font-mono" value={saltHex} onChange={(e) => setSaltHex(e.target.value)} />
              <Button variant="secondary" onClick={() => setSaltHex(randomSaltHex())}>
                New salt
              </Button>
            </div>
          </Field>
          <Field label="Iterations">
            <div className="flex flex-wrap gap-2">
              {ITERATION_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setIterations(n)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    iterations === n
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border text-muted hover:text-foreground"
                  }`}
                >
                  {n.toLocaleString()}
                </button>
              ))}
            </div>
          </Field>
        </div>
        <div className="mt-3">
          <Button onClick={run} disabled={busy}>{busy ? "Deriving…" : "Derive key (PBKDF2-SHA256)"}</Button>
        </div>
        {derived && (
          <div className="mt-4 space-y-3">
            <OutputBox label="Derived key (hex)" value={derived} />
            <StatusBanner tone="info">
              Took {elapsed?.toFixed(1)} ms with {iterations.toLocaleString()} iterations. Try
              1,000 vs 600,000 and compare — that difference in wall-clock time, multiplied across
              every password an attacker tries, is the entire point of a slow hash.
            </StatusBanner>
          </div>
        )}
      </Panel>

      <Panel>
        <p className="mb-3 text-sm font-medium text-foreground">
          2. Verify — edit the password and see what happens
        </p>
        <Field label="Password to check">
          <TextInput value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)} />
        </Field>
        <div className="mt-3">
          <Button onClick={verify} disabled={!derived || verifyBusy}>
            {verifyBusy ? "Checking…" : "Verify"}
          </Button>
        </div>
        {result && <div className="mt-4"><StatusBanner tone={result.tone}>{result.text}</StatusBanner></div>}
      </Panel>
    </div>
  );
}
