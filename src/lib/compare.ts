export interface ComparisonTable {
  slug: string;
  title: string;
  blurb: string;
  relatedModules?: string[];
  columns: string[];
  rows: string[][];
}

export const comparisonTables: ComparisonTable[] = [
  {
    slug: "public-key-families",
    title: "RSA vs. Diffie-Hellman vs. ECC",
    blurb:
      "The three classical public-key families covered in this catalog, and the hard problem each one rests on.",
    relatedModules: ["rsa-public-key", "diffie-hellman-key-exchange", "elliptic-curve-cryptography"],
    columns: ["", "RSA", "Diffie-Hellman", "ECC / ECDSA"],
    rows: [
      ["Hard problem", "Integer factorization", "Discrete logarithm (mod p)", "Elliptic curve discrete log"],
      ["Key size for ~128-bit security", "3072 bits", "3072 bits", "256 bits"],
      ["What it's used for", "Encryption & signatures", "Key exchange only", "Key exchange (ECDH) & signatures (ECDSA)"],
      ["Speed at equivalent security", "Slower — large keys", "Slower — large keys", "Fast — small keys"],
      ["Broken by Shor's algorithm?", "Yes", "Yes", "Yes"],
    ],
  },
  {
    slug: "aes-modes",
    title: "AES modes of operation",
    blurb: "The same block cipher, arranged four different ways — with very different security properties.",
    relatedModules: ["symmetric-key-aes"],
    columns: ["", "ECB", "CBC", "CTR", "GCM"],
    rows: [
      ["Authenticated (integrity)?", "No", "No — needs a separate MAC", "No — needs a separate MAC", "Yes, built in"],
      ["Needs a unique IV/nonce?", "N/A", "Yes", "Yes", "Yes — reuse breaks security"],
      ["Parallelizable?", "Yes", "No (decrypt only)", "Yes", "Yes"],
      ["Identical plaintext blocks look identical?", "Yes — a known flaw", "No", "No", "No"],
      ["Recommended today?", "Never", "Legacy only, with HMAC", "Rarely used alone", "Yes — default choice"],
    ],
  },
  {
    slug: "hash-functions",
    title: "Hash functions",
    blurb: "Output size alone doesn't tell the whole story — construction and real-world break history matter just as much.",
    relatedModules: ["hash-functions-and-signatures"],
    columns: ["", "MD5", "SHA-1", "SHA-256", "SHA-3-256"],
    rows: [
      ["Output size", "128 bits", "160 bits", "256 bits", "256 bits"],
      ["Construction", "Merkle-Damgård", "Merkle-Damgård", "Merkle-Damgård", "Sponge"],
      ["Collision resistance", "Broken", "Broken", "~128-bit", "~128-bit"],
      ["Vulnerable to length extension?", "Yes", "Yes", "Yes (use HMAC)", "No"],
      ["Status", "Do not use", "Do not use", "Current standard", "Current standard"],
    ],
  },
  {
    slug: "symmetric-vs-asymmetric",
    title: "Symmetric vs. asymmetric encryption",
    blurb: "Why real systems (like TLS) almost always use both, each for what it's good at.",
    relatedModules: ["symmetric-key-aes", "rsa-public-key", "elliptic-curve-cryptography"],
    columns: ["", "Symmetric (AES)", "Asymmetric (RSA / ECC)"],
    rows: [
      ["Keys involved", "One shared secret key", "A public/private key pair"],
      ["Speed", "Fast — used for bulk data", "Slow — key exchange/signatures only"],
      ["Key distribution problem?", "Yes — both sides need the secret in advance", "No — the public key can be shared openly"],
      ["Typical role in TLS", "Encrypts the actual traffic", "Establishes the key, or signs the handshake"],
    ],
  },
  {
    slug: "password-kdfs",
    title: "Password hashing / KDFs",
    blurb: "All four deliberately slow down password checking — they just spend the extra cost differently.",
    relatedModules: ["key-derivation-functions"],
    columns: ["", "PBKDF2", "bcrypt", "scrypt", "Argon2id"],
    rows: [
      ["Introduced", "2000", "1999", "2009", "2015"],
      ["Memory-hard?", "No", "No", "Yes", "Yes"],
      ["Tunable cost", "Iteration count", "Cost factor", "Cost, block size, parallelism", "Time, memory, parallelism"],
      ["GPU/ASIC resistance", "Low", "Moderate", "High", "Highest — current pick"],
    ],
  },
];
