"use client";

import { useState } from "react";
import { Field, TextArea, Button, OutputBox, StatusBanner, Panel } from "./ui";
import { bufToBase64, base64ToBuf, bufToHex, hexToBuf, utf8ToBuf, bufToUtf8 } from "@/lib/webcrypto-utils";

export default function EnvelopeEncryptionTool() {
  const [kek, setKek] = useState<CryptoKeyPair | null>(null);
  const [dek, setDek] = useState<CryptoKey | null>(null);
  const [dekHex, setDekHex] = useState("");
  const [generating, setGenerating] = useState(false);

  const [wrappedRsaBytes, setWrappedRsaBytes] = useState<Uint8Array | null>(null);
  const [wrappedRsaB64, setWrappedRsaB64] = useState("");

  const [plaintext, setPlaintext] = useState("customer record #4471");
  const [ivHex, setIvHex] = useState("");
  const [ciphertextHex, setCiphertextHex] = useState("");
  const [decrypted, setDecrypted] = useState("");

  const [kwKey, setKwKey] = useState<CryptoKey | null>(null);
  const [wrappedKwB64, setWrappedKwB64] = useState("");
  const [wrappedKwBytes, setWrappedKwBytes] = useState(0);
  const [kwVerified, setKwVerified] = useState<boolean | null>(null);

  const [status, setStatus] = useState<{ tone: "success" | "error" | "info"; text: string } | null>(
    null,
  );

  async function generateKeys() {
    setGenerating(true);
    setStatus({ tone: "info", text: "Generating a 2048-bit RSA KEK — this can take a second." });
    const kekPair = await crypto.subtle.generateKey(
      { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
      true,
      ["wrapKey", "unwrapKey"],
    );
    const dekKey = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
      "encrypt",
      "decrypt",
    ]);
    setKek(kekPair);
    setDek(dekKey);
    setDekHex(bufToHex(await crypto.subtle.exportKey("raw", dekKey)));
    setWrappedRsaBytes(null);
    setWrappedRsaB64("");
    setCiphertextHex("");
    setDecrypted("");
    setWrappedKwB64("");
    setKwVerified(null);
    setGenerating(false);
    setStatus({ tone: "info", text: "KEK (RSA-OAEP, 2048-bit) and DEK (AES-256) generated. The DEK never gets stored anywhere except wrapped." });
  }

  async function wrapWithRsa() {
    if (!kek || !dek) return;
    const wrapped = await crypto.subtle.wrapKey("raw", dek, kek.publicKey, { name: "RSA-OAEP" });
    setWrappedRsaBytes(new Uint8Array(wrapped));
    setWrappedRsaB64(bufToBase64(wrapped));
    setStatus({
      tone: "success",
      text: `Wrapped with RSA-OAEP: ${wrapped.byteLength} bytes — exactly the 2048-bit modulus size (256 bytes), regardless of the DEK's own 256-bit size.`,
    });
  }

  async function encrypt() {
    if (!dek) return;
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, dek, utf8ToBuf(plaintext));
    setIvHex(bufToHex(iv.buffer));
    setCiphertextHex(bufToHex(ct));
    setDecrypted("");
    setStatus({ tone: "success", text: "Encrypted locally with the plaintext DEK — the KEK never touches the actual data." });
  }

  async function unwrapAndDecrypt(tamper: boolean) {
    if (!kek || !wrappedRsaBytes || !ciphertextHex) return;
    const bytes = wrappedRsaBytes.slice();
    if (tamper) bytes[0] = bytes[0] ^ 0xff;
    try {
      const unwrapped = await crypto.subtle.unwrapKey(
        "raw",
        bytes,
        kek.privateKey,
        { name: "RSA-OAEP" },
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"],
      );
      const pt = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: hexToBuf(ivHex) },
        unwrapped,
        hexToBuf(ciphertextHex),
      );
      setDecrypted(bufToUtf8(pt));
      setStatus({
        tone: "success",
        text: "Unwrapped the DEK using the KEK's private key, then decrypted with it — the KMS-equivalent key was only ever used to unwrap, never to touch the data directly.",
      });
    } catch {
      setDecrypted("");
      setStatus({
        tone: "error",
        text: tamper
          ? "Unwrap failed: RSA-OAEP's structural checks caught the corrupted wrapped bytes and refused to produce a key at all — no partial or garbled key comes out."
          : "Unwrap or decrypt failed.",
      });
    }
  }

  async function wrapWithAesKw() {
    if (!dek) return;
    const kw = await crypto.subtle.generateKey({ name: "AES-KW", length: 256 }, true, [
      "wrapKey",
      "unwrapKey",
    ]);
    const wrapped = await crypto.subtle.wrapKey("raw", dek, kw, "AES-KW");
    setKwKey(kw);
    setWrappedKwB64(bufToBase64(wrapped));
    setWrappedKwBytes(wrapped.byteLength);
    setKwVerified(null);
    setStatus({
      tone: "success",
      text: `Wrapped the same DEK with AES-KW instead: ${wrapped.byteLength} bytes — the DEK's 32 bytes plus AES-KW's fixed 8-byte integrity check, always.`,
    });
  }

  async function unwrapAesKwAndVerify() {
    if (!kwKey || !wrappedKwB64 || !dekHex) return;
    try {
      const unwrapped = await crypto.subtle.unwrapKey(
        "raw",
        base64ToBuf(wrappedKwB64),
        kwKey,
        "AES-KW",
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"],
      );
      const raw = await crypto.subtle.exportKey("raw", unwrapped);
      const matches = bufToHex(raw) === dekHex;
      setKwVerified(matches);
      setStatus({
        tone: matches ? "success" : "error",
        text: matches
          ? "Unwrapped with AES-KW and the recovered key matches the original DEK exactly — a full round trip with a completely different wrapping algorithm."
          : "Unwrapped key doesn't match — this shouldn't happen with correctly generated keys.",
      });
    } catch {
      setKwVerified(false);
      setStatus({ tone: "error", text: "AES-KW unwrap failed." });
    }
  }

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">1. Generate a KEK and a DEK</p>
            <p className="text-xs text-muted">
              A real RSA-OAEP key pair standing in for a KMS master key, and a real AES-256 key
              standing in for a per-object data key.
            </p>
          </div>
          <Button onClick={generateKeys} disabled={generating}>
            {generating ? "Generating…" : "Generate KEK & DEK"}
          </Button>
        </div>
        {dekHex && (
          <div className="mt-4 space-y-3">
            <OutputBox label="DEK (raw, hex) — normally never displayed like this" value={dekHex} />
          </div>
        )}
      </Panel>

      {dek && (
        <Panel>
          <p className="mb-3 text-sm font-medium text-foreground">2. Wrap the DEK with the KEK (RSA-OAEP)</p>
          <Button onClick={wrapWithRsa}>Wrap DEK</Button>
          {wrappedRsaB64 && (
            <div className="mt-4">
              <OutputBox label={`Wrapped DEK (base64, ${wrappedRsaBytes?.byteLength ?? 0} bytes)`} value={wrappedRsaB64} />
            </div>
          )}
        </Panel>
      )}

      {wrappedRsaB64 && (
        <Panel>
          <p className="mb-3 text-sm font-medium text-foreground">
            3. Encrypt data with the DEK — this is what actually gets stored, alongside the wrapped DEK
          </p>
          <Field label="Plaintext">
            <TextArea rows={2} value={plaintext} onChange={(e) => setPlaintext(e.target.value)} />
          </Field>
          <div className="mt-3">
            <Button onClick={encrypt}>Encrypt</Button>
          </div>
          {ciphertextHex && (
            <div className="mt-4 space-y-3">
              <OutputBox label="IV (hex)" value={ivHex} />
              <OutputBox label="Ciphertext + tag (hex)" value={ciphertextHex} />
            </div>
          )}
        </Panel>
      )}

      {ciphertextHex && (
        <Panel>
          <p className="mb-3 text-sm font-medium text-foreground">4. Unwrap the DEK and decrypt</p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => unwrapAndDecrypt(false)}>Unwrap DEK &amp; decrypt</Button>
            <Button variant="secondary" onClick={() => unwrapAndDecrypt(true)}>
              Tamper with wrapped DEK, then try
            </Button>
          </div>
          {decrypted && (
            <div className="mt-4">
              <OutputBox label="Decrypted plaintext" value={decrypted} tone="success" />
            </div>
          )}
        </Panel>
      )}

      {dek && (
        <Panel>
          <p className="mb-3 text-sm font-medium text-foreground">
            5. The symmetric alternative: wrap the same DEK with AES Key Wrap (RFC 3394)
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={wrapWithAesKw}>Generate wrapping key &amp; wrap with AES-KW</Button>
            {wrappedKwB64 && (
              <Button variant="secondary" onClick={unwrapAesKwAndVerify}>
                Unwrap &amp; verify it matches the original DEK
              </Button>
            )}
          </div>
          {wrappedKwB64 && (
            <div className="mt-4 space-y-3">
              <OutputBox label={`Wrapped DEK via AES-KW (base64, ${wrappedKwBytes} bytes — 32-byte key + 8-byte overhead)`} value={wrappedKwB64} />
              {kwVerified !== null && (
                <StatusBanner tone={kwVerified ? "success" : "error"}>
                  {kwVerified ? "Round trip verified — the unwrapped key is byte-for-byte identical to the original DEK." : "Round trip failed."}
                </StatusBanner>
              )}
            </div>
          )}
        </Panel>
      )}

      {status && <StatusBanner tone={status.tone}>{status.text}</StatusBanner>}
    </div>
  );
}
