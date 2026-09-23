"use client";

import { useState } from "react";
import { Field, TextArea, TextInput, Button, OutputBox, StatusBanner, Panel } from "./ui";
import { bufToBase64Url, base64UrlToBuf, utf8ToBuf, bufToUtf8 } from "@/lib/webcrypto-utils";

async function hmacSign(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    utf8ToBuf(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, utf8ToBuf(data));
  return bufToBase64Url(sig);
}

export default function JwtTool() {
  const [claims, setClaims] = useState('{\n  "sub": "1234567890",\n  "name": "Alice",\n  "iat": 1516239022\n}');
  const [buildSecret, setBuildSecret] = useState("supersecretkey");
  const [token, setToken] = useState("");
  const [buildError, setBuildError] = useState("");

  const [decodeToken, setDecodeToken] = useState("");
  const [decodeSecret, setDecodeSecret] = useState("");
  const [decodedHeader, setDecodedHeader] = useState("");
  const [decodedPayload, setDecodedPayload] = useState("");
  const [verifyResult, setVerifyResult] = useState<{ tone: "success" | "error" | "info"; text: string } | null>(
    null,
  );

  async function build() {
    setBuildError("");
    try {
      const parsed = JSON.parse(claims);
      const header = { alg: "HS256", typ: "JWT" };
      const headerB64 = bufToBase64Url(utf8ToBuf(JSON.stringify(header)).buffer);
      const payloadB64 = bufToBase64Url(utf8ToBuf(JSON.stringify(parsed)).buffer);
      const signingInput = `${headerB64}.${payloadB64}`;
      const sig = await hmacSign(buildSecret, signingInput);
      const fullToken = `${signingInput}.${sig}`;
      setToken(fullToken);
      setDecodeToken(fullToken);
      setDecodeSecret(buildSecret);
    } catch {
      setBuildError("Claims must be valid JSON.");
    }
  }

  function decode() {
    setVerifyResult(null);
    const parts = decodeToken.trim().split(".");
    if (parts.length !== 3) {
      setDecodedHeader("");
      setDecodedPayload("");
      setVerifyResult({ tone: "error", text: "Not a valid JWT — expected three dot-separated segments." });
      return;
    }
    try {
      setDecodedHeader(JSON.stringify(JSON.parse(bufToUtf8(base64UrlToBuf(parts[0]).buffer)), null, 2));
      setDecodedPayload(JSON.stringify(JSON.parse(bufToUtf8(base64UrlToBuf(parts[1]).buffer)), null, 2));
    } catch {
      setVerifyResult({ tone: "error", text: "Couldn't decode — the header or payload isn't valid base64url JSON." });
    }
  }

  async function verifySignature() {
    const parts = decodeToken.trim().split(".");
    if (parts.length !== 3) return;
    const expected = await hmacSign(decodeSecret, `${parts[0]}.${parts[1]}`);
    setVerifyResult(
      expected === parts[2]
        ? { tone: "success", text: "Signature valid — this token was signed with this exact secret and hasn't been altered." }
        : { tone: "error", text: "Signature invalid — either the secret is wrong, or the token's header/payload was modified after signing." },
    );
  }

  return (
    <div className="space-y-6">
      <Panel>
        <p className="mb-3 text-sm font-medium text-foreground">1. Build a token</p>
        <div className="space-y-3">
          <Field label="Claims (JSON)">
            <TextArea rows={5} value={claims} onChange={(e) => setClaims(e.target.value)} />
          </Field>
          <Field label="HMAC secret">
            <TextInput value={buildSecret} onChange={(e) => setBuildSecret(e.target.value)} />
          </Field>
        </div>
        <div className="mt-3">
          <Button onClick={build}>Build HS256 token</Button>
        </div>
        {buildError && <p className="mt-2 text-sm text-red-400">{buildError}</p>}
        {token && <div className="mt-4"><OutputBox label="Token" value={token} /></div>}
      </Panel>

      <Panel>
        <p className="mb-3 text-sm font-medium text-foreground">2. Decode &amp; verify any token</p>
        <Field label="Token">
          <TextArea rows={3} value={decodeToken} onChange={(e) => setDecodeToken(e.target.value)} />
        </Field>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button onClick={decode} disabled={!decodeToken}>Decode</Button>
        </div>
        {(decodedHeader || decodedPayload) && (
          <div className="mt-4 space-y-3">
            <OutputBox label="Header" value={decodedHeader} />
            <OutputBox label="Payload" value={decodedPayload} />
          </div>
        )}
        <div className="mt-4">
          <Field label="Secret to verify against">
            <TextInput value={decodeSecret} onChange={(e) => setDecodeSecret(e.target.value)} />
          </Field>
          <div className="mt-3">
            <Button variant="secondary" onClick={verifySignature} disabled={!decodeToken || !decodeSecret}>
              Verify signature
            </Button>
          </div>
        </div>
        {verifyResult && <div className="mt-4"><StatusBanner tone={verifyResult.tone}>{verifyResult.text}</StatusBanner></div>}
      </Panel>
    </div>
  );
}
