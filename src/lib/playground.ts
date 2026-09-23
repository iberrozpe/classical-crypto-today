export interface PlaygroundTool {
  slug: string;
  title: string;
  summary: string;
  relatedModule?: string;
  category: "Symmetric-key" | "Public-key" | "Foundations" | "Protocols";
}

export const playgroundTools: PlaygroundTool[] = [
  {
    slug: "aes-gcm",
    title: "AES-GCM encrypt & decrypt",
    summary:
      "Encrypt a real message with real AES-256-GCM, see the IV, ciphertext, and auth tag, then decrypt it back — or tamper with one byte and watch decryption fail.",
    relatedModule: "symmetric-key-aes",
    category: "Symmetric-key",
  },
  {
    slug: "sha-256",
    title: "SHA-256 & the avalanche effect",
    summary:
      "Hash any text live and watch the digest change completely when you edit a single character.",
    relatedModule: "hash-functions-and-signatures",
    category: "Foundations",
  },
  {
    slug: "hmac",
    title: "HMAC sign & verify",
    summary:
      "Compute a real HMAC-SHA256 over a message and secret, then see why changing even one bit of the message makes verification fail.",
    relatedModule: "hash-functions-and-signatures",
    category: "Foundations",
  },
  {
    slug: "rsa-oaep",
    title: "RSA key generation & OAEP encryption",
    summary:
      "Generate a real 2048-bit RSA key pair in your browser, encrypt a short message with the public key, and decrypt it with the private key.",
    relatedModule: "rsa-public-key",
    category: "Public-key",
  },
  {
    slug: "ecdsa",
    title: "ECDSA sign & verify",
    summary:
      "Generate a real P-256 key pair, sign a message, verify it — then tamper with the message and watch verification reject it.",
    relatedModule: "elliptic-curve-cryptography",
    category: "Public-key",
  },
  {
    slug: "ecdh",
    title: "ECDH key exchange",
    summary:
      "Simulate Alice and Bob generating independent key pairs and deriving the exact same shared secret — without ever transmitting it.",
    relatedModule: "diffie-hellman-key-exchange",
    category: "Public-key",
  },
  {
    slug: "jwt",
    title: "JWT builder & decoder",
    summary:
      "Build a real HMAC-signed JWT from your own claims, or paste one in to decode its header and payload and verify its signature.",
    relatedModule: "jwt-and-api-auth",
    category: "Protocols",
  },
];

export function getPlaygroundTool(slug: string): PlaygroundTool | undefined {
  return playgroundTools.find((t) => t.slug === slug);
}
