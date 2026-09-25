"use client";

import { useState } from "react";
import { Field, TextInput, Button, OutputBox, StatusBanner, Panel } from "./ui";
import { bufToHex, utf8ToBuf } from "@/lib/webcrypto-utils";

type SessionState = "closed" | "open" | "loggedIn";

export default function Pkcs11SessionTool() {
  const [session, setSession] = useState<SessionState>("closed");

  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);
  const [generating, setGenerating] = useState(false);

  const [message, setMessage] = useState("transfer $10,000 to account 44-1122");
  const [signatureHex, setSignatureHex] = useState("");
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [verifyMessage, setVerifyMessage] = useState("");

  const [wrapError, setWrapError] = useState("");
  const [wrapAttempted, setWrapAttempted] = useState(false);

  const [dataKeyWrappedB64, setDataKeyWrappedB64] = useState("");
  const [dataKeyRoundTrip, setDataKeyRoundTrip] = useState<boolean | null>(null);

  const [status, setStatus] = useState<{ tone: "success" | "error" | "info"; text: string } | null>(
    null,
  );

  function openSession() {
    setSession("open");
    setStatus({ tone: "info", text: "C_OpenSession — session open, but not yet authenticated. Public objects would be visible; there aren't any here yet." });
  }

  function login() {
    setSession("loggedIn");
    setStatus({ tone: "success", text: "C_Login(CKU_USER) — session authenticated. Private and secret object operations are now permitted." });
  }

  async function generateKeyPair() {
    setGenerating(true);
    setStatus({ tone: "info", text: "C_GenerateKeyPair(CKM_ECDSA_KEY_PAIR_GEN) — generating a real P-256 key pair." });
    const pair = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign", "verify"],
    );
    setKeyPair(pair);
    setSignatureHex("");
    setVerifyResult(null);
    setWrapError("");
    setWrapAttempted(false);
    setGenerating(false);
    setStatus({
      tone: "success",
      text: "Key pair generated with extractable = false — the browser's own equivalent of CKA_EXTRACTABLE = false. Both handles returned; no key bytes ever touched this page's variables.",
    });
  }

  async function sign() {
    if (!keyPair) return;
    const sig = await crypto.subtle.sign(
      { name: "ECDSA", hash: "SHA-256" },
      keyPair.privateKey,
      utf8ToBuf(message),
    );
    setSignatureHex(bufToHex(sig));
    setVerifyResult(null);
    setStatus({ tone: "success", text: "C_SignInit + C_Sign — signed using the private key handle. Using a non-extractable key for its intended operation is exactly what CKA_EXTRACTABLE is meant to still allow." });
  }

  async function verify(tamper: boolean) {
    if (!keyPair || !signatureHex) return;
    const data = utf8ToBuf(tamper ? message + " " : message);
    const sigBytes = new Uint8Array(signatureHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
    const ok = await crypto.subtle.verify(
      { name: "ECDSA", hash: "SHA-256" },
      keyPair.publicKey,
      sigBytes,
      data,
    );
    setVerifyResult(ok);
    setVerifyMessage(tamper ? message + " (tampered — one trailing space added)" : message);
    setStatus({
      tone: ok ? "success" : "error",
      text: ok ? "C_VerifyInit + C_Verify — signature valid." : "C_Verify — signature rejected, as expected for tampered data.",
    });
  }

  async function attemptWrapPrivateKey() {
    if (!keyPair) return;
    setWrapAttempted(true);
    try {
      const wrappingKey = await crypto.subtle.generateKey({ name: "AES-KW", length: 256 }, false, [
        "wrapKey",
        "unwrapKey",
      ]);
      await crypto.subtle.wrapKey("pkcs8", keyPair.privateKey, wrappingKey, "AES-KW");
      // Should never reach here — extractable: false must block this.
      setWrapError("");
      setStatus({ tone: "error", text: "Unexpected: wrapKey succeeded. This should never happen for a non-extractable key." });
    } catch (e) {
      const err = e as DOMException;
      setWrapError(`${err.name}: ${err.message}`);
      setStatus({
        tone: "error",
        text: "C_WrapKey refused — the real equivalent of CKR_KEY_UNEXTRACTABLE. The browser enforced this itself; nothing in this tool's code checked or blocked it.",
      });
    }
  }

  async function wrapExtractableDataKey() {
    const dataKey = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
      "encrypt",
      "decrypt",
    ]);
    const wrappingKey = await crypto.subtle.generateKey({ name: "AES-KW", length: 256 }, false, [
      "wrapKey",
      "unwrapKey",
    ]);
    const wrapped = await crypto.subtle.wrapKey("raw", dataKey, wrappingKey, "AES-KW");
    const rawOriginal = bufToHex(await crypto.subtle.exportKey("raw", dataKey));

    const unwrapped = await crypto.subtle.unwrapKey(
      "raw",
      wrapped,
      wrappingKey,
      "AES-KW",
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"],
    );
    const rawRoundTrip = bufToHex(await crypto.subtle.exportKey("raw", unwrapped));

    setDataKeyWrappedB64(bufToHex(wrapped));
    setDataKeyRoundTrip(rawOriginal === rawRoundTrip);
    setStatus({
      tone: "success",
      text: "A separate, extractable AES data key wrapped and unwrapped successfully — this is the pattern a real deployment uses to move key material: never make the long-lived signing key extractable, wrap only short-lived session keys instead.",
    });
  }

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">1. C_OpenSession + C_Login</p>
            <p className="text-xs text-muted">Every Cryptoki interaction starts by opening a session, then authenticating it.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={openSession} disabled={session !== "closed"}>
              Open session
            </Button>
            <Button onClick={login} disabled={session !== "open"} variant="secondary">
              Login (CKU_USER)
            </Button>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">
          Session state: <span className="font-mono text-foreground">{session}</span>
        </p>
      </Panel>

      {session === "loggedIn" && (
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">2. C_GenerateKeyPair(CKM_ECDSA_KEY_PAIR_GEN)</p>
              <p className="text-xs text-muted">
                A real P-256 key pair, created with extractable = false — the private key can never be
                exported or wrapped, by anyone, from this point on.
              </p>
            </div>
            <Button onClick={generateKeyPair} disabled={generating}>
              {generating ? "Generating…" : "Generate key pair"}
            </Button>
          </div>
        </Panel>
      )}

      {keyPair && (
        <Panel>
          <p className="mb-3 text-sm font-medium text-foreground">3. C_SignInit + C_Sign — sign with the private key handle</p>
          <Field label="Data to sign">
            <TextInput value={message} onChange={(e) => setMessage(e.target.value)} />
          </Field>
          <div className="mt-3">
            <Button onClick={sign}>Sign</Button>
          </div>
          {signatureHex && (
            <div className="mt-4 space-y-3">
              <OutputBox label="Signature (hex)" value={signatureHex} />
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => verify(false)}>
                  C_Verify (correct data)
                </Button>
                <Button variant="secondary" onClick={() => verify(true)}>
                  C_Verify (tampered data)
                </Button>
              </div>
              {verifyResult !== null && (
                <StatusBanner tone={verifyResult ? "success" : "error"}>
                  {verifyResult ? "Valid" : "Invalid"} — verified &quot;{verifyMessage}&quot;
                </StatusBanner>
              )}
            </div>
          )}
        </Panel>
      )}

      {keyPair && signatureHex && (
        <Panel>
          <p className="mb-3 text-sm font-medium text-foreground">
            4. Attempt C_WrapKey on the private key handle
          </p>
          <p className="mb-3 text-xs text-muted">
            This is the attack surface the PKCS#11 use case describes: can this &quot;sensitive&quot;
            key be extracted, even wrapped? extractable = false should refuse it.
          </p>
          <Button onClick={attemptWrapPrivateKey}>Attempt C_WrapKey</Button>
          {wrapAttempted && (
            <div className="mt-4">
              {wrapError ? (
                <OutputBox label="Refused — real browser exception" value={wrapError} tone="error" />
              ) : (
                <StatusBanner tone="error">Unexpected success — see status above.</StatusBanner>
              )}
            </div>
          )}
        </Panel>
      )}

      {wrapAttempted && (
        <Panel>
          <p className="mb-3 text-sm font-medium text-foreground">
            5. The correct pattern: wrap a separate, extractable data key instead
          </p>
          <Button onClick={wrapExtractableDataKey}>Generate &amp; wrap an extractable AES data key</Button>
          {dataKeyWrappedB64 && (
            <div className="mt-4 space-y-3">
              <OutputBox label="Wrapped data key (hex)" value={dataKeyWrappedB64} />
              {dataKeyRoundTrip !== null && (
                <StatusBanner tone={dataKeyRoundTrip ? "success" : "error"}>
                  {dataKeyRoundTrip
                    ? "Unwrapped successfully — byte-for-byte identical to the original. This key was always meant to leave the token; the signing key never is."
                    : "Round trip failed."}
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
