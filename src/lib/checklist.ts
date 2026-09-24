export interface ChecklistItem {
  id: string;
  label: string;
  detail?: string;
}

export interface ChecklistCategory {
  title: string;
  intro: string;
  items: ChecklistItem[];
}

export const migrationChecklist: ChecklistCategory[] = [
  {
    title: "1. Discover where classical crypto actually runs",
    intro: "You can't migrate what you haven't found. Most organizations underestimate this list.",
    items: [
      { id: "d1", label: "Inventory all TLS endpoints (external and internal)", detail: "Note each certificate's key type — RSA or ECDSA — and the negotiated key exchange." },
      { id: "d2", label: "Inventory VPN and SSH infrastructure", detail: "Which key exchange algorithms are negotiated by default on each device?" },
      { id: "d3", label: "Inventory code-signing and firmware-signing keys", detail: "These often have the longest effective lifetime of anything in the organization." },
      { id: "d4", label: "Inventory database and disk encryption key management", detail: "Usually AES — lower migration priority, but confirm key sizes (AES-256, not AES-128)." },
      { id: "d5", label: "Inventory third-party SaaS and API integrations", detail: "You can't patch a vendor's TLS stack — track their public migration timelines instead." },
      { id: "d6", label: "Inventory embedded and IoT devices with hardcoded crypto", detail: "Often the hardest and slowest to migrate — plan for these earliest, not last." },
    ],
  },
  {
    title: "2. Classify by data sensitivity and lifetime",
    intro: "Not everything needs to move at the same speed — the harvest-now-decrypt-later risk is proportional to how long data must stay confidential.",
    items: [
      { id: "c1", label: "Identify data that must stay confidential 10+ years", detail: "State secrets, medical records, trade secrets — this is exposed today if intercepted today." },
      { id: "c2", label: "Flag systems protecting long-lived secrets", detail: "Root CAs, code-signing roots, long-term backup encryption keys." },
      { id: "c3", label: "Deprioritize genuinely ephemeral sessions", detail: "A session that's operationally irrelevant a week later carries far less exposure." },
    ],
  },
  {
    title: "3. Assess crypto-agility",
    intro: "How much pain a future algorithm swap causes depends entirely on decisions made before you needed one.",
    items: [
      { id: "a1", label: "Can each system swap algorithms via config, not a full redeploy?", detail: "Hardcoded algorithm choices are the single biggest migration cost multiplier." },
      { id: "a2", label: "Are you using vetted libraries, not custom crypto code?", detail: "OpenSSL, BoringSSL, libsodium — custom implementations rarely track new algorithm support." },
      { id: "a3", label: "Do your TLS stack and OS versions support hybrid key exchange?", detail: "Check for X25519MLKEM768 or similar hybrid groups in your current TLS library version." },
    ],
  },
  {
    title: "4. Plan the migration",
    intro: "A migration plan, not a migration — most organizations are years from a full cutover, and that's fine if the sequencing is right.",
    items: [
      { id: "p1", label: "Prioritize systems protecting long-lived data first", detail: "Directly follows from the classification step above." },
      { id: "p2", label: "Pilot hybrid key exchange on non-critical internal services", detail: "Combine a classical algorithm (ECDH) with ML-KEM in the same handshake — lower risk than a pure PQC cutover." },
      { id: "p3", label: "Track NIST and vendor timelines for ML-KEM/ML-DSA support", detail: "Your migration is gated by your dependencies' support, not just your own code." },
      { id: "p4", label: "Budget for a second wave once hardware-backed PQC matures", detail: "HSMs and smart cards with native PQC support are still catching up to the software standards." },
      { id: "p5", label: "Leave AES-256 and SHA-384/512 in place", detail: "They don't need replacing — Grover's algorithm only halves their effective security, and they already have the margin." },
    ],
  },
];
