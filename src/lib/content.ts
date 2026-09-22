export type RoleId =
  | "executive"
  | "grc"
  | "developer"
  | "architect"
  | "itops"
  | "researcher"
  | "curious";

export interface Persona {
  id: RoleId;
  label: string;
  tagline: string;
  pitch: string;
  firstWin: { label: string; slug: string; minutes: number };
  moduleSlugs: string[];
}

export interface Module {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  tags: RoleId[];
  category: "Foundations" | "Public-key" | "Symmetric-key" | "Protocols" | "Practice";
  sections: { heading: string; body: string[] }[];
}

export const personas: Persona[] = [
  {
    id: "executive",
    label: "Executive / Business Leader",
    tagline: "Risk exposure & investment focus",
    pitch:
      "Your board is asking about the PQC migration. Before you can answer, you need to know what \"classic\" crypto your organisation actually depends on today.",
    firstWin: { label: "See what's actually at risk", slug: "key-sizes-and-security-levels", minutes: 8 },
    moduleSlugs: ["rsa-public-key", "quantum-threat-shor", "key-sizes-and-security-levels"],
  },
  {
    id: "grc",
    label: "GRC / Risk & Compliance",
    tagline: "Obligations, inventory & evidence focus",
    pitch:
      "Auditors want a cryptographic bill of materials. Know which algorithms are in scope before you can attest to anything.",
    firstWin: { label: "Map the algorithms you must inventory", slug: "tls-in-practice", minutes: 10 },
    moduleSlugs: ["tls-in-practice", "key-sizes-and-security-levels", "hash-functions-and-signatures"],
  },
  {
    id: "developer",
    label: "Developer / Engineer",
    tagline: "Implementation & protocol focus",
    pitch:
      "RSA, AES, ECDSA and SHA-2 are already in every library you import. Understand what they actually do before you touch a crypto API.",
    firstWin: { label: "See a real handshake, step by step", slug: "tls-in-practice", minutes: 12 },
    moduleSlugs: [
      "symmetric-key-aes",
      "rsa-public-key",
      "elliptic-curve-cryptography",
      "diffie-hellman-key-exchange",
      "hash-functions-and-signatures",
      "tls-in-practice",
    ],
  },
  {
    id: "architect",
    label: "Security Architect",
    tagline: "System & infrastructure focus",
    pitch:
      "Every PKI, VPN and TLS terminator you've designed rests on the same handful of primitives. Get the mental model right before you redesign anything.",
    firstWin: { label: "Trace trust from key exchange to signature", slug: "diffie-hellman-key-exchange", minutes: 10 },
    moduleSlugs: [
      "diffie-hellman-key-exchange",
      "elliptic-curve-cryptography",
      "hash-functions-and-signatures",
      "tls-in-practice",
      "key-sizes-and-security-levels",
    ],
  },
  {
    id: "itops",
    label: "IT Ops / DevOps",
    tagline: "Deploy & operate focus",
    pitch:
      "Certificates, cipher suites, key sizes — the settings you configure every day encode decades of cryptographic design. Know what they mean.",
    firstWin: { label: "Understand what a cipher suite actually says", slug: "tls-in-practice", minutes: 10 },
    moduleSlugs: ["symmetric-key-aes", "tls-in-practice", "key-sizes-and-security-levels"],
  },
  {
    id: "researcher",
    label: "Researcher / Academic",
    tagline: "Comprehensive, no filtering",
    pitch: "Open the full catalog. Every module, in order, with no persona filtering.",
    firstWin: { label: "Start at the foundations", slug: "symmetric-key-aes", minutes: 10 },
    moduleSlugs: [
      "symmetric-key-aes",
      "rsa-public-key",
      "elliptic-curve-cryptography",
      "diffie-hellman-key-exchange",
      "hash-functions-and-signatures",
      "tls-in-practice",
      "key-sizes-and-security-levels",
      "quantum-threat-shor",
    ],
  },
  {
    id: "curious",
    label: "Curious Explorer",
    tagline: "New to cryptography",
    pitch:
      "Your browser's padlock icon runs on math you use every day without seeing. Here's what's actually happening behind it.",
    firstWin: { label: "What happens when you visit a website", slug: "tls-in-practice", minutes: 12 },
    moduleSlugs: ["symmetric-key-aes", "rsa-public-key", "tls-in-practice"],
  },
];

