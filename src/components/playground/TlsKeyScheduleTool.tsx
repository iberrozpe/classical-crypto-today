"use client";

import { useState } from "react";
import { Field, TextArea, Button, OutputBox, StatusBanner, Panel } from "./ui";
import { bufToHex, hexToBuf, utf8ToBuf, bufToUtf8 } from "@/lib/webcrypto-utils";

export default function TlsKeyScheduleTool() {
  const [transcriptHashHex, setTranscriptHashHex] = useState("");
  const [clientTrafficKey, setClientTrafficKey] = useState<CryptoKey | null>(null);
  const [serverTrafficKey, setServerTrafficKey] = useState<CryptoKey | null>(null);
  const [clientKeyHex, setClientKeyHex] = useState("");
  const [serverKeyHex, setServerKeyHex] = useState("");

  const [plaintext, setPlaintext] = useState("GET /index.html HTTP/1.1");
  const [ivHex, setIvHex] = useState("");
  const [ciphertextHex, setCiphertextHex] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [status, setStatus] = useState<{ tone: "success" | "error" | "info"; text: string } | null>(
    null,
  );

  async function runHandshake() {
    const client = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, [
      "deriveBits",
    ]);
    const server = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, [
      "deriveBits",
    ]);
    const clientPub = await crypto.subtle.exportKey("raw", client.publicKey);
    const serverPub = await crypto.subtle.exportKey("raw", server.publicKey);

    // The transcript: a running hash of every handshake message exchanged so
    // far. Here, simplified to just the two Hello messages' key shares.
    const transcriptBytes = new Uint8Array(clientPub.byteLength + serverPub.byteLength);
    transcriptBytes.set(new Uint8Array(clientPub), 0);
    transcriptBytes.set(new Uint8Array(serverPub), clientPub.byteLength);
    const transcriptHash = await crypto.subtle.digest("SHA-256", transcriptBytes);

    const clientSecret = await crypto.subtle.deriveBits(
      { name: "ECDH", public: server.publicKey },
      client.privateKey,
      256,
    );
    const serverSecret = await crypto.subtle.deriveBits(
      { name: "ECDH", public: client.publicKey },
      server.privateKey,
      256,
    );

    const hkdfParams = {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(0),
      info: transcriptHash,
    };

    const clientIkm = await crypto.subtle.importKey("raw", clientSecret, "HKDF", false, [
      "deriveKey",
    ]);
    const serverIkm = await crypto.subtle.importKey("raw", serverSecret, "HKDF", false, [
      "deriveKey",
    ]);

    const clientKey = await crypto.subtle.deriveKey(
      hkdfParams,
      clientIkm,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"],
    );
    const serverKey = await crypto.subtle.deriveKey(
      hkdfParams,
      serverIkm,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"],
    );

    const clientKeyRaw = await crypto.subtle.exportKey("raw", clientKey);
    const serverKeyRaw = await crypto.subtle.exportKey("raw", serverKey);

    setTranscriptHashHex(bufToHex(transcriptHash));
    setClientTrafficKey(clientKey);
    setServerTrafficKey(serverKey);
    setClientKeyHex(bufToHex(clientKeyRaw));
    setServerKeyHex(bufToHex(serverKeyRaw));
    setCiphertextHex("");
    setDecrypted("");
    setStatus({
      tone: bufToHex(clientKeyRaw) === bufToHex(serverKeyRaw) ? "success" : "error",
      text:
        bufToHex(clientKeyRaw) === bufToHex(serverKeyRaw)
          ? "Client and server independently derived the identical 256-bit traffic key — real ECDH, a real transcript hash, and real HKDF, none of it transmitted."
          : "Keys don't match — this shouldn't happen with correctly generated keys.",
    });
  }

  async function encrypt() {
    if (!clientTrafficKey) return;
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      clientTrafficKey,
      utf8ToBuf(plaintext),
    );
    setIvHex(bufToHex(iv.buffer));
    setCiphertextHex(bufToHex(ct));
    setDecrypted("");
    setStatus({
      tone: "success",
      text: "Encrypted with the client's derived traffic key, exactly like any AES-GCM record.",
    });
  }

  async function serverDecrypt() {
    if (!serverTrafficKey || !ciphertextHex) return;
    try {
      const pt = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: hexToBuf(ivHex) },
        serverTrafficKey,
        hexToBuf(ciphertextHex),
      );
      setDecrypted(bufToUtf8(pt));
      setStatus({
        tone: "success",
        text: "The server decrypted it with its own independently derived key — the two sides never compared notes.",
      });
    } catch {
      setStatus({ tone: "error", text: "Decryption failed." });
    }
  }

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">1. Run the handshake</p>
            <p className="text-xs text-muted">
              Real ECDH key pairs for Client and Server, a real transcript hash, and real HKDF —
              deriving one traffic key each, independently.
            </p>
          </div>
          <Button onClick={runHandshake}>Run handshake</Button>
        </div>
        {transcriptHashHex && (
          <div className="mt-4 space-y-3">
            <OutputBox label="Transcript hash (SHA-256 of both Hello messages)" value={transcriptHashHex} />
            <OutputBox
              label="Client's derived traffic key"
              value={clientKeyHex}
              tone={clientKeyHex === serverKeyHex ? "success" : "error"}
            />
            <OutputBox
              label="Server's derived traffic key"
              value={serverKeyHex}
              tone={clientKeyHex === serverKeyHex ? "success" : "error"}
            />
          </div>
        )}
      </Panel>

      <Panel>
        <p className="mb-3 text-sm font-medium text-foreground">2. Encrypt application data (as the client)</p>
        <Field label="Plaintext">
          <TextArea rows={2} value={plaintext} onChange={(e) => setPlaintext(e.target.value)} />
        </Field>
        <div className="mt-3">
          <Button onClick={encrypt} disabled={!clientTrafficKey}>
            Encrypt with client&apos;s traffic key
          </Button>
        </div>
        {ciphertextHex && (
          <div className="mt-4 space-y-3">
            <OutputBox label="IV (hex)" value={ivHex} />
            <OutputBox label="Ciphertext + tag (hex)" value={ciphertextHex} />
          </div>
        )}
      </Panel>

      <Panel>
        <p className="mb-3 text-sm font-medium text-foreground">3. Decrypt it (as the server)</p>
        <Button onClick={serverDecrypt} disabled={!ciphertextHex}>
          Decrypt with server&apos;s traffic key
        </Button>
        {decrypted && (
          <div className="mt-4">
            <OutputBox label="Decrypted plaintext" value={decrypted} tone="success" />
          </div>
        )}
        {status && (
          <div className="mt-4">
            <StatusBanner tone={status.tone}>{status.text}</StatusBanner>
          </div>
        )}
      </Panel>
    </div>
  );
}
