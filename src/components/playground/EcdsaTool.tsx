"use client";

import { useState } from "react";
import { Field, TextArea, TextInput, Button, OutputBox, StatusBanner, Panel } from "./ui";
import { bufToBase64, base64ToBuf, utf8ToBuf } from "@/lib/webcrypto-utils";

async function importEcdsaPublicKey(spkiB64: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "spki",
    base64ToBuf(spkiB64.trim()),
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["verify"],
  );
}

export default function EcdsaTool() {
  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);
  const [publicKeyB64, setPublicKeyB64] = useState("");
  const [privateKeyB64, setPrivateKeyB64] = useState("");
  const [message, setMessage] = useState("Deploy build 4471 to production");
  const [signatureB64, setSignatureB64] = useState("");

  const [verifyMessage, setVerifyMessage] = useState("");
  const [verifySignature, setVerifySignature] = useState("");
  const [verifyPublicKeyB64, setVerifyPublicKeyB64] = useState("");
  const [result, setResult] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  async function generateKeys() {
    const kp = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["sign", "verify"],
    );
    const spki = await crypto.subtle.exportKey("spki", kp.publicKey);
    const pkcs8 = await crypto.subtle.exportKey("pkcs8", kp.privateKey);
    setKeyPair(kp);
    setPublicKeyB64(bufToBase64(spki));
    setPrivateKeyB64(bufToBase64(pkcs8));
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
    setVerifyPublicKeyB64(publicKeyB64);
    setResult(null);
  }

  async function useWrongKeyForVerify() {
    const wrongPair = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["sign", "verify"],
    );
    const spki = await crypto.subtle.exportKey("spki", wrongPair.publicKey);
    setVerifyPublicKeyB64(bufToBase64(spki));
    setResult(null);
  }

  async function verify() {
    try {
      const key = await importEcdsaPublicKey(verifyPublicKeyB64);
      const valid = await crypto.subtle.verify(
        { name: "ECDSA", hash: "SHA-256" },
        key,
        base64ToBuf(verifySignature),
        utf8ToBuf(verifyMessage),
      );
      setResult(
        valid
          ? { tone: "success", text: "Valid signature — this message was signed by the holder of the matching private key, and hasn't been altered." }
          : { tone: "error", text: "Invalid signature — the message changed, the signature doesn't match, or this public key belongs to a different key pair." },
      );
    } catch {
      setResult({ tone: "error", text: "Couldn't verify — the public key or signature isn't valid for this curve." });
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
        {publicKeyB64 && (
          <div className="mt-4 space-y-3">
            <OutputBox label="Public key (SPKI, base64)" value={publicKeyB64} />
            <OutputBox label="Private key (PKCS8, base64)" value={privateKeyB64} />
          </div>
        )}
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
          3. Verify — edit the message, signature, or public key and see what happens
        </p>
        <div className="space-y-3">
          <Field label="Message to verify">
            <TextArea rows={2} value={verifyMessage} onChange={(e) => setVerifyMessage(e.target.value)} />
          </Field>
          <Field label="Signature">
            <TextInput className="font-mono" value={verifySignature} onChange={(e) => setVerifySignature(e.target.value)} />
          </Field>
          <Field label="Public key (SPKI, base64)" hint="Edit this, or use the button below, to verify against the wrong key">
            <TextArea rows={3} value={verifyPublicKeyB64} onChange={(e) => setVerifyPublicKeyB64(e.target.value)} />
          </Field>
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button onClick={verify} disabled={!verifySignature || !verifyPublicKeyB64}>Verify</Button>
          <Button variant="secondary" onClick={useWrongKeyForVerify} disabled={!signatureB64}>
            Swap in a different (wrong) public key
          </Button>
        </div>
        {result && <div className="mt-4"><StatusBanner tone={result.tone}>{result.text}</StatusBanner></div>}
      </Panel>
    </div>
  );
}
