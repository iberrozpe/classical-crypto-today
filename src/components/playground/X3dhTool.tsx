"use client";

import { useState } from "react";
import { Button, OutputBox, StatusBanner, Panel } from "./ui";
import { bufToBase64, bufToHex } from "@/lib/webcrypto-utils";

async function genEcdh() {
  return crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
}

async function dh(privateKey: CryptoKey, publicKey: CryptoKey): Promise<ArrayBuffer> {
  return crypto.subtle.deriveBits({ name: "ECDH", public: publicKey }, privateKey, 256);
}

function concat(buffers: ArrayBuffer[]): Uint8Array<ArrayBuffer> {
  const total = buffers.reduce((n, b) => n + b.byteLength, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const b of buffers) {
    out.set(new Uint8Array(b), offset);
    offset += b.byteLength;
  }
  return out;
}

async function combine(parts: ArrayBuffer[]): Promise<string> {
  const joined = concat(parts);
  const digest = await crypto.subtle.digest("SHA-256", joined);
  return bufToHex(digest);
}

export default function X3dhTool() {
  const [bobKeys, setBobKeys] = useState<{ ik: CryptoKeyPair; spk: CryptoKeyPair; opk: CryptoKeyPair } | null>(null);
  const [bobPubs, setBobPubs] = useState<{ ik: string; spk: string; opk: string } | null>(null);

  const [aliceKeys, setAliceKeys] = useState<{ ik: CryptoKeyPair; ek: CryptoKeyPair } | null>(null);

  const [aliceSecret, setAliceSecret] = useState("");
  const [bobSecret, setBobSecret] = useState("");
  const [status, setStatus] = useState<{ tone: "success" | "error" | "info"; text: string } | null>(
    null,
  );

  async function bobPublishesKeys() {
    const ik = await genEcdh();
    const spk = await genEcdh();
    const opk = await genEcdh();
    setBobKeys({ ik, spk, opk });
    setBobPubs({
      ik: bufToBase64(await crypto.subtle.exportKey("spki", ik.publicKey)),
      spk: bufToBase64(await crypto.subtle.exportKey("spki", spk.publicKey)),
      opk: bufToBase64(await crypto.subtle.exportKey("spki", opk.publicKey)),
    });
    setAliceSecret("");
    setBobSecret("");
    setStatus({ tone: "info", text: "Bob uploaded his identity key, a signed prekey, and a one-time prekey — then went offline." });
  }

  async function aliceComputesSecret() {
    if (!bobKeys) return;
    const ik = await genEcdh();
    const ek = await genEcdh();
    setAliceKeys({ ik, ek });

    const dh1 = await dh(ik.privateKey, bobKeys.spk.publicKey);
    const dh2 = await dh(ek.privateKey, bobKeys.ik.publicKey);
    const dh3 = await dh(ek.privateKey, bobKeys.spk.publicKey);
    const dh4 = await dh(ek.privateKey, bobKeys.opk.publicKey);
    const secret = await combine([dh1, dh2, dh3, dh4]);
    setAliceSecret(secret);
    setStatus({ tone: "info", text: "Alice fetched Bob's published bundle and computed a shared secret — without Bob being online at all." });
  }

  async function bobComputesSecret() {
    if (!bobKeys || !aliceKeys) return;
    const dh1 = await dh(bobKeys.spk.privateKey, aliceKeys.ik.publicKey);
    const dh2 = await dh(bobKeys.ik.privateKey, aliceKeys.ek.publicKey);
    const dh3 = await dh(bobKeys.spk.privateKey, aliceKeys.ek.publicKey);
    const dh4 = await dh(bobKeys.opk.privateKey, aliceKeys.ek.publicKey);
    const secret = await combine([dh1, dh2, dh3, dh4]);
    setBobSecret(secret);
    setStatus(
      secret === aliceSecret
        ? { tone: "success", text: "Bob came back online, ran the mirrored computation, and landed on the exact same secret Alice did." }
        : { tone: "error", text: "Secrets don't match — this shouldn't happen with correctly generated keys." },
    );
  }

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">1. Bob publishes a key bundle, then goes offline</p>
            <p className="text-xs text-muted">Three real ECDH (P-256) key pairs: an identity key, a signed prekey, and a one-time prekey.</p>
          </div>
          <Button onClick={bobPublishesKeys}>Bob publishes his keys</Button>
        </div>
        {bobPubs && (
          <div className="mt-4 space-y-3">
            <OutputBox label="Bob's identity key (IK_B)" value={bobPubs.ik} />
            <OutputBox label="Bob's signed prekey (SPK_B)" value={bobPubs.spk} />
            <OutputBox label="Bob's one-time prekey (OPK_B)" value={bobPubs.opk} />
          </div>
        )}
      </Panel>

      <Panel>
        <p className="mb-3 text-sm font-medium text-foreground">
          2. Alice comes online and computes a shared secret — Bob still isn&apos;t here
        </p>
        <Button onClick={aliceComputesSecret} disabled={!bobKeys}>
          Alice fetches the bundle &amp; derives the secret
        </Button>
        {aliceSecret && <div className="mt-4"><OutputBox label="Secret, as computed by Alice" value={aliceSecret} /></div>}
      </Panel>

      <Panel>
        <p className="mb-3 text-sm font-medium text-foreground">3. Bob comes back online</p>
        <Button onClick={bobComputesSecret} disabled={!aliceSecret}>
          Bob derives the same secret
        </Button>
        {bobSecret && (
          <div className="mt-4">
            <OutputBox label="Secret, as computed by Bob" value={bobSecret} tone={bobSecret === aliceSecret ? "success" : "error"} />
          </div>
        )}
        {status && <div className="mt-4"><StatusBanner tone={status.tone}>{status.text}</StatusBanner></div>}
      </Panel>
    </div>
  );
}
