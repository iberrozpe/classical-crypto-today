export interface AssessQuestion {
  id: string;
  question: string;
  helper?: string;
  moduleSlugs: string[];
}

export const assessQuestions: AssessQuestion[] = [
  {
    id: "https",
    question: "Do you run public-facing HTTPS websites or APIs?",
    helper: "Any server that terminates TLS — a web app, a REST API, a load balancer.",
    moduleSlugs: ["tls-in-practice", "digital-certificates-x509"],
  },
  {
    id: "ssh",
    question: "Do you manage SSH access to servers or use SSH for deployment (e.g. git over SSH)?",
    moduleSlugs: ["ssh-protocol"],
  },
  {
    id: "auth",
    question: "Do you store user passwords, or issue/verify JWTs or API tokens?",
    moduleSlugs: ["key-derivation-functions", "jwt-and-api-auth", "hash-functions-and-signatures"],
  },
  {
    id: "longlived",
    question:
      "Does any of your data need to stay confidential for 10+ years (health records, legal, government, trade secrets)?",
    helper: "This is specifically about long confidentiality windows, not general sensitivity.",
    moduleSlugs: ["harvest-now-decrypt-later", "quantum-threat-shor"],
  },
  {
    id: "vpn",
    question: "Do you operate VPNs, point-to-point tunnels, or site-to-site encrypted links?",
    moduleSlugs: ["diffie-hellman-key-exchange", "stream-ciphers-chacha20"],
  },
  {
    id: "pki",
    question: "Do you run an internal Certificate Authority, or sign code/releases/firmware?",
    moduleSlugs: ["digital-certificates-x509", "hash-functions-and-signatures"],
  },
  {
    id: "custom-crypto",
    question:
      "Does any team write or maintain custom cryptographic code, rather than using a vetted library end to end?",
    helper: "Custom padding, custom random number handling, hand-rolled protocol logic.",
    moduleSlugs: [
      "rsa-padding-oaep-pkcs1",
      "random-number-generation",
      "side-channel-and-timing-attacks",
    ],
  },
  {
    id: "pqc-planning",
    question: "Are you already evaluating or budgeting for a post-quantum migration?",
    moduleSlugs: [
      "quantum-threat-shor",
      "harvest-now-decrypt-later",
      "key-sizes-and-security-levels",
    ],
  },
];