export const modules: Module[] = [
  {
    slug: "symmetric-key-aes",
    title: "Symmetric-key cryptography & AES",
    summary:
      "The same key locks and unlocks the data. Fast, simple in concept, and everywhere — from disk encryption to the bulk of every TLS session.",
    minutes: 10,
    category: "Symmetric-key",
    tags: ["developer", "architect", "itops", "researcher", "curious"],
    sections: [
      {
        heading: "One key, both directions",
        body: [
          "Symmetric-key cryptography uses a single secret key for both encryption and decryption. If Alice and Bob share a key, Alice can encrypt a message with it and Bob can decrypt it with the same key. The security of the whole scheme rests entirely on that key staying secret.",
          "This is the oldest form of cryptography in continuous use, and it remains the workhorse of modern systems because it's fast — often 100-1000x faster than public-key operations on the same data.",
        ],
      },
      {
        heading: "AES: the current standard",
        body: [
          "The Advanced Encryption Standard (AES) was selected by NIST in 2001 after a public competition, replacing the older DES. AES operates on fixed-size 128-bit blocks of data and supports key sizes of 128, 192, or 256 bits.",
          "Internally, AES applies a series of transformations — substitution (SubBytes), permutation (ShiftRows), mixing (MixColumns), and key mixing (AddRoundKey) — repeated over 10, 12, or 14 rounds depending on key size. Each round diffuses the input so thoroughly that flipping a single input bit changes roughly half the output bits (the avalanche effect).",
          "No practical attack breaks full AES faster than brute force. AES-128 offers roughly 128 bits of security — meaning an attacker needs on the order of 2^128 operations to find the key. That number is astronomically larger than the number of atoms in the observable universe.",
        ],
      },
      {
        heading: "Modes of operation",
        body: [
          "AES itself only encrypts a single 128-bit block. To encrypt real messages, it's combined with a mode of operation. ECB mode (encrypt each block independently) is insecure for most data because identical plaintext blocks produce identical ciphertext blocks, leaking patterns.",
          "Modern systems use authenticated modes like AES-GCM, which combine encryption with a built-in integrity check (a tag) that detects tampering. GCM is the mode behind most TLS 1.3 connections today.",
        ],
      },
      {
        heading: "Why it matters for the PQC conversation",
        body: [
          "Symmetric-key algorithms like AES are not broken by quantum computers the way RSA and ECC are. Grover's algorithm gives a quadratic speedup against brute-force key search, which roughly halves the effective key length — so AES-256 still offers about 128 bits of quantum-resistant security. This is why PQC migration guidance focuses on replacing RSA/ECC, not AES.",
        ],
      },
    ],
  },
  {
    slug: "rsa-public-key",
    title: "RSA & public-key cryptography",
    summary:
      "Two mathematically linked keys — one public, one private — solve the problem symmetric crypto can't: how do you share a secret with someone you've never met?",
    minutes: 12,
    category: "Public-key",
    tags: ["developer", "architect", "executive", "researcher", "curious"],
    sections: [
      {
        heading: "The key distribution problem",
        body: [
          "Symmetric cryptography has a bootstrapping problem: to encrypt securely, both sides need the same secret key — but how do you get that key to the other side without an eavesdropper intercepting it first?",
          "Public-key (asymmetric) cryptography, introduced conceptually by Diffie and Hellman in 1976 and made practical by Rivest, Shamir, and Adleman with RSA in 1977, solves this with two mathematically linked keys: a public key anyone can know, and a private key only the owner holds. Data encrypted with the public key can only be decrypted with the matching private key.",
        ],
      },
      {
        heading: "How RSA works, at a glance",
        body: [
          "RSA's security rests on a simple asymmetry: multiplying two large prime numbers is easy, but factoring their product back into the original primes is computationally hard for classical computers when the numbers are large enough (2048 bits or more, today).",
          "Key generation picks two large random primes p and q, computes n = p × q, and derives a public exponent e and private exponent d such that they're mathematically inverse under modular arithmetic tied to n. The public key is (n, e); the private key is (n, d). Encryption raises the message to the power e mod n; decryption raises the ciphertext to the power d mod n.",
          "In practice, RSA is rarely used to encrypt bulk data directly — it's slow and has strict size limits. Instead it's typically used to encrypt a short symmetric key (key transport) or to produce digital signatures, with AES doing the heavy lifting on the actual data.",
        ],
      },
      {
        heading: "Why factoring is the whole game",
        body: [
          "Every attack on RSA either tries to factor n directly or tries to find a shortcut that avoids factoring. The best known classical factoring algorithm, the General Number Field Sieve, has sub-exponential running time — hard enough that factoring a 2048-bit RSA modulus is considered infeasible with any classical computer for the foreseeable future.",
          "This is precisely the assumption that Shor's algorithm breaks on a sufficiently large quantum computer — see the quantum threat module for why RSA is on every PQC migration roadmap.",
        ],
      },
    ],
  },
  {
    slug: "elliptic-curve-cryptography",
    title: "Elliptic Curve Cryptography (ECC / ECDSA)",
    summary:
      "The same public-key guarantees as RSA, with dramatically smaller keys — because the underlying hard problem is different math entirely.",
    minutes: 11,
    category: "Public-key",
    tags: ["developer", "architect", "researcher"],
    sections: [
      {
        heading: "A different hard problem",
        body: [
          "Elliptic Curve Cryptography builds public-key systems on the algebra of points on an elliptic curve over a finite field, rather than on integer factorization. The hard problem here is the elliptic curve discrete logarithm problem (ECDLP): given a starting point G and a resulting point Q = kG (k applications of a 'point addition' operation), it's computationally infeasible to recover k.",
          "Crucially, no sub-exponential classical algorithm is known for ECDLP the way one exists for factoring — which means ECC achieves equivalent classical security to RSA with far smaller keys. A 256-bit ECC key is considered roughly as strong as a 3072-bit RSA key.",
        ],
      },
      {
        heading: "Smaller keys, real consequences",
        body: [
          "Smaller keys mean less data to transmit and store, faster key generation, and faster signing operations — which is why ECC dominates mobile, IoT, and high-volume TLS deployments. Curve25519 (for key exchange, as X25519) and Curve448 are widely used modern curves chosen partly to avoid pitfalls found in some earlier NIST-standardized curves.",
        ],
      },
      {
        heading: "ECDSA: signatures on curves",
        body: [
          "The Elliptic Curve Digital Signature Algorithm (ECDSA) uses ECC to produce digital signatures — proof that a message came from the holder of a private key, without revealing that key. It's the signature scheme behind most modern TLS certificates and behind Bitcoin and Ethereum transaction signing.",
          "ECDSA requires a fresh, truly random per-signature value (the nonce) for every signature. Reusing a nonce, or generating it with a weak random number generator, leaks the private key directly — this has caused real-world key compromises, including a widely cited 2010 Sony PlayStation 3 signing-key leak caused by a static nonce.",
        ],
      },
      {
        heading: "Why it matters for the PQC conversation",
        body: [
          "ECC's smaller keys and wide deployment make it, if anything, a more urgent migration target than RSA in some contexts — it's cryptographically broken by the same Shor's algorithm class of quantum attack, but it's embedded in more places (TLS 1.3 defaults, most modern certificate authorities, cryptocurrency).",
        ],
      },
    ],
  },
  {
    slug: "diffie-hellman-key-exchange",
    title: "Diffie-Hellman key exchange",
    summary:
      "Two parties agree on a shared secret over a public channel, without ever transmitting the secret itself — the idea that started public-key cryptography.",
    minutes: 9,
    category: "Protocols",
    tags: ["developer", "architect", "researcher"],
    sections: [
      {
        heading: "The original public-key idea",
        body: [
          "Published by Whitfield Diffie and Martin Hellman in 1976, the Diffie-Hellman (DH) key exchange was the first published practical method for two parties to establish a shared secret over an insecure channel — without any prior shared secret.",
          "The classical version relies on the discrete logarithm problem in modular arithmetic: given a large prime p, a generator g, and g^a mod p, it's hard to recover a. Alice picks a secret a and sends g^a mod p; Bob picks a secret b and sends g^b mod p. Each raises the received value to their own secret: (g^b)^a = (g^a)^b = g^ab mod p — the shared secret, which an eavesdropper watching only g^a and g^b cannot feasibly compute.",
        ],
      },
      {
        heading: "Elliptic-curve Diffie-Hellman (ECDH)",
        body: [
          "The same idea maps onto elliptic curves: instead of modular exponentiation, parties combine points on a curve. X25519 (ECDH over Curve25519) is the default key exchange in TLS 1.3 and in most modern SSH and messaging protocols, valued for speed and resistance to several classes of implementation error.",
        ],
      },
      {
        heading: "Forward secrecy",
        body: [
          "When DH parameters are generated fresh for each session (ephemeral Diffie-Hellman, denoted DHE or ECDHE), a compromise of a server's long-term private key doesn't let an attacker decrypt previously recorded sessions — each session's key existed only in memory and is gone once the connection ends. This property, forward secrecy, is now mandatory in TLS 1.3.",
        ],
      },
    ],
  },
  {
    slug: "hash-functions-and-signatures",
    title: "Hash functions & digital signatures",
    summary:
      "One-way fingerprints for data, and the mechanism that proves a message is authentic and untampered — without encrypting anything.",
    minutes: 10,
    category: "Foundations",
    tags: ["developer", "architect", "grc", "researcher"],
    sections: [
      {
        heading: "What a cryptographic hash function does",
        body: [
          "A cryptographic hash function takes an input of any size and produces a fixed-size output (a digest) with three properties: it's deterministic (same input always gives same output), it's infeasible to reverse (you can't recover the input from the digest — preimage resistance), and it's infeasible to find two different inputs with the same digest (collision resistance).",
          "SHA-2 (specifically SHA-256 and SHA-512) is the current widely deployed standard, used in TLS, Bitcoin, code signing, and password storage schemes (combined with salting and slow key-derivation functions). SHA-3, standardized in 2015, uses a structurally different design (a sponge construction) and serves as a hedge in case future cryptanalysis weakens SHA-2.",
          "The predecessor algorithms MD5 and SHA-1 are both cryptographically broken for collision resistance — real collisions have been publicly demonstrated for both — and neither should be used for security purposes today, only for non-adversarial checksums.",
        ],
      },
      {
        heading: "From hashing to signing",
        body: [
          "A digital signature proves two things at once: the message came from the holder of a specific private key (authenticity), and the message wasn't altered after signing (integrity). The signer hashes the message, then encrypts (more precisely, transforms) that hash with their private key. Anyone with the public key can verify by hashing the message themselves and checking it matches.",
          "RSA signatures and ECDSA both follow this hash-then-sign pattern. This is also why hash function security matters even in \"public-key\" workflows — if an attacker can find a second message with the same hash as a legitimately signed one, they can attach a valid signature to a message that was never actually signed.",
        ],
      },
      {
        heading: "HMAC: keyed hashing",
        body: [
          "HMAC combines a hash function with a secret key to produce a message authentication code — proof that a message wasn't tampered with, verifiable by anyone holding the shared key. HMAC-SHA256 is common wherever two parties share a symmetric secret and need integrity without full public-key signatures, including inside several TLS cipher suites and API authentication schemes.",
        ],
      },
    ],
  },
  {
    slug: "tls-in-practice",
    title: "TLS in practice: how HTTPS puts it all together",
    summary:
      "Every padlock icon runs a coordinated handshake combining key exchange, certificates, symmetric encryption, and integrity checks — in under a round trip.",
    minutes: 13,
    category: "Protocols",
    tags: ["developer", "architect", "itops", "grc", "curious", "researcher"],
    sections: [
      {
        heading: "What happens when you load an HTTPS page",
        body: [
          "Transport Layer Security (TLS) is the protocol behind the padlock icon, protecting the vast majority of web traffic. A TLS 1.3 handshake (the current version, standardized in 2018) typically completes in one round trip:",
          "1. The client offers supported cipher suites and a key share (an ephemeral ECDHE public value). 2. The server picks a cipher suite, replies with its own key share, and sends its certificate — signed by a Certificate Authority using RSA or ECDSA — plus a signature over the handshake so far. 3. Both sides independently derive the same shared secret via ECDHE, verify the certificate chain, and derive symmetric session keys from that shared secret. 4. All further application data is encrypted with a fast symmetric cipher, almost always AES-GCM or ChaCha20-Poly1305.",
        ],
      },
      {
        heading: "Every module in this catalog, working together",
        body: [
          "A single TLS connection is a working demonstration of nearly everything covered elsewhere in this catalog: (ephemeral) Diffie-Hellman for the key exchange, RSA or ECDSA signatures for the server's authentication via its certificate, SHA-2 for hashing throughout the handshake transcript and certificate chain, and AES or ChaCha20 for the actual encrypted data afterward.",
          "This layering is exactly why PQC migration is hard: a TLS deployment isn't \"one algorithm,\" it's a stack of several, each of which needs its own quantum-resistant replacement, and some replacements (like larger PQC key sizes) change performance and packet-size assumptions the whole protocol was tuned around.",
        ],
      },
      {
        heading: "Certificate chains and trust",
        body: [
          "Your browser trusts a server's certificate because it's signed by a Certificate Authority (CA) whose own certificate is pre-installed as a trust anchor. This forms a chain: your leaf certificate is signed by an intermediate CA, which is signed by a root CA your browser already trusts. Break any link — an expired cert, an untrusted CA, a hostname mismatch — and the connection is refused.",
        ],
      },
    ],
  },
  {
    slug: "key-sizes-and-security-levels",
    title: "Key sizes & security levels: what the numbers mean",
    summary:
      "128-bit AES, 2048-bit RSA, 256-bit ECC — these numbers aren't comparable at face value. Here's how to actually read them.",
    minutes: 8,
    category: "Foundations",
    tags: ["executive", "grc", "itops", "architect", "researcher"],
    sections: [
      {
        heading: "Bits of security, not bits of key",
        body: [
          "\"128-bit security\" means an attacker needs on the order of 2^128 operations to break the scheme — roughly the same difficulty regardless of which algorithm provides it. But the key size needed to reach a given security level varies enormously by algorithm family, because each is broken by a different class of attack.",
          "For AES (symmetric), the key size and the security level are the same number: a 128-bit key gives ~128-bit security. For RSA (broken by factoring, which has a sub-exponential classical algorithm), you need a much larger key — 3072 bits — to reach the same ~128-bit security level. For ECC (broken by the elliptic curve discrete log problem, which has no known sub-exponential classical attack), a 256-bit key already reaches ~128-bit security.",
        ],
      },
      {
        heading: "A rough equivalence table",
        body: [
          "Roughly comparable classical security levels: 80-bit (deprecated) ≈ 1024-bit RSA ≈ 160-bit ECC. 112-bit (minimum acceptable today) ≈ 2048-bit RSA ≈ 224-bit ECC. 128-bit (current baseline) ≈ 3072-bit RSA ≈ 256-bit ECC ≈ AES-128. 192-bit ≈ 7680-bit RSA ≈ 384-bit ECC ≈ AES-192.",
          "These figures (based on NIST SP 800-57 guidance) are why a 2048-bit RSA key and a 256-bit ECC key are often deployed side by side as \"equivalent\" choices — they target the same classical security level via very different key sizes.",
        ],
      },
      {
        heading: "Why this table breaks under quantum attack",
        body: [
          "This whole equivalence table assumes only classical computers. Shor's algorithm collapses RSA and ECC security to essentially nothing at any key size, on a sufficiently large fault-tolerant quantum computer — making the classical size/security relationship irrelevant for those two families. AES and SHA-2 degrade far more gracefully (Grover's algorithm roughly halves the effective security level), which is why the PQC conversation is really about replacing public-key algorithms, not symmetric ones.",
        ],
      },
    ],
  },
  {
    slug: "quantum-threat-shor",
    title: "Why quantum computers break this: Shor's algorithm",
    summary:
      "The bridge module: why everything above is called \"classical\" cryptography, and exactly what a future quantum computer would do to it.",
    minutes: 9,
    category: "Foundations",
    tags: ["executive", "developer", "architect", "researcher", "curious"],
    sections: [
      {
        heading: "The specific mathematical trapdoor",
        body: [
          "RSA, Diffie-Hellman, and ECC all rest on problems classical computers cannot solve efficiently: factoring large integers, and computing discrete logarithms (in modular arithmetic or on elliptic curves). Every key size recommendation in this catalog is calibrated against the best known classical algorithms for these problems.",
          "In 1994, mathematician Peter Shor published a quantum algorithm that solves both integer factorization and discrete logarithms in polynomial time — meaning the running time grows manageably with input size, unlike the sub-exponential or exponential growth classical algorithms face. On a sufficiently large, sufficiently low-error quantum computer, Shor's algorithm would make RSA, classical Diffie-Hellman, and ECC/ECDSA all breakable in practical time.",
        ],
      },
      {
        heading: "\"Sufficiently large\" is doing a lot of work",
        body: [
          "Breaking RSA-2048 with Shor's algorithm is estimated to require several thousand logical (fully error-corrected) qubits — which, given current error rates, could require millions of physical qubits once error correction overhead is included. Today's largest quantum computers have on the order of hundreds to low thousands of physical, noisy qubits. No quantum computer today can run Shor's algorithm against real-world key sizes.",
          "That gap is exactly why migration is happening now rather than later: data encrypted today with RSA or ECC can be recorded by an adversary and decrypted retroactively once a capable quantum computer exists — a risk known as \"harvest now, decrypt later.\" Anything that needs confidentiality for years is exposed today, even if the quantum computer that breaks it doesn't exist yet.",
        ],
      },
      {
        heading: "What doesn't break",
        body: [
          "Symmetric algorithms (AES) and hash functions (SHA-2, SHA-3) are not vulnerable to Shor's algorithm — there's no known efficient quantum algorithm for brute-forcing a symmetric key or finding hash collisions beyond Grover's quadratic speedup, which is countered simply by using larger keys (AES-256 instead of AES-128).",
          "This is the exact fault line PQC standards draw: NIST's post-quantum standards (ML-KEM, ML-DSA, SLH-DSA) replace the public-key algorithms covered in this catalog — RSA, Diffie-Hellman, ECC — while leaving AES and SHA-2/3 in place, just with larger key sizes where needed.",
        ],
      },
    ],
  },
];

export function getModule(slug: string): Module | undefined {
  return modules.find((m) => m.slug === slug);
}

export function getPersona(id: string): Persona | undefined {
  return personas.find((p) => p.id === id);
}

export const roleLabels: Record<RoleId, string> = Object.fromEntries(
  personas.map((p) => [p.id, p.label])
) as Record<RoleId, string>;
