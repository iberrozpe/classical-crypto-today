"use client";

import { useState } from "react";
import { Field, TextArea, TextInput, Button, OutputBox, StatusBanner, Panel } from "./ui";
import { bufToBase64, base64ToBuf, utf8ToBuf } from "@/lib/webcrypto-utils";

export default function EcdsaTool() {
  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);
  const [publicKeyB64, setPublicKeyB64] = useState("");
  const [message, setMessage] = useState("Deploy build 4471 to production");
  const [signatureB64, setSignatureB64] = useState("");

  const [verifyMessage, setVerifyMessage] = useState("");
  const [verifySignature, setVerifySignature] = useState("");
  const [result, setResult] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  async function generateKeys() {
    const kp = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["sign", "verify"],
    );
    const spki = await crypto.subtle.exportKey("spki", kp.publicKey);
    setKeyPair(kp);
    setPublicKeyB64(bufToBase64(spki));
    setSignatureB64("");
    setResult(null);
  }

  async function sign() {
    if (!keyPair) return;
    const sig = await crypto.subtle.sign(
      { name: "ECDSA", hash: "SHA-256" },
      keyPair.privateKey,
      utf8ToBuf(message),
    );
    const sigB64 = bufToBase64(sig);
    setSignatureB64(sigB64);
    setVerifyMessage(message);
    setVerifySignature(sigB64);
    setResult(null);
  }

  async function verify() {
    if (!keyPair) return;
    try {
      const valid = await crypto.subtle.verify(
        { name: "ECDSA", hash: "SHA-256" },
        keyPair.publicKey,
        base64ToBuf(verifySignature),
        utf8ToBuf(verifyMessage),
      );
      setResult(
        valid
          ? { tone: "success", text: "Valid signature — this message was signed by the holder of the matching private key, and hasn't been altered." }
          : { tone: "error", text: "Invalid signature — either the message was changed after signing, or this signature doesn't belong to this key pair." },
      );
    } catch {
      setResult({ tone: "error", text: "Couldn't verify — the signature isn't valid base64/DER for this curve." });
    }
  }

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">1. Generate a key pair</p>
            <p className="text-xs text-muted">A real P-256 (secp256r1) ECDSA key pair.</p>
          </div>
          <Button onClick={generateKeys}>Generate P-256 key pair</Button>
        </div>
        {publicKeyB64 && <div className="mt-4"><OutputBox label="Public key (SPKI, base64)" value={publicKeyB64} /></div>}
      </Panel>

      <Panel>
        <p className="mb-3 text-sm font-medium text-foreground">2. Sign a message</p>
        <Field label="Message">
          <TextArea rows={2} value={message} onChange={(e) => setMessage(e.target.value)} />
        </Field>
        <div className="mt-3">
          <Button onClick={sign} disabled={!keyPair}>Sign</Button>
        </div>
        {signatureB64 && <div className="mt-4"><OutputBox label="Signature (base64)" value={signatureB64} /></div>}
      </Panel>

      <Panel>
        <p className="mb-3 text-sm font-medium text-foreground">
          3. Verify — edit the message or signature and see what happens
        </p>
        <div className="space-y-3">
          <Field label="Message to verify">
            <TextArea rows={2} value={verifyMessage} onChange={(e) => setVerifyMessage(e.target.value)} />
          </Field>
          <Field label="Signature">
            <TextInput className="font-mono" value={verifySignature} onChange={(e) => setVerifySignature(e.target.value)} />
          </Field>
        </div>
        <div className="mt-3">
          <Button onClick={verify} disabled={!keyPair || !verifySignature}>Verify</Button>
        </div>
        {result && <div className="mt-4"><StatusBanner tone={result.tone}>{result.text}</StatusBanner></div>}
      </Panel>
    </div>
  );
}
