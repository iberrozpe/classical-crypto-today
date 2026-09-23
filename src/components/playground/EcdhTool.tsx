"use client";

import { useState } from "react";
import { Button, OutputBox, StatusBanner, Panel } from "./ui";
import { bufToBase64, bufToHex } from "@/lib/webcrypto-utils";

export default function EcdhTool() {
  const [aliceKeys, setAliceKeys] = useState<CryptoKeyPair | null>(null);
  const [bobKeys, setBobKeys] = useState<CryptoKeyPair | null>(null);
  const [alicePubB64, setAlicePubB64] = useState("");
  const [bobPubB64, setBobPubB64] = useState("");
  const [aliceSecretHex, setAliceSecretHex] = useState("");
  const [bobSecretHex, setBobSecretHex] = useState("");
  const [status, setStatus] = useState<{ tone: "success" | "error" | "info"; text: string } | null>(
    null,
  );

  async function generateKeys() {
    const a = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, [
      "deriveBits",
    ]);
    const b = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, [
      "deriveBits",
    ]);
    setAliceKeys(a);
    setBobKeys(b);
    setAlicePubB64(bufToBase64(await crypto.subtle.exportKey("spki", a.publicKey)));
    setBobPubB64(bufToBase64(await crypto.subtle.exportKey("spki", b.publicKey)));
    setAliceSecretHex("");
    setBobSecretHex("");
    setStatus({ tone: "info", text: "Alice and Bob each generated an independent key pair. Only their public keys are exchanged below." });
  }

  async function deriveSecrets() {
    if (!aliceKeys || !bobKeys) return;
    const aliceSecret = await crypto.subtle.deriveBits(
      { name: "ECDH", public: bobKeys.publicKey },
      aliceKeys.privateKey,
      256,
    );
    const bobSecret = await crypto.subtle.deriveBits(
      { name: "ECDH", public: aliceKeys.publicKey },
      bobKeys.privateKey,
      256,
    );
    const aHex = bufToHex(aliceSecret);
    const bHex = bufToHex(bobSecret);
    setAliceSecretHex(aHex);
    setBobSecretHex(bHex);
    setStatus(
      aHex === bHex
        ? { tone: "success", text: "Alice and Bob computed the identical shared secret — independently, using only their own private key and the other's public key." }
        : { tone: "error", text: "Secrets don't match — this shouldn't happen with correctly generated keys." },
    );
  }

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">1. Generate two independent key pairs</p>
            <p className="text-xs text-muted">Real P-256 ECDH keys — one for Alice, one for Bob.</p>
          </div>
          <Button onClick={generateKeys}>Generate Alice&apos;s &amp; Bob&apos;s keys</Button>
        </div>
        {alicePubB64 && (
          <div className="mt-4 space-y-3">
            <OutputBox label="Alice's public key (SPKI, base64)" value={alicePubB64} />
            <OutputBox label="Bob's public key (SPKI, base64)" value={bobPubB64} />
          </div>
        )}
      </Panel>

      <Panel>
        <p className="mb-3 text-sm font-medium text-foreground">
          2. Each side derives the shared secret independently
        </p>
        <Button onClick={deriveSecrets} disabled={!aliceKeys}>
          Derive shared secret (both sides)
        </Button>
        {aliceSecretHex && (
          <div className="mt-4 space-y-3">
            <OutputBox label="Secret, as computed by Alice" value={aliceSecretHex} tone={aliceSecretHex === bobSecretHex ? "success" : "error"} />
            <OutputBox label="Secret, as computed by Bob" value={bobSecretHex} tone={aliceSecretHex === bobSecretHex ? "success" : "error"} />
          </div>
        )}
        {status && <div className="mt-4"><StatusBanner tone={status.tone}>{status.text}</StatusBanner></div>}
      </Panel>
    </div>
  );
}
