"use client";

import { useState } from "react";
import { Field, TextArea, Button, OutputBox, StatusBanner, Panel } from "./ui";
import { bufToHex, hexToBuf, utf8ToBuf, bufToUtf8 } from "@/lib/webcrypto-utils";

export default function AesGcmTool() {
  const [plaintext, setPlaintext] = useState("The ciphertext running the internet, today.");
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [keyHex, setKeyHex] = useState("");
  const [ivHex, setIvHex] = useState("");
  const [ciphertextHex, setCiphertextHex] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [status, setStatus] = useState<{ tone: "success" | "error" | "info"; text: string } | null>(
    null,
  );

  async function generateKey() {
    const k = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
      "encrypt",
      "decrypt",
    ]);
    const raw = await crypto.subtle.exportKey("raw", k);
    setKey(k);
    setKeyHex(bufToHex(raw));
    setCiphertextHex("");
    setDecrypted("");
    setStatus({ tone: "info", text: "New random 256-bit AES key generated." });
  }

  async function encrypt() {
    if (!key) return;
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, utf8ToBuf(plaintext));
    setIvHex(bufToHex(iv.buffer));
    setCiphertextHex(bufToHex(ct));
    setDecrypted("");
    setStatus({ tone: "success", text: "Encrypted with AES-256-GCM. The last 16 bytes of the ciphertext are the authentication tag." });
  }

  async function decrypt(tamper: boolean) {
    if (!key || !ciphertextHex) return;
    const bytes = hexToBuf(ciphertextHex);
    if (tamper) {
      bytes[0] = bytes[0] ^ 0xff; // flip every bit of the first byte
    }
    try {
      const pt = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: hexToBuf(ivHex) },
        key,
        bytes,
      );
      setDecrypted(bufToUtf8(pt));
      setStatus({ tone: "success", text: "Decrypted successfully — the tag verified the ciphertext wasn't tampered with." });
    } catch {
      setDecrypted("");
      setStatus({
        tone: "error",
        text: tamper
          ? "Decryption failed: the authentication tag no longer matches — GCM detected the tampering and refused to return any plaintext."
          : "Decryption failed.",
      });
    }
  }

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">1. Generate a key</p>
            <p className="text-xs text-muted">A random 256-bit AES key, generated in your browser and never sent anywhere.</p>
          </div>
          <Button onClick={generateKey}>Generate AES-256 key</Button>
        </div>
        {keyHex && <div className="mt-4"><OutputBox label="Key (hex)" value={keyHex} /></div>}
      </Panel>

      <Panel>
        <p className="mb-3 text-sm font-medium text-foreground">2. Encrypt a message</p>
        <Field label="Plaintext">
          <TextArea rows={2} value={plaintext} onChange={(e) => setPlaintext(e.target.value)} />
        </Field>
        <div className="mt-3">
          <Button onClick={encrypt} disabled={!key}>Encrypt</Button>
        </div>
        {ciphertextHex && (
          <div className="mt-4 space-y-3">
            <OutputBox label="IV (nonce, hex)" value={ivHex} />
            <OutputBox label="Ciphertext + tag (hex)" value={ciphertextHex} />
          </div>
        )}
      </Panel>

      <Panel>
        <p className="mb-3 text-sm font-medium text-foreground">3. Decrypt it back</p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => decrypt(false)} disabled={!ciphertextHex}>Decrypt</Button>
          <Button variant="secondary" onClick={() => decrypt(true)} disabled={!ciphertextHex}>
            Tamper with 1 byte, then decrypt
          </Button>
        </div>
        {decrypted && <div className="mt-4"><OutputBox label="Decrypted plaintext" value={decrypted} tone="success" /></div>}
        {status && <div className="mt-4"><StatusBanner tone={status.tone}>{status.text}</StatusBanner></div>}
      </Panel>
    </div>
  );
}
