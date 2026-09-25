import type { Section } from "./content";

export interface PlaygroundTool {
  slug: string;
  title: string;
  summary: string;
  relatedModule?: string;
  relatedUseCases?: string[];
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
        heading: "The same thing, as a block diagram",
        body: [
          "The encryption path (top) and the authentication path (bottom) run side by side — the ciphertext produced on top feeds directly into the GHASH chain on the bottom, and the tag is what comes out the other end.",
        ],
        diagram: { type: "gcm" },
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
        heading: "The same masking, as a block diagram",
        body: [
          "Each half masks the other: the seed masks DB into maskedDB, and maskedDB then masks the seed into maskedSeed. The three pieces — a leading 0x00 byte, maskedSeed, and maskedDB — concatenate directly into EM.",
        ],
        diagram: { type: "oaep" },
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
        diagram: {
          type: "swimlane",
          leftActor: "Alice",
          rightActor: "Bob",
          messages: [
            { from: "left", label: "public key A = aG" },
            { from: "right", label: "public key B = bG" },
          ],
          caption: "That's the entire exchange — only the public keys shown above ever cross the wire. Everything after this point happens independently on each side.",
        },
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
    slug: "tls-key-schedule",
    title: "TLS 1.3 key schedule: from ECDH to a traffic key",
    summary:
      "Run a real ECDH exchange, feed it through real HKDF bound to a transcript hash, and use the result to AES-GCM-encrypt a record — the exact chain TLS 1.3 runs on every connection.",
    relatedModule: "tls-in-practice",
    category: "Protocols",
    howItWorks: [
      {
        heading: "The same ECDH exchange, applied to a specific purpose",
        body: [
          "\"Run handshake\" starts exactly like the ECDH tool: independent P-256 key pairs for Client and Server, each deriving the identical shared secret via scalar multiplication. What's different here is everything that happens to that shared secret afterward — TLS 1.3 never uses a raw ECDH output as an encryption key directly.",
        ],
      },
      {
        heading: "Binding the secret to this exact handshake, via HKDF",
        body: [
          "The shared secret is imported as HKDF input key material and run through crypto.subtle.deriveKey with the HKDF algorithm — real HKDF (RFC 5869), the same construction the key derivation functions module covers, not a simulation. Its info parameter carries a hash of this simulated handshake's own transcript (a running SHA-256 over the Hello messages both sides just exchanged), which is what cryptographically ties the resulting key to this specific connection — reusing the identical shared secret in a different handshake, with a different transcript, would derive a completely different key.",
        ],
        math: [
          {
            expr: "\\text{traffic key} = \\mathrm{HKDF}(\\text{salt} = \\varnothing,\\ \\text{IKM} = \\text{ECDH secret},\\ \\text{info} = H(\\text{transcript}))",
          },
        ],
      },
      {
        heading: "Extract, then Expand",
        body: [
          "HKDF is two stages folded into one Web Crypto call: Extract pools the shared secret's entropy into a fixed-size pseudorandom key, and Expand stretches that into an output of exactly the length requested — 256 bits here, sized for the AES-GCM key it becomes. Real TLS 1.3 runs this same two-stage process several times over the course of a handshake (early, handshake, and application traffic secrets, each further split into client-write and server-write keys); this tool collapses that down to one derivation to keep the core mechanism visible.",
        ],
      },
      {
        heading: "The derived key encrypts a real record",
        body: [
          "\"Encrypt application data\" takes the HKDF output directly as an AES-256-GCM key — no separate key-generation step — and encrypts your message exactly as the AES-GCM tool does: a random IV, ciphertext, and a 16-byte authentication tag.",
        ],
      },
      {
        heading: "Why the server lands on the identical key, independently",
        body: [
          "\"Server derives & decrypts\" runs the mirrored computation: the server's own ECDH scalar multiplication (landing on the same point, since ECDH is commutative), the same transcript hash (both sides hashed the identical exchanged messages), and the identical HKDF call — producing a bit-for-bit identical traffic key with no key ever having crossed the wire. That's the entire trick: everything two sides need to agree on a key is either public (the transcript) or independently derivable (the shared secret), never transmitted.",
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
  {
    slug: "pbkdf2",
    title: "PBKDF2 password hashing",
    summary:
      "Derive a real key from a password with a tunable iteration count, and feel the cost difference between 1,000 and 600,000 iterations yourself.",
    relatedModule: "key-derivation-functions",
    category: "Foundations",
    howItWorks: [
      {
        heading: "What the iteration count actually does",
        body: [
          "PBKDF2 applies HMAC-SHA256 to the password and salt, then feeds that output back in as input for another round of HMAC, repeated for however many iterations you choose. Each round is cheap on its own; multiplied by hundreds of thousands of rounds, it becomes deliberately, measurably slow.",
        ],
        math: [
          { expr: "\\mathrm{DK} = \\mathrm{PBKDF2}(\\text{password}, \\text{salt}, c, \\text{dkLen})", caption: "c is the iteration count you picked above." },
        ],
      },
      {
        heading: "Why the timer matters",
        body: [
          "The elapsed-time readout after you click \"Derive key\" isn't a UI flourish — it's the entire point made concrete. An attacker checking a stolen password database against a wordlist pays that exact same per-guess cost, for every single guess. At 1,000 iterations that cost is negligible; at 600,000 it starts to meaningfully slow down large-scale guessing, at the price of also slowing down your own legitimate login checks.",
        ],
      },
      {
        heading: "Salt: public, but not pointless",
        body: [
          "The salt travels in the clear right alongside the derived key — it isn't a secret. Its job is narrower: it guarantees two users with the same password get completely different derived keys, which defeats precomputed rainbow-table attacks that only work when the same input always produces the same output.",
        ],
      },
      {
        heading: "Why this tool doesn't offer Argon2",
        body: [
          "The Web Crypto API implements PBKDF2 natively in every browser; it doesn't implement Argon2, bcrypt, or scrypt at all — those would require a third-party WebAssembly library, which this playground deliberately avoids so that every tool here runs on nothing but your browser's own built-in, audited cryptography. The key derivation functions module covers all four algorithms and explains why Argon2 is the current recommendation for new systems.",
        ],
      },
    ],
  },
  {
    slug: "envelope-encryption",
    title: "Envelope encryption & key wrapping",
    summary:
      "Generate a real KMS-style KEK, wrap a fresh DEK with it via RSA-OAEP, encrypt data locally, then unwrap and decrypt — plus a second panel wrapping a key with real AES Key Wrap (RFC 3394).",
    relatedModule: "symmetric-key-aes",
    relatedUseCases: ["kms-envelope-encryption", "kms-key-wrapping-and-exchange"],
    category: "Public-key",
    howItWorks: [
      {
        heading: "Two keys, generated for two different jobs",
        body: [
          "\"Generate KEK\" creates a real 2048-bit RSA-OAEP key pair, marked wrapKey/unwrapKey only — standing in for a KMS's master key. \"Generate DEK\" creates a real AES-256-GCM key, marked extractable, standing in for the fast, local, per-object data key the envelope-encryption use case describes.",
        ],
      },
      {
        heading: "Wrapping: one Web Crypto call, not a manual RSA step",
        body: [
          "\"Wrap DEK\" calls crypto.subtle.wrapKey directly — it exports the DEK's raw bytes and RSA-OAEP-encrypts them in a single atomic operation, so the DEK's plaintext bytes never separately exist in a variable your own code could accidentally log or leak. The result is exactly the size the RSA & public-key module's arithmetic predicts: a 2048-bit modulus produces a 256-byte wrapped output, regardless of the 256-bit DEK's own size.",
        ],
        math: [{ expr: "|\\text{wrapped DEK}| = \\frac{2048}{8} = 256 \\text{ bytes}" }],
      },
      {
        heading: "Encrypting data locally, and unwrapping to read it back",
        body: [
          "\"Encrypt\" runs ordinary AES-256-GCM with the plaintext DEK, exactly like the AES-GCM tool. \"Unwrap & decrypt\" reverses the whole path: crypto.subtle.unwrapKey RSA-OAEP-decrypts the wrapped bytes and reconstructs a usable AES-GCM CryptoKey in one step, which then decrypts the stored ciphertext — the KMS-equivalent key (the KEK) never touches the actual data at any point.",
        ],
      },
      {
        heading: "What tampering the wrapped DEK actually breaks",
        body: [
          "\"Tamper with wrapped DEK\" flips one byte of the wrapped bytes before unwrapping. RSA-OAEP's own structural checks (covered in the RSA-OAEP tool) fail on the corrupted decryption output, and unwrapKey throws outright — there's no partial or garbled key recovered, just a clean failure.",
        ],
      },
      {
        heading: "The symmetric alternative: AES Key Wrap",
        body: [
          "The second panel wraps the same kind of AES key using AES-KW (RFC 3394) instead of RSA-OAEP — a completely different Web Crypto algorithm, requiring a shared symmetric wrapping key rather than a public/private pair. Watch the byte count: a 256-bit (32-byte) key wrapped this way always comes out exactly 40 bytes, the fixed 8-byte integrity-check overhead the key-wrapping use case describes, verified live rather than just asserted.",
        ],
        math: [{ expr: "|\\text{AES-KW output}| = 32 + 8 = 40 \\text{ bytes, always}" }],
      },
    ],
  },
  {
    slug: "cert-chain",
    title: "Certificate chain builder",
    summary:
      "Build a real three-link chain of trust — root, intermediate, and leaf — each signed with real ECDSA, then tamper with the leaf and watch verification catch it.",
    relatedModule: "digital-certificates-x509",
    category: "Public-key",
    howItWorks: [
      {
        heading: "What this tool simplifies, and what's real",
        body: [
          "A real X.509 certificate is a binary, ASN.1 DER-encoded structure with dozens of possible fields and extensions — producing one requires a dedicated encoding library, not just the Web Crypto API. This tool signs a simplified JSON structure ({subject, issuer, publicKey}) instead, so it can demonstrate the actual chain-of-trust mechanism using nothing but real, in-browser ECDSA. Every cryptographic operation here — key generation, signing, verification — is genuine; only the wire format is simplified.",
        ],
      },
      {
        heading: "Issuing a certificate: sign the child's identity with the parent's key",
        body: [
          "\"Generate\" builds the chain bottom-up in terms of trust, top-down in terms of signing: the root signs its own subject and public key (a self-signed root, exactly like a real root CA), then signs the intermediate's; the intermediate, in turn, signs the leaf's.",
        ],
        math: [{ expr: "\\text{signature} = \\mathrm{ECDSA\\_sign}(\\text{issuer's private key},\\ \\{\\text{subject}, \\text{issuer}, \\text{publicKey}\\})" }],
        diagram: {
          type: "sequence",
          title: "Verifying the chain, leaf to root",
          steps: [
            { label: "Verify the leaf", detail: "Check the leaf's signature using the intermediate's public key." },
            { label: "Verify the intermediate", detail: "Check the intermediate's signature using the root's public key." },
            { label: "Verify the root", detail: "Check the root's self-signature using its own public key." },
            { label: "Trust, if every link checks out", detail: "One broken link anywhere in the chain is enough to reject the whole thing." },
          ],
        },
      },
      {
        heading: "Why tampering the subject breaks verification",
        body: [
          "The signature is computed over the exact bytes of {subject, issuer, publicKey} at issuance time. \"Tamper with the leaf's subject\" edits that field afterward without re-signing — so verification recomputes what the signature should cover, gets a different result than what was actually signed, and rejects it. This is the identical hash-then-sign tamper-evidence property covered in the hashing and signatures module, applied to a certificate instead of a message.",
        ],
      },
    ],
  },
  {
    slug: "cert-revocation",
    title: "Certificate revocation: valid signature, still not trusted",
    summary:
      "Build the same real three-link ECDSA chain as the certificate chain builder, then revoke the intermediate and watch a mathematically perfect signature still get rejected.",
    relatedModule: "digital-certificates-x509",
    relatedUseCases: ["pki-in-production"],
    category: "Public-key",
    howItWorks: [
      {
        heading: "Two separate checks, easy to conflate",
        body: [
          "This tool builds the identical real ECDSA root → intermediate → leaf chain as the certificate chain builder — nothing about the key generation or signing changes. What's added is a second, entirely non-cryptographic check that real verification always runs alongside the mathematical one: is every certificate in this chain still supposed to be trusted, independent of whether its signature checks out?",
        ],
      },
      {
        heading: "What \"Revoke\" actually does here — and doesn't",
        body: [
          "Clicking \"Revoke intermediate\" doesn't touch a single key or signature. It adds the intermediate's identifier to a revocation list held only in this tool's local state — the same role a real CRL or OCSP responder plays. The intermediate's signature over the leaf is exactly as mathematically valid after revocation as before; revocation is a statement about trust, layered on top of, not baked into, the signature math.",
        ],
        diagram: {
          type: "compare",
          left: {
            title: "Signature check",
            points: [
              "Purely mathematical — did the claimed issuer's private key produce this exact signature?",
              "Unaffected by revocation — a revoked cert's old signatures remain mathematically valid forever",
            ],
          },
          right: {
            title: "Revocation check",
            points: [
              "An operational lookup — is this certificate (or one above it in the chain) on a revocation list?",
              "The only thing that changes when you click Revoke — no keys or signatures are touched",
            ],
          },
        },
      },
      {
        heading: "Why revoking the intermediate — not the leaf — still blocks everything under it",
        body: [
          "\"Verify chain\" runs the signature checks first (they still pass — nothing was tampered), then separately walks every certificate in the chain against the revocation list. Revoking the intermediate fails that second check for the leaf too, even though the leaf itself was never directly revoked: trust doesn't survive a revoked link anywhere above it in the chain. This is exactly the blast-radius containment the PKI-in-production use case describes — revoking one compromised intermediate immediately untrusts everything it ever issued, without needing to touch the root or re-issue anything at the root level.",
        ],
      },
    ],
  },
  {
    slug: "pkcs11-session",
    title: "A PKCS#11 session, using real keys",
    summary:
      "Walk through an actual Cryptoki call sequence — login, generate a key pair, sign, and attempt to wrap a non-extractable private key — with real Web Crypto operations standing in for the hardware token.",
    relatedModule: "rsa-public-key",
    relatedUseCases: ["pkcs11-cryptographic-tokens"],
    category: "Public-key",
    howItWorks: [
      {
        heading: "The browser as a stand-in token",
        body: [
          "There's no way for a web page to reach a real HSM or smart card driver, so this tool doesn't try to simulate one. Instead, it runs a real ECDSA key pair through the browser's own Web Crypto API, narrated with the exact Cryptoki function names a real token-backed application would call in the same order — C_OpenSession, C_GenerateKeyPair, C_Sign, and so on. Every cryptographic operation you see is genuine; only the \"hardware\" is a stand-in.",
        ],
      },
      {
        heading: "extractable is CKA_EXTRACTABLE",
        body: [
          "Clicking \"Generate key pair\" calls crypto.subtle.generateKey with the private key's extractable flag set to false — the browser's direct equivalent of a token creating an object with CKA_EXTRACTABLE = false. This isn't cosmetic: the browser itself will now refuse any attempt to export or wrap that specific key handle, for the rest of the page's life. Nothing in this tool's own code enforces that refusal — the underlying platform does, exactly like a real token's firmware would.",
        ],
      },
      {
        heading: "C_Sign works; C_WrapKey doesn't",
        body: [
          "Signing (C_SignInit + C_Sign in Cryptoki terms) works normally — using a non-extractable key for its intended operation is exactly what CKA_EXTRACTABLE = false is meant to allow. But clicking \"Attempt C_WrapKey\" calls crypto.subtle.wrapKey on that same private key handle, which throws — a real InvalidAccessError, not a message this tool invented. That's the identical refusal (CKR_KEY_UNEXTRACTABLE) a correctly configured token gives when an application asks it to do something CKA_EXTRACTABLE was specifically set to prevent.",
        ],
        diagram: {
          type: "compare",
          left: {
            title: "What CKA_EXTRACTABLE = false allows",
            points: [
              "Sign, verify, encrypt, decrypt — using the key, as many times as needed",
              "Generating new key pairs, indefinitely",
            ],
          },
          right: {
            title: "What it blocks — no exceptions",
            points: [
              "Exporting the raw key value, in any format",
              "Wrapping the key under another key — wrapping is still a form of export",
            ],
          },
        },
      },
      {
        heading: "The correct way to move a key off the token",
        body: [
          "The last section generates a separate, ordinary AES data key with extractable: true — the equivalent of a session key that's meant to be exported — and wraps that one successfully with AES-KW, the same mechanism used in the key-wrapping use case. This is the actual PKCS#11 pattern for moving key material: never make a long-lived private signing key extractable; generate short-lived, extractable session keys instead, and wrap only those.",
        ],
      },
    ],
  },
  {
    slug: "x3dh",
    title: "X3DH: key agreement while offline",
    summary:
      "Simulate Bob publishing a key bundle and going offline, then Alice computing a shared secret from it anyway — the mechanism behind Signal's first-message problem.",
    relatedModule: "secure-messaging-signal-protocol",
    category: "Protocols",
    howItWorks: [
      {
        heading: "Why one Diffie-Hellman isn't enough here",
        body: [
          "The ECDH tool's exchange needs both sides online to swap public keys in real time. X3DH's trick is precomputing several DH values from keys Bob published in advance, so Alice — the sender — can complete every DH computation herself, without Bob's participation at that moment at all.",
        ],
      },
      {
        heading: "Four DH computations, folded into one secret",
        body: [
          "\"Alice fetches the bundle\" runs four separate ECDH computations, mixing her own identity and ephemeral keys with Bob's published identity key, signed prekey, and one-time prekey.",
        ],
        math: [
          { expr: "DH_1 = IK_A \\times SPK_B \\qquad DH_2 = EK_A \\times IK_B \\qquad DH_3 = EK_A \\times SPK_B \\qquad DH_4 = EK_A \\times OPK_B" },
        ],
      },
      {
        heading: "Combining them: a simplified stand-in for HKDF",
        body: [
          "This tool concatenates the four raw DH outputs and hashes the result with SHA-256 to produce a single shared secret. Real X3DH runs that same concatenation through HKDF (covered in the key derivation functions module) instead of a plain hash, to get a properly uniform, arbitrary-length key rather than exactly one SHA-256 digest — a simplification made here for clarity, not a difference in the core idea.",
        ],
      },
      {
        heading: "Why Bob can compute the identical secret, later",
        body: [
          "When Bob comes back online, he runs the mirrored computation — his private keys against Alice's public keys, in the same four combinations — and lands on the same four DH values Alice did, because ECDH is commutative: a·(bG) and b·(aG) are the same point, regardless of which side's private key did the multiplying. That's the exact property the ECDH tool demonstrates directly.",
        ],
      },
    ],
  },
];

export function getPlaygroundTool(slug: string): PlaygroundTool | undefined {
  return playgroundTools.find((t) => t.slug === slug);
}
