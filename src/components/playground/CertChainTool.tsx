"use client";

import { useState } from "react";
import { Button, TextInput, Field, StatusBanner, Panel } from "./ui";
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

type LinkStatus = "pending" | "valid" | "invalid";

export default function CertChainTool() {
  const [rootKeys, setRootKeys] = useState<CryptoKeyPair | null>(null);
  const [intKeys, setIntKeys] = useState<CryptoKeyPair | null>(null);

  const [rootCert, setRootCert] = useState<Cert | null>(null);
  const [intCert, setIntCert] = useState<Cert | null>(null);
  const [leafCert, setLeafCert] = useState<Cert | null>(null);
  const [leafSubject, setLeafSubject] = useState("example.com");

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
    rootC.signatureB64 = await sign(root.privateKey, canonical(rootC)); // self-signed

    const interC: Cert = { subject: "Intermediate CA", issuer: "Root CA", publicKeyB64: interPub, signatureB64: "" };
    interC.signatureB64 = await sign(root.privateKey, canonical(interC)); // signed by root

    const leafC: Cert = { subject: leafSubject, issuer: "Intermediate CA", publicKeyB64: leafPub, signatureB64: "" };
    leafC.signatureB64 = await sign(inter.privateKey, canonical(leafC)); // signed by intermediate

    setRootKeys(root);
    setIntKeys(inter);
    setRootCert(rootC);
    setIntCert(interC);
    setLeafCert(leafC);
    setResults({ root: "pending", intermediate: "pending", leaf: "pending" });
    setGenerating(false);
  }

  async function verifyChain() {
    if (!rootKeys || !intKeys || !rootCert || !intCert || !leafCert) return;
    const rootOk = await verify(rootKeys.publicKey, canonical(rootCert), rootCert.signatureB64);
    const interOk = await verify(rootKeys.publicKey, canonical(intCert), intCert.signatureB64);
    const leafOk = await verify(intKeys.publicKey, canonical(leafCert), leafCert.signatureB64);
    setResults({
      root: rootOk ? "valid" : "invalid",
      intermediate: interOk ? "valid" : "invalid",
      leaf: leafOk ? "valid" : "invalid",
    });
  }

  function tamperLeaf() {
    if (!leafCert) return;
    setLeafCert({ ...leafCert, subject: "evil-" + leafCert.subject });
    setResults((r) => ({ ...r, leaf: "pending" }));
  }

  function statusColor(s: LinkStatus) {
    if (s === "valid") return "border-accent text-accent";
    if (s === "invalid") return "border-red-500/60 text-red-400";
    return "border-border text-muted";
  }

  function statusLabel(s: LinkStatus) {
    if (s === "valid") return "✓ signature valid";
    if (s === "invalid") return "✗ signature invalid";
    return "not yet checked";
  }

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">1. Generate a three-link chain</p>
            <p className="text-xs text-muted">
              Real ECDSA P-256 key pairs for a root CA, an intermediate CA, and a leaf certificate —
              each parent signs its child&apos;s identity + public key, exactly like the chain of
              trust module describes.
            </p>
          </div>
          <Button onClick={generateChain} disabled={generating}>
            {generating ? "Generating…" : "Generate root → intermediate → leaf"}
          </Button>
        </div>

        {leafCert && (
          <div className="mt-4">
            <Field label="Leaf subject" hint="Regenerate the chain to apply a change">
              <TextInput value={leafSubject} onChange={(e) => setLeafSubject(e.target.value)} />
            </Field>
          </div>
        )}
      </Panel>

      {rootCert && intCert && leafCert && (
        <Panel>
          <p className="mb-3 text-sm font-medium text-foreground">2. The chain</p>
          <div className="space-y-3">
            {[
              { label: "Root CA (self-signed)", cert: rootCert, key: "root" as const },
              { label: "Intermediate CA (signed by root)", cert: intCert, key: "intermediate" as const },
              { label: "Leaf certificate (signed by intermediate)", cert: leafCert, key: "leaf" as const },
            ].map(({ label, cert, key }) => (
              <div key={key} className={`rounded-md border bg-background p-4 ${statusColor(results[key])}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-sm font-semibold text-foreground">{label}</span>
                  <span className="text-xs">{statusLabel(results[key])}</span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  subject: <span className="text-foreground">{cert.subject}</span> · issuer:{" "}
                  <span className="text-foreground">{cert.issuer}</span>
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={verifyChain}>Verify the chain</Button>
            <Button variant="secondary" onClick={tamperLeaf}>
              Tamper with the leaf&apos;s subject (no re-signing)
            </Button>
          </div>
          {results.leaf === "invalid" && (
            <div className="mt-4">
              <StatusBanner tone="error">
                The leaf&apos;s signature no longer matches its (now-tampered) subject — exactly
                the check that stops an attacker from editing a certificate after it was issued.
              </StatusBanner>
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}
