import type { Section } from "./content";

export interface PlaygroundTool {
  slug: string;
  title: string;
  summary: string;
  relatedModule?: string;
  category: "Symmetric-key" | "Public-key" | "Foundations" | "Protocols";
  howItWorks: Section[];
}

export const playgroundTools: PlaygroundTool[] = [
  {
    slug: "aes-gcm",
    title: "AES-GCM encrypt & decrypt",
    summary:
      "Encrypt a real message with real AES-256-GCM, see the IV, ciphertext, and auth tag, then decrypt it back — or tamper with one byte and watch decryption fail.",
    relatedModule: "symmetric-key-aes",
    category: "Symmetric-key",
    howItWorks: [
      {
        heading: "Generating the key",
        body: [
          "Clicking \"Generate AES-256 key\" calls the browser's CSPRNG for 32 truly random bytes — the same entropy source covered in the Random Number Generation module. There's no separate \"key schedule\" step yet; AES derives its round keys from this value internally, only once you actually encrypt.",
        ],
      },
      {
        heading: "Encrypting: counter mode underneath",
        body: [
          "GCM builds a counter block J0 from the random 96-bit IV you see displayed, with a 32-bit counter appended starting at 1. Each 128-bit block of your plaintext is XORed with AES(K, J0 + i), and the counter increments for every block — exactly the CTR mode covered in the AES module. This is also why the ciphertext is exactly as long as the plaintext: GCM never pads.",
        ],
        math: [{ expr: "C_i = P_i \\oplus \\mathrm{AES}(K,\\ J_0 + i)" }],
      },
      {
        heading: "Authenticating: GHASH and the tag",
        body: [
          "While the ciphertext is produced, GCM separately runs it through GHASH — built entirely from multiplication in the finite field GF(2¹²⁸), keyed by H = AES(K, 0¹²⁸). Each ciphertext block is folded in one at a time (Horner's method), so the final result depends on every bit of the ciphertext, in order.",
          "The 16-byte tag appended to your ciphertext is this GHASH output XORed with AES(K, J0) — the same counter-mode building block used for encryption, applied once more to seal the tag.",
        ],
        math: [
          { expr: "X_i = (X_{i-1} \\oplus C_i) \\cdot H", caption: "GHASH folds in one ciphertext block at a time." },
          { expr: "T = \\mathrm{GHASH}(H, C) \\oplus \\mathrm{AES}(K, J_0)" },
        ],
        diagram: {
          type: "sequence",
          title: "What one click of \"Encrypt\" actually runs",
          steps: [
            { label: "Build J0", detail: "The random IV plus a starting counter of 1." },
            { label: "Encrypt via counter mode", detail: "Each block XORed with AES(K, J0 + i) to produce ciphertext." },
            { label: "Fold ciphertext through GHASH", detail: "Every ciphertext block multiplied into a running value in GF(2¹²⁸)." },
            { label: "Seal the tag", detail: "GHASH output XORed with AES(K, J0) — the 16 bytes shown as the auth tag." },
          ],
        },
      },
      {
        heading: "Why the tamper button breaks decryption",
        body: [
          "\"Tamper with 1 byte\" flips 8 bits of ciphertext before decryption. Multiplication in GF(2¹²⁸) has the same avalanche property as a hash function — one changed input bit changes GHASH's output completely and unpredictably. Your browser recomputes the tag from the (now tampered) ciphertext, compares it to the 16 bytes that travelled alongside it, finds no match, and crypto.subtle.decrypt() throws rather than returning any plaintext at all, even a single correct byte.",
        ],
      },
    ],
  },
  {
    slug: "sha-256",
    title: "SHA-256 & the avalanche effect",
    summary:
      "Hash any text live and watch the digest change completely when you edit a single character.",
    relatedModule: "hash-functions-and-signatures",
    category: "Foundations",
    howItWorks: [
      {
        heading: "From text to bytes",
        body: [
          "Whatever you type is first converted to UTF-8 bytes — a real difference from \"characters\": an emoji or accented letter can take up several bytes, and SHA-256 hashes those bytes, not an abstract idea of \"characters\".",
        ],
      },
      {
        heading: "Padding to a whole number of blocks",
        body: [
          "SHA-256 only processes complete 512-bit (64-byte) blocks. Your message is padded: a single 1 bit is appended, then as many 0 bits as needed, then the original bit-length as a 64-bit number — leaving a result that's an exact multiple of 512 bits. For a short string like this tool's defaults, that's a single block.",
        ],
        math: [{ expr: "\\text{len}(\\text{message}) + 1 + \\text{zeros} + 64 \\equiv 0 \\pmod{512}" }],
      },
      {
        heading: "64 rounds of mixing",
        body: [
          "That padded block runs through 64 rounds of bitwise rotation, shifting, and modular addition, updating eight 32-bit working variables derived from SHA-256's fixed initial constants. The result becomes the chaining value fed to the next block — the Merkle-Damgård construction covered in the Hash functions module — or, since there's only one block here, the digest itself.",
        ],
      },
      {
        heading: "Why editing one character changes everything",
        body: [
          "Each of those 64 rounds is designed to spread every input bit's influence across the entire internal state within a handful of rounds, the same avalanche principle behind AES. Change a single UTF-8 byte at the very start, and by round 64 essentially every one of the 256 output bits has an even chance of flipping — exactly what you see comparing the two digests above.",
        ],
      },
    ],
  },
  {
    slug: "hmac",
    title: "HMAC sign & verify",
    summary:
      "Compute a real HMAC-SHA256 over a message and secret, then see why changing even one bit of the message makes verification fail.",
    relatedModule: "hash-functions-and-signatures",
    category: "Foundations",
    howItWorks: [
      {
        heading: "Turning one secret into two padded keys",
        body: [
          "HMAC first pads (or, if it's longer than one block, hashes down) your secret to SHA-256's 64-byte block size, producing K′. That padded key is then XORed with two fixed constants — ipad (0x36 repeated) and opad (0x5c repeated) — producing two different derived keys from the one secret you typed.",
        ],
      },
      {
        heading: "Two nested hashes",
        body: [
          "The inner hash covers the padded-and-XORed key plus your actual message. The outer hash covers the padded-and-XORed key (with the other constant) plus that inner result. The hex string labeled \"Tag\" is the output of the outer hash — a single 32-byte value.",
        ],
        math: [
          {
            expr: "\\mathrm{HMAC}(K, m) = H\\big((K' \\oplus \\mathrm{opad}) \\,\\|\\, H((K' \\oplus \\mathrm{ipad}) \\,\\|\\, m)\\big)",
          },
        ],
      },
      {
        heading: "Why not just H(secret ‖ message)?",
        body: [
          "The simpler-looking H(secret ‖ message) is vulnerable to length-extension attacks, covered in detail in the Hash functions module — an attacker who knows H(secret ‖ message) can compute H(secret ‖ message ‖ extra) without ever learning the secret. HMAC's nested double-hash construction closes that gap; it's not a stylistic choice.",
        ],
      },
      {
        heading: "What the Verify button actually checks",
        body: [
          "It recomputes HMAC(secret, message) from scratch, using whatever is currently in the message and secret fields, and compares the result to the tag you provided. Production systems use a constant-time comparison for this exact step — comparing byte by byte and stopping at the first mismatch leaks timing information about how many leading bytes matched, the same class of issue covered in the side-channel module. This demo uses a simple equality check for clarity.",
        ],
      },
    ],
  },
  {
    slug: "rsa-oaep",
    title: "RSA key generation & OAEP encryption",
    summary:
      "Generate a real 2048-bit RSA key pair in your browser, encrypt a short message with the public key, and decrypt it with the private key.",
    relatedModule: "rsa-public-key",
    category: "Public-key",
    howItWorks: [
      {
        heading: "Building the data block",
        body: [
          "Before any RSA math happens, your plaintext is packaged into a data block: the SHA-256 hash of an (empty, by default) label, then a string of zero bytes as padding, then a single 0x01 separator byte, then your actual message.",
        ],
        math: [{ expr: "DB = \\mathrm{lHash} \\,\\|\\, PS \\,\\|\\, \\texttt{0x01} \\,\\|\\, M" }],
        diagram: {
          type: "structure",
          title: "The OAEP data block (DB)",
          blocks: [
            { label: "lHash", detail: "SHA-256 of the label (empty string by default) — always 32 bytes." },
            { label: "PS", detail: "Zero bytes, padding DB out to a fixed total length." },
            { label: "0x01", detail: "A single separator byte marking where the padding ends." },
            { label: "M", detail: "Your plaintext message." },
          ],
        },
      },
      {
        heading: "Masking twice with MGF1",
        body: [
          "A random seed is generated, then MGF1 (a mask generation function built from repeatedly hashing seed‖counter) stretches it into a mask the same length as DB. That mask is XORed into DB to produce maskedDB. Then MGF1 runs again, this time on maskedDB, to produce a second mask that's XORed with the original seed to produce maskedSeed.",
        ],
        math: [
          { expr: "\\mathrm{dbMask} = \\mathrm{MGF1}(\\mathrm{seed}) \\qquad \\mathrm{maskedDB} = DB \\oplus \\mathrm{dbMask}" },
          { expr: "\\mathrm{seedMask} = \\mathrm{MGF1}(\\mathrm{maskedDB}) \\qquad \\mathrm{maskedSeed} = \\mathrm{seed} \\oplus \\mathrm{seedMask}" },
        ],
        diagram: {
          type: "sequence",
          title: "OAEP's two-round masking",
          steps: [
            { label: "Generate a random seed", detail: "32 bytes, fresh every time you click Encrypt — this is what makes RSA-OAEP non-deterministic." },
            { label: "Mask the data block", detail: "maskedDB = DB ⊕ MGF1(seed) — the seed's randomness now covers the whole message." },
            { label: "Mask the seed", detail: "seedMask = MGF1(maskedDB); maskedSeed = seed ⊕ seedMask — the seed now depends on the message too." },
            { label: "Assemble EM", detail: "EM = 0x00 ‖ maskedSeed ‖ maskedDB — this is what actually gets RSA-encrypted." },
          ],
        },
      },
      {
        heading: "Then, and only then, the RSA step",
        body: [
          "Everything above happens before any modular exponentiation. The assembled encoded message EM is what gets raised to the public exponent: C = EMᵉ mod n, using the same textbook RSA formula covered in the RSA module. The base64 string labeled \"Ciphertext\" in this tool is exactly that C, encoded.",
        ],
      },
      {
        heading: "Decrypting: unmask, then check the structure",
        body: [
          "Decryption computes Cᵈ mod n to recover EM, then reverses the masking (recover seed from maskedSeed, then DB from maskedDB) and checks the result's structure: does it start with 0x00, does the recomputed lHash match, is the padding string all zero bytes, and is there a 0x01 separator in the right place? Only if every check passes is M returned.",
          "This is exactly why the \"wrong private key\" button in this tool fails outright rather than returning garbled text: Cᵈ mod n with the wrong d produces essentially random bytes, and the odds that random bytes happen to satisfy \"starts with a valid hash, has a correctly placed separator, all-zero padding\" are astronomically small. The browser detects the malformed structure and throws, rather than silently returning nonsense.",
        ],
      },
    ],
  },
  {
    slug: "ecdsa",
    title: "ECDSA sign & verify",
    summary:
      "Generate a real P-256 key pair, sign a message, verify it — then tamper with the message and watch verification reject it.",
    relatedModule: "elliptic-curve-cryptography",
    category: "Public-key",
    howItWorks: [
      {
        heading: "Hashing the message first",
        body: [
          "ECDSA never signs raw message bytes directly — the hash: \"SHA-256\" parameter in this tool's sign() call means your message is reduced to a 256-bit digest first, and everything below operates on that digest, not your original text.",
        ],
      },
      {
        heading: "Choosing k and computing (r, s)",
        body: [
          "Your browser generates a fresh random nonce k for this specific signature — never reused, never exposed by this tool — and combines it with your private key exactly as covered in the ECC module's nonce-leak section.",
        ],
        math: [
          {
            expr: "r = (k \\cdot G)_x \\bmod n \\qquad s = k^{-1}(H(m) + r \\cdot d) \\bmod n",
          },
        ],
      },
      {
        heading: "The signature you copy is raw r‖s, not DER",
        body: [
          "The base64 string this tool shows you decodes to exactly 64 bytes for P-256: the 32-byte big-endian r immediately followed by the 32-byte big-endian s (the IEEE P1363 format). This is a Web Crypto–specific choice — most other libraries, and the ASN.1 DER encoding used inside X.509 certificates, wrap r and s in a different structure, so raw Web Crypto signatures aren't directly interchangeable with those formats without conversion.",
        ],
        math: [{ expr: "|\\text{signature}| = 2 \\times 32 = 64 \\text{ bytes, for P-256}" }],
      },
      {
        heading: "Verifying: recomputing a point, not decrypting",
        body: [
          "Verification is not \"decrypt the signature and compare\" — ECDSA has no decryption step. Instead, the verifier computes two values from the signature and the public key, uses them to reconstruct a curve point, and checks whether that point's x-coordinate equals r.",
          "Swap in a different public key, as this tool's \"wrong key\" button does, and Q changes — which changes the reconstructed point entirely. The odds that an unrelated point's x-coordinate happens to equal the original r are astronomically small, which is exactly why verification fails cleanly rather than partially.",
        ],
        math: [
          {
            expr: "u_1 = H(m) s^{-1} \\bmod n \\qquad u_2 = r s^{-1} \\bmod n \\qquad (u_1 G + u_2 Q)_x \\stackrel{?}{=} r",
          },
        ],
      },
    ],
  },
  {
    slug: "ecdh",
    title: "ECDH key exchange",
    summary:
      "Simulate Alice and Bob generating independent key pairs and deriving the exact same shared secret — without ever transmitting it.",
    relatedModule: "diffie-hellman-key-exchange",
    category: "Public-key",
    howItWorks: [
      {
        heading: "Each side does one scalar multiplication",
        body: [
          "\"Derive shared secret\" runs one elliptic-curve scalar multiplication per side, using the same double-and-add computation covered in the ECC module: Alice multiplies Bob's public point by her own private scalar; Bob multiplies Alice's public point by his.",
        ],
        math: [{ expr: "\\text{Alice: } a \\cdot (bG) \\qquad \\text{Bob: } b \\cdot (aG)" }],
      },
      {
        heading: "Landing on the same point, from different directions",
        body: [
          "Scalar multiplication on an elliptic curve group is associative and commutative in exactly the way that matters here: a·(bG) and b·(aG) are both equal to (ab)G. Neither side ever computes or transmits ab directly — each only ever touches their own private scalar and the other side's public point.",
        ],
      },
      {
        heading: "From a curve point to 256 raw bits",
        body: [
          "The value handed back by deriveBits() isn't hashed or processed further — the Web Crypto spec defines it as the raw x-coordinate of that shared point, encoded as a fixed-length big-endian byte string. That's exactly the hex value labeled \"Secret\" in this tool.",
          "Raw curve coordinates like this aren't perfectly uniformly distributed as random bits — some x-coordinates are reachable from more private keys than others — so real protocols always run this value through a proper key derivation function (HKDF, covered in the key derivation module) before using it as an encryption key. This tool shows the raw value specifically so you can see what ECDH actually outputs, before that extra step most applications add on top.",
        ],
      },
      {
        heading: "Why Mallory's attempt lands somewhere else entirely",
        body: [
          "Mallory has her own, completely unrelated private scalar m. Multiplying it by Alice's public point gives m·(aG) — a real, valid point on the curve, but with no algebraic relationship to Bob's private key b. There's no shortcut from \"any point on the curve\" back to \"the specific point only someone holding Bob's exact private key could reach\" — that shortcut not existing is the elliptic curve discrete logarithm problem itself, the same hard problem the ECC module is built around.",
        ],
      },
    ],
  },
  {
    slug: "jwt",
    title: "JWT builder & decoder",
    summary:
      "Build a real HMAC-signed JWT from your own claims, or paste one in to decode its header and payload and verify its signature.",
    relatedModule: "jwt-and-api-auth",
    category: "Protocols",
    howItWorks: [
      {
        heading: "Encoding header and payload",
        body: [
          "\"Build\" first turns the fixed header object and your claims object into JSON text, then base64url-encodes each one separately (base64url is ordinary base64 with URL-unsafe characters swapped out and padding removed). Nothing here is encrypted — it's a length-preserving, fully reversible encoding.",
        ],
      },
      {
        heading: "Signing: HMAC over the literal string \"header.payload\"",
        body: [
          "The signing input isn't the header and payload objects — it's the literal ASCII string formed by joining their two base64url encodings with a single period. That exact string is what gets fed into HMAC-SHA256, using the same nested double-hash construction covered in the HMAC tool, alongside your secret.",
        ],
        math: [
          {
            expr: "\\text{signature} = \\mathrm{HMAC\\text{-}SHA256}(\\text{base64url(header)} \\,\\|\\, \\texttt{\".\"} \\,\\|\\, \\text{base64url(payload)},\\ \\text{secret})",
          },
        ],
      },
      {
        heading: "Decoding: split first, verify second",
        body: [
          "\"Decode\" does nothing cryptographic at all — it splits the token on its two dots and base64url-decodes the first two segments back into readable JSON. This is exactly why anyone can read a JWT's claims without knowing the secret: decoding and verifying are two entirely separate operations in this tool, and only the second one ever touches the signature.",
        ],
      },
      {
        heading: "Verifying: recompute, don't decrypt",
        body: [
          "\"Verify signature\" recomputes HMAC-SHA256 over the token's own header.payload string, using whatever secret you've entered, and compares the result to the signature segment already in the token — the same recompute-and-compare pattern as the HMAC tool, just applied to a specific, standardized signing input.",
        ],
      },
    ],
  },
];

export function getPlaygroundTool(slug: string): PlaygroundTool | undefined {
  return playgroundTools.find((t) => t.slug === slug);
}
