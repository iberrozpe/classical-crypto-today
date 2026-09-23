"use client";

import { useState } from "react";
import { Field, TextInput, TextArea, Button, OutputBox, StatusBanner, Panel } from "./ui";
import { bufToHex, utf8ToBuf } from "@/lib/webcrypto-utils";

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    utf8ToBuf(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, utf8ToBuf(message));
  return bufToHex(sig);
}

export default function HmacTool() {
  const [message, setMessage] = useState("Transfer $100 to account 4471");
  const [secret, setSecret] = useState("shared-secret-key");
  const [tag, setTag] = useState("");

  const [verifyMessage, setVerifyMessage] = useState("");
  const [verifySecret, setVerifySecret] = useState("");
  const [verifyTag, setVerifyTag] = useState("");
  const [result, setResult] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  async function generate() {
    const t = await hmacSha256Hex(secret, message);
    setTag(t);
    setVerifyMessage(message);
    setVerifySecret(secret);
    setVerifyTag(t);
    setResult(null);
  }

  async function verify() {
    const recomputed = await hmacSha256Hex(verifySecret, verifyMessage);
    if (recomputed === verifyTag.trim().toLowerCase()) {
      setResult({ tone: "success", text: "Valid — the recomputed HMAC matches the provided tag. The message wasn't tampered with, and the secret matches." });
    } else {
      setResult({ tone: "error", text: "Invalid — the recomputed HMAC does not match. Either the message changed, the tag is wrong, or the secret doesn't match." });
    }
  }

  return (
    <div className="space-y-6">
      <Panel>
        <p className="mb-3 text-sm font-medium text-foreground">1. Compute a tag</p>
        <div className="space-y-3">
          <Field label="Message">
            <TextArea rows={2} value={message} onChange={(e) => setMessage(e.target.value)} />
          </Field>
          <Field label="Shared secret">
            <TextInput value={secret} onChange={(e) => setSecret(e.target.value)} />
          </Field>
        </div>
        <div className="mt-3">
          <Button onClick={generate}>Compute HMAC-SHA256</Button>
        </div>
        {tag && <div className="mt-4"><OutputBox label="Tag (hex)" value={tag} /></div>}
      </Panel>

      <Panel>
        <p className="mb-3 text-sm font-medium text-foreground">
          2. Verify — edit the message, secret, or tag below and see what happens
        </p>
        <div className="space-y-3">
          <Field label="Message to verify">
            <TextArea rows={2} value={verifyMessage} onChange={(e) => setVerifyMessage(e.target.value)} />
          </Field>
          <Field label="Secret">
            <TextInput value={verifySecret} onChange={(e) => setVerifySecret(e.target.value)} />
          </Field>
          <Field label="Tag to check">
            <TextInput
              className="font-mono"
              value={verifyTag}
              onChange={(e) => setVerifyTag(e.target.value)}
            />
          </Field>
        </div>
        <div className="mt-3">
          <Button onClick={verify} disabled={!verifyTag}>Verify</Button>
        </div>
        {result && <div className="mt-4"><StatusBanner tone={result.tone}>{result.text}</StatusBanner></div>}
      </Panel>
    </div>
  );
}
