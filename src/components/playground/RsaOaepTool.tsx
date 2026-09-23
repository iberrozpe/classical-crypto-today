"use client";

import { useState } from "react";
import { Field, TextArea, Button, OutputBox, StatusBanner, Panel } from "./ui";
import { bufToBase64, base64ToBuf, utf8ToBuf, bufToUtf8 } from "@/lib/webcrypto-utils";

export default function RsaOaepTool() {
  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);
  const [publicKeyB64, setPublicKeyB64] = useState("");
  const [generating, setGenerating] = useState(false);
  const [plaintext, setPlaintext] = useState("The key exchange problem, solved with math.");
  const [ciphertextB64, setCiphertextB64] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [status, setStatus] = useState<{ tone: "success" | "error" | "info"; text: string } | null>(
    null,
  );

  async function generateKeys() {
    setGenerating(true);
    setStatus({ tone: "info", text: "Generating a 2048-bit RSA key pair — this can take a second." });
    const kp = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"],
    );
    const spki = await crypto.subtle.exportKey("spki", kp.publicKey);
    setKeyPair(kp);
    setPublicKeyB64(bufToBase64(spki));
    setCiphertextB64("");
    setDecrypted("");
    setGenerating(false);
    setStatus({ tone: "success", text: "Key pair generated. The public key (SPKI, base64) is below — the private key never leaves this component." });
  }

  async function encrypt() {
    if (!keyPair) return;
    try {
      const ct = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        keyPair.publicKey,
        utf8ToBuf(plaintext),
      );
      setCiphertextB64(bufToBase64(ct));
      setDecrypted("");
      setStatus({ tone: "success", text: "Encrypted with the public key using RSA-OAEP." });
    } catch {
      setStatus({ tone: "error", text: "Message too long for this key size — RSA-OAEP with a 2048-bit key and SHA-256 can encrypt at most ~190 bytes." });
    }
  }

  async function decrypt() {
    if (!keyPair || !ciphertextB64) return;
    const pt = await crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      keyPair.privateKey,
      base64ToBuf(ciphertextB64),
    );
    setDecrypted(bufToUtf8(pt));
    setStatus({ tone: "success", text: "Decrypted with the private key." });
  }

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">1. Generate a key pair</p>
            <p className="text-xs text-muted">A real 2048-bit RSA key pair, generated in your browser.</p>
          </div>
          <Button onClick={generateKeys} disabled={generating}>
            {generating ? "Generating…" : "Generate RSA-2048 key pair"}
          </Button>
        </div>
        {publicKeyB64 && <div className="mt-4"><OutputBox label="Public key (SPKI, base64)" value={publicKeyB64} /></div>}
      </Panel>

      <Panel>
        <p className="mb-3 text-sm font-medium text-foreground">2. Encrypt with the public key</p>
        <Field label="Plaintext" hint="RSA-OAEP with SHA-256 caps out around 190 bytes">
          <TextArea rows={2} value={plaintext} onChange={(e) => setPlaintext(e.target.value)} />
        </Field>
        <div className="mt-3">
          <Button onClick={encrypt} disabled={!keyPair}>Encrypt</Button>
        </div>
        {ciphertextB64 && <div className="mt-4"><OutputBox label="Ciphertext (base64)" value={ciphertextB64} /></div>}
      </Panel>

      <Panel>
        <p className="mb-3 text-sm font-medium text-foreground">3. Decrypt with the private key</p>
        <Button onClick={decrypt} disabled={!ciphertextB64}>Decrypt</Button>
        {decrypted && <div className="mt-4"><OutputBox label="Decrypted plaintext" value={decrypted} tone="success" /></div>}
        {status && <div className="mt-4"><StatusBanner tone={status.tone}>{status.text}</StatusBanner></div>}
      </Panel>
    </div>
  );
}
