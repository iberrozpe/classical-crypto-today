"use client";

import { useState } from "react";
import { Button, StatusBanner, Panel } from "./ui";
import { bufToBase64, base64ToBuf, utf8ToBuf } from "@/lib/webcrypto-utils";

interface Cert {
  subject: string;
  issuer: string;
  publicKeyB64: string;
  signatureB64: string;
}

function canonical(c: Pick<Cert, "subject" | "issuer" | "publicKeyB64">): string {
  return JSON.stringify({ subject: c.subject, issuer: c.issuer, publicKey: c.publicKeyB64 });
}

async function genKeyPair() {
  return crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
}

async function sign(privateKey: CryptoKey, data: string): Promise<string> {
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, privateKey, utf8ToBuf(data));
  return bufToBase64(sig);
}

async function verify(publicKey: CryptoKey, data: string, sigB64: string): Promise<boolean> {
  return crypto.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    publicKey,
    base64ToBuf(sigB64),
    utf8ToBuf(data),
  );
}

type LinkStatus = "pending" | "signature-valid" | "revoked" | "trusted";

export default function CertRevocationTool() {
  const [rootKeys, setRootKeys] = useState<CryptoKeyPair | null>(null);
  const [intKeys, setIntKeys] = useState<CryptoKeyPair | null>(null);

  const [rootCert, setRootCert] = useState<Cert | null>(null);
  const [intCert, setIntCert] = useState<Cert | null>(null);
  const [leafCert, setLeafCert] = useState<Cert | null>(null);

  const [revoked, setRevoked] = useState<Set<"root" | "intermediate" | "leaf">>(new Set());
  const [results, setResults] = useState<Record<"root" | "intermediate" | "leaf", LinkStatus>>({
    root: "pending",
    intermediate: "pending",
    leaf: "pending",
  });
  const [generating, setGenerating] = useState(false);

  async function generateChain() {
    setGenerating(true);
    const root = await genKeyPair();
    const inter = await genKeyPair();
    const leaf = await genKeyPair();

    const rootPub = bufToBase64(await crypto.subtle.exportKey("spki", root.publicKey));
    const interPub = bufToBase64(await crypto.subtle.exportKey("spki", inter.publicKey));
    const leafPub = bufToBase64(await crypto.subtle.exportKey("spki", leaf.publicKey));

    const rootC: Cert = { subject: "Root CA", issuer: "Root CA", publicKeyB64: rootPub, signatureB64: "" };
    rootC.signatureB64 = await sign(root.privateKey, canonical(rootC));

    const interC: Cert = { subject: "Intermediate CA", issuer: "Root CA", publicKeyB64: interPub, signatureB64: "" };
    interC.signatureB64 = await sign(root.privateKey, canonical(interC));

    const leafC: Cert = { subject: "example.com", issuer: "Intermediate CA", publicKeyB64: leafPub, signatureB64: "" };
    leafC.signatureB64 = await sign(inter.privateKey, canonical(leafC));

    setRootKeys(root);
    setIntKeys(inter);
    setRootCert(rootC);
    setIntCert(interC);
    setLeafCert(leafC);
    setRevoked(new Set());
    setResults({ root: "pending", intermediate: "pending", leaf: "pending" });
    setGenerating(false);
  }

  async function verifyChain() {
    if (!rootKeys || !intKeys || !rootCert || !intCert || !leafCert) return;
    const rootSigOk = await verify(rootKeys.publicKey, canonical(rootCert), rootCert.signatureB64);
    const interSigOk = await verify(rootKeys.publicKey, canonical(intCert), intCert.signatureB64);
    const leafSigOk = await verify(intKeys.publicKey, canonical(leafCert), leafCert.signatureB64);

    // Signature validity and revocation are two entirely separate checks —
    // a cert (or anything above it in the chain) being revoked doesn't
    // touch whether its signature is mathematically valid.
    function statusFor(sigOk: boolean, key: "root" | "intermediate" | "leaf", ancestors: ("root" | "intermediate" | "leaf")[]): LinkStatus {
      if (!sigOk) return "pending";
      const chainRevoked = [key, ...ancestors].some((k) => revoked.has(k));
      return chainRevoked ? "revoked" : "trusted";
    }

    setResults({
      root: statusFor(rootSigOk, "root", []),
      intermediate: statusFor(interSigOk, "intermediate", ["root"]),
      leaf: statusFor(leafSigOk, "leaf", ["root", "intermediate"]),
    });
  }

  function toggleRevoke(key: "root" | "intermediate" | "leaf") {
    setRevoked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setResults({ root: "pending", intermediate: "pending", leaf: "pending" });
  }

  function statusColor(s: LinkStatus) {
    if (s === "trusted") return "border-accent text-accent";
    if (s === "revoked") return "border-red-500/60 text-red-400";
    return "border-border text-muted";
  }

  function statusLabel(s: LinkStatus) {
    if (s === "trusted") return "✓ signature valid · not revoked · trusted";
    if (s === "revoked") return "✓ signature valid · ✗ revoked somewhere in chain · not trusted";
    return "not yet checked";
  }

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">1. Generate a three-link chain</p>
            <p className="text-xs text-muted">
              The same real ECDSA root → intermediate → leaf chain as the certificate chain
              builder — nothing about the signing changes here.
            </p>
          </div>
          <Button onClick={generateChain} disabled={generating}>
            {generating ? "Generating…" : "Generate root → intermediate → leaf"}
          </Button>
        </div>
      </Panel>

      {rootCert && intCert && leafCert && (
        <Panel>
          <p className="mb-3 text-sm font-medium text-foreground">2. Revoke a link, then verify the chain</p>
          <div className="space-y-3">
            {[
              { label: "Root CA (self-signed)", key: "root" as const },
              { label: "Intermediate CA (signed by root)", key: "intermediate" as const },
              { label: "Leaf certificate (signed by intermediate)", key: "leaf" as const },
            ].map(({ label, key }) => (
              <div key={key} className={`rounded-md border bg-background p-4 ${statusColor(results[key])}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {label} {revoked.has(key) && <span className="text-red-400">(revoked)</span>}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs">{statusLabel(results[key])}</span>
                    <Button variant="secondary" onClick={() => toggleRevoke(key)}>
                      {revoked.has(key) ? "Un-revoke" : "Revoke"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button onClick={verifyChain}>Verify chain (signature + revocation)</Button>
          </div>
          {results.leaf === "revoked" && (
            <div className="mt-4">
              <StatusBanner tone="error">
                The leaf&apos;s signature is still perfectly valid — nothing was tampered with —
                but something above it in the chain is revoked, so the leaf is not trusted.
                Revoking the intermediate blocks trust for every certificate it ever issued,
                without touching the root or the leaf&apos;s own signature at all.
              </StatusBanner>
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}
