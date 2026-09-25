export interface ChangelogEntry {
  date: string;
  title: string;
  items: string[];
}

export const changelog: ChangelogEntry[] = [
  {
    date: "2026-09-25",
    title: "Challenges, site-wide search, and a new Use Cases section",
    items: [
      "Added a PKCS use case: an overview of the PKCS standards family plus an in-depth look at PKCS#11 (Cryptoki) — object attributes, the wrap-then-decrypt API attack, a real-key Playground tool, and a hands-on Challenges puzzle exploiting the same attack",
      "Launched a Challenges section: 16 hands-on CTF-style puzzles across Warm-up, Classical Ciphers, Symmetric-key, RSA, and Diffie-Hellman/ECC, each checked entirely in the browser with hints, a points total, and local-only progress tracking",
      "Added a site-wide search: a ⌘K/Ctrl+K command palette indexing every module, use case, playground tool, glossary term, and now challenge",
      "Fixed the Navigate graph erroring with \"This page couldn't load\" when panning on Chrome, Firefox, and Edge — a browser swipe-navigation gesture conflict",
      "Added a link to About in the left navigation",
      "Added three real-cryptography Playground tools: a TLS key schedule walkthrough, KMS envelope encryption, and certificate revocation checking",
      "Expanded the TLS and JWT Learn modules with session resumption, 0-RTT trade-offs, SNI/ECH, revocation and refresh tokens, JWKS, and the \"alg: none\" attack",
      "Added a new top-level Use Cases section covering KMS envelope encryption, key wrapping & exchange, PKI in production, and federated identity (OAuth2/OIDC/SAML) — each with a 10-question quiz",
    ],
  },
  {
    date: "2026-09-24",
    title: "Breadth, new sections, and a full quiz bank",
    items: [
      "Added a Disclaimer, Data Privacy section, Software Bill of Materials, dual MIT/CC BY-NC-ND license, a curated Further Reading list, and this Changelog to the About page",
      "Added a CI workflow that lints, builds, and audits dependencies on every push",
      "Expanded every module's knowledge check from 3 to 10 questions — 210 questions total",
      "Added an About page and a manual light/dark theme toggle",
      "Added a breadcrumb navigation banner, a References page, and a \"Navigate\" force-directed knowledge graph",
      "Dropped the \"MVP build\" label; added a sitemap, robots.txt, a dynamic OG image, and Vercel Analytics",
      "Added the first knowledge-check quiz bank (3 questions per module)",
      "Added Glossary, Compare, and Migration Checklist sections",
      "Added illustrated diagrams for hash chains, blockchain hash-chains, certificate chains, and X3DH/Double Ratchet",
      "Added three new Playground tools: PBKDF2, a certificate chain builder, and an X3DH simulator",
      "Added a History & Purpose of Cryptography module and substantially expanded the math foundations module",
    ],
  },
  {
    date: "2026-09-23",
    title: "The Playground, and illustrated diagrams everywhere",
    items: [
      "Replaced schematic SVG diagrams with true illustrated ones (GCM, OAEP, cipher wheel, modular clock, timeline, swimlane, pipeline)",
      "Added a \"how it works\" sister page to every Playground tool, with real formulas and diagrams",
      "Added wrong-key demonstrations to the RSA-OAEP, ECDSA, and ECDH Playground tools",
      "Launched the Playground — real cryptography running in the browser via the Web Crypto API",
      "Fixed the elliptic-curve point-addition diagram twice over, rebuilding it on a real curve with numerically verified coordinates after it didn't actually pass through Q",
      "Tripled the depth of the core protocol modules (RSA, ECC, AES, hashing, TLS, etc.)",
      "Added formulas and diagrams across all 20 Learn modules",
      "Replaced the top navigation with a collapsible left sidebar",
    ],
  },
  {
    date: "2026-09-22",
    title: "Launch",
    items: [
      "Redesigned Explore as a categorized glossary",
      "Expanded the catalog to 20 modules and shipped the Assess quiz",
      "Shipped the MVP: a persona picker and 8 content modules",
    ],
  },
];
