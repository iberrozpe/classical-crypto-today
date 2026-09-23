export type RoleId =
  | "executive"
  | "grc"
  | "developer"
  | "architect"
  | "itops"
  | "researcher"
  | "curious";

export interface MathBlock {
  expr: string;
  caption?: string;
}

export type DiagramSpec =
  | { type: "sequence"; title?: string; steps: { label: string; detail?: string }[] }
  | { type: "structure"; title?: string; blocks: { label: string; detail?: string }[] }
  | {
      type: "compare";
      left: { title: string; points: string[] };
      right: { title: string; points: string[] };
    }
  | { type: "merkle" }
  | { type: "grid"; title?: string; rows: string[][]; caption?: string }
  | { type: "ec-point-addition" }
  | {
      type: "swimlane";
      title?: string;
      leftActor: string;
      rightActor: string;
      messages: { from: "left" | "right"; label: string }[];
      caption?: string;
    }
  | { type: "pipeline"; title?: string; steps: string[]; loopLabel?: string; caption?: string }
  | { type: "gcm" }
  | { type: "oaep" };

export interface Section {
  heading: string;
  body: string[];
  math?: MathBlock[];
  diagram?: DiagramSpec;
}

export interface Module {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  tags: RoleId[];
  category: "Foundations" | "Public-key" | "Symmetric-key" | "Protocols" | "Practice";
  sections: Section[];
}

export const modules: Module[] = [
  {
    slug: "math-foundations-modular-arithmetic",
    title: "The math underneath: modular arithmetic & one-way functions",
    summary:
      "Every public-key algorithm in this catalog leans on the same idea: a calculation that's easy in one direction and effectively impossible to undo in the other.",
    minutes: 10,
    category: "Foundations",
    tags: ["developer", "researcher", "curious"],
    sections: [
      {
        heading: "One-way functions, informally",
        body: [
          "A one-way function is easy to compute in one direction and computationally infeasible to reverse. Multiplying two large primes together is easy; taking the product and recovering the original primes is hard. Raising a number to a power modulo another number is easy; working backward to find the exponent (the discrete logarithm) is hard. Nearly every public-key algorithm in this catalog is built on one of these two asymmetries.",
        ],
      },
      {
        heading: "Modular arithmetic in one paragraph",
        body: [
          "Modular arithmetic is arithmetic that wraps around, the way a clock wraps from 12 back to 1. \"7 mod 5\" means: divide 7 by 5 and keep the remainder — 2. Cryptography works almost entirely inside these wrapped, finite number systems (rather than the infinite integers) because they have exactly the algebraic structure needed: every operation stays inside a fixed, finite set of possible values, which is what makes both the 'easy direction' and the 'hard direction' well-defined and analyzable.",
        ],
        math: [
          {
            expr: "a \\equiv b \\pmod{n} \\iff n \\mid (a-b)",
            caption: "a and b are \"congruent mod n\" whenever n divides their difference — e.g. 7 ≡ 2 (mod 5).",
          },
        ],
      },
      {
        heading: "Trapdoors: a shortcut for the key-holder",
        body: [
          "A trapdoor function is a one-way function with a secret that makes the hard direction easy again — but only if you know the secret. RSA's trapdoor is knowledge of the two prime factors of the modulus; with them, decryption is a fast modular exponentiation, but without them, an attacker faces the full difficulty of factoring. This single idea — one-way in general, easy with a secret — is the mechanism that makes a public key public and a private key private.",
        ],
        diagram: {
          type: "compare",
          left: {
            title: "Without the trapdoor (anyone)",
            points: [
              "Easy: compute y = f(x) from x",
              "Hard: recover x from y alone — needs brute force or a hard math problem",
              "This is the public, one-way direction everyone can use",
            ],
          },
          right: {
            title: "With the trapdoor (key-holder)",
            points: [
              "Same y = f(x) as anyone else",
              "Easy: recover x from y — because the secret (e.g. the prime factors) turns the hard problem back into simple arithmetic",
              "This is what makes a private key private",
            ],
          },
        },
      },
    ],
  },
  {
    slug: "symmetric-key-aes",
    title: "Symmetric-key cryptography & AES",
    summary:
      "The same key locks and unlocks the data. Fast, simple in concept, and everywhere — from disk encryption to the bulk of every TLS session.",
    minutes: 26,
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
        math: [
          {
            expr: "2^{128} \\approx 3.4 \\times 10^{38} \\text{ candidate keys}",
            caption: "Roughly 10 billion times more than the estimated number of stars in the observable universe.",
          },
        ],
        diagram: {
          type: "sequence",
          title: "One AES round (repeated 10, 12, or 14 times)",
          steps: [
            { label: "SubBytes", detail: "Each byte of the 128-bit block is substituted using a fixed lookup table, adding non-linearity." },
            { label: "ShiftRows", detail: "Bytes are shifted across rows of the internal 4×4 state, spreading data across columns." },
            { label: "MixColumns", detail: "Each column is mixed via matrix multiplication over a finite field, diffusing every byte's influence." },
            { label: "AddRoundKey", detail: "The current round's subkey (derived from the main key) is XORed into the state." },
          ],
        },
      },
      {
        heading: "The same four steps, as a pipeline",
        body: [
          "Laid out as a loop, it's clearer why AES needs as many rounds as it does: each pass diffuses the state a little further, and it takes several rounds before a single changed input bit has plausibly affected every output bit.",
        ],
        diagram: {
          type: "pipeline",
          steps: ["SubBytes", "ShiftRows", "MixColumns", "AddRoundKey"],
          loopLabel: "× 10 / 12 / 14 rounds",
        },
      },
      {
        heading: "Inside a round: the state, laid out as a grid",
        body: [
          "AES doesn't treat its 128-bit block as a flat line of bytes — it arranges the 16 bytes into a 4×4 grid called the state, filled one column at a time from the input. Every transformation in a round (SubBytes, ShiftRows, MixColumns, AddRoundKey) operates on this grid shape, which is exactly why ShiftRows and MixColumns are able to spread a single input byte's influence across the entire block within a couple of rounds.",
        ],
        diagram: {
          type: "grid",
          title: "The AES state — 16 input bytes b0…b15, filled column by column",
          rows: [
            ["b0", "b4", "b8", "b12"],
            ["b1", "b5", "b9", "b13"],
            ["b2", "b6", "b10", "b14"],
            ["b3", "b7", "b11", "b15"],
          ],
          caption: "This grid, not the original byte order, is what SubBytes, ShiftRows, and MixColumns actually operate on.",
        },
      },
      {
        heading: "ShiftRows: spreading bytes across columns",
        body: [
          "SubBytes (the step before this one) substitutes each byte independently using a fixed lookup table — it adds non-linearity, but on its own it wouldn't mix bytes together at all. ShiftRows is what starts the mixing: it cyclically shifts row r of the state left by r positions. Row 0 doesn't move; row 3 shifts by three positions. After this, a byte that started in one column is now sitting in a different column, ready for MixColumns to blend it with its new neighbors.",
        ],
        diagram: {
          type: "grid",
          title: "The state after ShiftRows",
          rows: [
            ["b0", "b4", "b8", "b12"],
            ["b5", "b9", "b13", "b1"],
            ["b10", "b14", "b2", "b6"],
            ["b15", "b3", "b7", "b11"],
          ],
          caption: "Row 1 shifted left by 1, row 2 by 2, row 3 by 3 — compare against the original layout above.",
        },
      },
      {
        heading: "MixColumns and the key schedule",
        body: [
          "MixColumns treats each column of four bytes as a small vector and multiplies it by a fixed matrix, using arithmetic in a finite field (GF(2⁸)) rather than ordinary integer arithmetic. The output byte in each position depends on all four input bytes of that column — this is the step that actually diffuses information within a column, complementing ShiftRows' diffusion across columns.",
          "None of this would be a secret without a key. AES's key schedule (key expansion) takes the original 128/192/256-bit key and algorithmically derives a separate round key for every round — 11, 13, or 15 round keys depending on key size — using repeated rotation, substitution (reusing the same S-box as SubBytes), and XOR with round constants. Each round's AddRoundKey step XORs one of these derived round keys into the state; without knowing the original key, an attacker can't reproduce any of them.",
        ],
        math: [
          {
            expr: "\\text{Number of round keys} = \\text{rounds} + 1 \\quad (11,\\ 13,\\ \\text{or } 15 \\text{ for AES-128/192/256})",
          },
        ],
      },
      {
        heading: "Modes of operation: turning a block cipher into something usable",
        body: [
          "AES itself only ever encrypts one 128-bit block at a time. A mode of operation is the algorithm that extends that single-block primitive to encrypt messages of any length — and the choice of mode matters as much as the choice of key size, because a weak mode can leak information even when the underlying cipher (AES) is unbroken.",
        ],
      },
      {
        heading: "ECB: the mode you should never use",
        body: [
          "Electronic Codebook (ECB) mode is the simplest possible approach: split the message into blocks and encrypt each one independently with the same key. It's also the classic cautionary example in cryptography teaching, because identical plaintext blocks always produce identical ciphertext blocks — patterns in the input (a repeated header, a solid-colored region of an image) remain visible as patterns in the output, even though each individual block is properly encrypted.",
        ],
        math: [
          {
            expr: "C_i = \\mathrm{AES}(K, P_i) \\quad \\text{for each block } i, \\text{ independently}",
          },
        ],
      },
      {
        heading: "CBC: chaining blocks together",
        body: [
          "Cipher Block Chaining (CBC) fixes ECB's pattern leakage by XORing each plaintext block with the previous ciphertext block before encrypting it, starting with a random Initialization Vector (IV) for the first block. This makes every ciphertext block depend on everything encrypted before it, so identical plaintext blocks no longer produce identical ciphertext — but it also means CBC is inherently sequential to decrypt, and a corrupted block only affects that block and the next one, not everything after it.",
        ],
        math: [
          {
            expr: "C_i = \\mathrm{AES}(K,\\ P_i \\oplus C_{i-1}), \\qquad C_0 = \\mathrm{IV}",
          },
        ],
        diagram: {
          type: "sequence",
          title: "CBC encryption, block by block",
          steps: [
            { label: "Block 1", detail: "P₁ is XORed with the IV, then encrypted to produce C₁." },
            { label: "Block 2", detail: "P₂ is XORed with C₁ (the previous ciphertext), then encrypted to produce C₂." },
            { label: "Block 3 and onward", detail: "Each block is XORed with the ciphertext immediately before it — one long dependency chain." },
          ],
        },
      },
      {
        heading: "CTR: turning a block cipher into a stream cipher",
        body: [
          "Counter (CTR) mode takes a completely different approach: instead of encrypting the plaintext directly, it encrypts a counter value (combined with a nonce) to produce a keystream, then XORs that keystream with the plaintext — structurally identical to the stream-cipher pattern covered in the ChaCha20 module. This has a major practical advantage over CBC: because each block's keystream only depends on the counter, not on previous ciphertext, blocks can be encrypted and decrypted in parallel and in any order.",
        ],
        math: [
          {
            expr: "C_i = P_i \\oplus \\mathrm{AES}(K,\\ \\mathrm{nonce} \\,\\|\\, i)",
          },
        ],
      },
      {
        heading: "GCM: encryption and authentication in one pass",
        body: [
          "Galois/Counter Mode (GCM) is CTR mode plus an authentication layer: alongside encrypting with a counter-based keystream exactly like CTR, it computes an authentication tag over the ciphertext using a technique called GHASH. The result is an AEAD construction — the same category as ChaCha20-Poly1305 — that gives you confidentiality and tamper detection from a single pass over the data, which is why GCM (not CBC, not plain CTR) is the default for AES in TLS 1.3.",
        ],
        diagram: {
          type: "compare",
          left: {
            title: "CTR — confidentiality only",
            points: [
              "Fast, parallelizable, no padding needed",
              "No built-in way to detect tampering",
              "A flipped ciphertext bit silently flips the corresponding plaintext bit",
            ],
          },
          right: {
            title: "GCM — confidentiality + integrity",
            points: [
              "CTR-mode encryption plus a GHASH-computed authentication tag",
              "Any tampering with the ciphertext is detected on decryption",
              "The mode behind most TLS 1.3 connections today",
            ],
          },
        },
      },
      {
        heading: "Inside GHASH: how the tag is actually built",
        body: [
          "The encryption half of GCM is plain CTR mode: a counter block is encrypted and XORed with the plaintext. The authentication half runs in parallel — every ciphertext block is folded into a running value through multiplication in the finite field GF(2¹²⁸), keyed by a hash subkey H derived from encrypting an all-zero block. That running value is then XORed with one more encrypted counter block (using counter value J0, never reused for plaintext) to produce the final tag.",
        ],
        diagram: { type: "gcm" },
      },
      {
        heading: "Padding, and the oracle it can create",
        body: [
          "CBC and ECB both require the plaintext to be a multiple of the block size, so short final blocks are padded — commonly with PKCS#7 padding, which fills the remaining bytes with a value equal to the number of padding bytes added (so a decryptor can identify and strip it unambiguously). CTR and GCM, by contrast, need no padding at all, since they turn AES into a stream cipher rather than encrypting the plaintext directly.",
          "Padding sounds like a minor bookkeeping detail, but it's exactly the mechanism behind the Bleichenbacher-style padding oracle attacks covered in the RSA padding module and the Lucky Thirteen attack covered in the side-channel module — both exploit a server that reveals, even indirectly through timing, whether decrypted padding was valid.",
        ],
      },
      {
        heading: "Nonce reuse: the catastrophic failure mode",
        body: [
          "Every mode covered here depends on never reusing the same IV/nonce with the same key for two different messages. In CBC, IV reuse leaks whether two messages start with the same block. In CTR and GCM, it's far worse: reusing a nonce produces the identical keystream twice, and XORing the two resulting ciphertexts together cancels the keystream out entirely — handing an attacker the XOR of the two plaintexts directly, which is often enough to recover both messages. For GCM specifically, nonce reuse also breaks the authentication guarantee, letting an attacker forge valid-looking ciphertexts.",
          "This is why AES-GCM implementations are so strict about nonce generation (typically a counter or a securely random 96-bit value that's never reused for a given key) — it's the single most common way real-world AES-GCM deployments get broken, not any weakness in AES itself.",
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
    slug: "stream-ciphers-chacha20",
    title: "Stream ciphers & ChaCha20-Poly1305",
    summary:
      "Not every symmetric cipher works in fixed blocks. ChaCha20 generates a keystream instead — and paired with Poly1305, it's AES-GCM's fastest rival.",
    minutes: 10,
    category: "Symmetric-key",
    tags: ["developer", "architect", "itops", "researcher"],
    sections: [
      {
        heading: "Block ciphers vs. stream ciphers",
        body: [
          "AES is a block cipher: it transforms fixed 128-bit chunks. A stream cipher instead generates a pseudorandom keystream from the key and a nonce, then combines it with the plaintext one bit or byte at a time (almost always with XOR). Encryption and decryption are the identical operation — XOR the data with the same keystream again.",
        ],
        math: [
          {
            expr: "C_i = P_i \\oplus K_i \\qquad P_i = C_i \\oplus K_i",
            caption: "Encryption and decryption are literally the same XOR operation against the keystream Kᵢ.",
          },
        ],
      },
      {
        heading: "How ChaCha20 builds its keystream",
        body: [
          "ChaCha20, designed by Daniel J. Bernstein, generates its keystream by repeatedly mixing a 256-bit key, a counter, and a nonce through a sequence of addition, rotation, and XOR operations (ARX). Unlike AES, none of this depends on table lookups, which sidesteps a class of cache-timing side-channel attacks that have affected some AES software implementations on hardware without dedicated AES instructions.",
        ],
        diagram: {
          type: "sequence",
          title: "ChaCha20-Poly1305 AEAD",
          steps: [
            { label: "Mix key + nonce + counter", detail: "A 256-bit key, a nonce, and a block counter seed ChaCha20's internal state." },
            { label: "Generate keystream", detail: "20 rounds of add-rotate-XOR (ARX) turn that state into a pseudorandom keystream block." },
            { label: "XOR with plaintext", detail: "The keystream is XORed with the plaintext to produce ciphertext." },
            { label: "Poly1305 tag", detail: "A one-time authenticator keyed from the same session computes a tag over the ciphertext, detecting any tampering." },
          ],
        },
      },
      {
        heading: "Poly1305 and the AEAD pairing",
        body: [
          "ChaCha20 alone only provides confidentiality. Paired with the Poly1305 message authentication code, it becomes ChaCha20-Poly1305 — an AEAD (Authenticated Encryption with Associated Data) construction, functionally equivalent in purpose to AES-GCM: it encrypts and authenticates in one pass, producing a tag that detects any tampering.",
        ],
      },
      {
        heading: "Where it's actually used",
        body: [
          "ChaCha20-Poly1305 is a standard cipher suite in TLS 1.3, the default cipher for the WireGuard VPN protocol, and widely used on mobile devices and older or low-power hardware that lacks AES hardware acceleration (AES-NI), where ChaCha20 in pure software runs significantly faster and in constant time.",
        ],
      },
    ],
  },
  {
    slug: "rsa-public-key",
    title: "RSA & public-key cryptography",
    summary:
      "Two mathematically linked keys — one public, one private — solve the problem symmetric crypto can't: how do you share a secret with someone you've never met?",
    minutes: 30,
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
        math: [
          {
            expr: "n = p \\times q, \\qquad \\varphi(n) = (p-1)(q-1)",
            caption: "n is the modulus; φ(n) (Euler's totient) is only computable if you know p and q.",
          },
          {
            expr: "e \\cdot d \\equiv 1 \\pmod{\\varphi(n)}",
            caption: "The public exponent e and private exponent d are chosen to be modular inverses of each other.",
          },
          {
            expr: "C = M^{e} \\bmod n \\qquad\\Longrightarrow\\qquad M = C^{d} \\bmod n",
            caption: "Encryption with the public key (n, e); decryption with the private key (n, d).",
          },
        ],
        diagram: {
          type: "sequence",
          title: "RSA key generation, encryption, and decryption",
          steps: [
            {
              label: "Generate keys",
              detail: "Pick large random primes p, q. Compute n = pq and φ(n) = (p−1)(q−1). Choose e coprime to φ(n), then derive d as e's inverse mod φ(n).",
            },
            {
              label: "Publish the public key",
              detail: "(n, e) is shared openly. (n, d) — the private key — never leaves the owner.",
            },
            {
              label: "Encrypt",
              detail: "Anyone computes C = Mᵉ mod n using only the public key.",
            },
            {
              label: "Decrypt",
              detail: "Only the private-key holder computes M = Cᵈ mod n to recover the message.",
            },
          ],
        },
      },
      {
        heading: "A worked example with small numbers",
        body: [
          "Real RSA uses primes hundreds of digits long, but the same arithmetic works identically with small ones — which is why this toy example (the one most textbooks use) is worth stepping through by hand.",
          "Take p = 61 and q = 53. Then n = 3233 and φ(n) = 60 × 52 = 3120. Pick e = 17 (it shares no common factors with 3120). Solving 17d ≡ 1 (mod 3120) gives d = 2753 — that's the whole key pair: public key (3233, 17), private key (3233, 2753).",
          "Encrypting the message M = 65 gives C = 65¹⁷ mod 3233 = 2790. Decrypting runs it back: 2790²⁷⁵³ mod 3233 = 65. The same modulus, two different exponents, one direction easy without the private key and the other only possible with it.",
        ],
        math: [
          {
            expr: "p=61,\\ q=53 \\;\\Rightarrow\\; n=3233,\\ \\varphi(n)=3120,\\ e=17,\\ d=2753",
          },
          {
            expr: "C = 65^{17} \\bmod 3233 = 2790 \\qquad M = 2790^{2753} \\bmod 3233 = 65",
          },
        ],
      },
      {
        heading: "Finding d: the extended Euclidean algorithm",
        body: [
          "Solving \"17d ≡ 1 (mod 3120)\" isn't guesswork — it's a standard computation called the extended Euclidean algorithm, which finds the modular inverse of e directly. Run backward, the ordinary Euclidean algorithm (repeated division to find a greatest common divisor) leaves behind a trail of remainders; the extended version tracks coefficients alongside those remainders and, because e and φ(n) were chosen to be coprime, that trail terminates in exactly the d you need. It's fast — logarithmic in the size of the numbers — which is what makes key generation practical even for 2048-bit primes.",
        ],
      },
      {
        heading: "Why e = 65537 shows up everywhere",
        body: [
          "Almost every RSA key you'll encounter uses the public exponent e = 65537, and the reason is a genuine engineering trade-off rather than convention. Written in binary, 65537 is 10000000000000001 — only two bits are set — and the square-and-multiply algorithm used for modular exponentiation does one multiplication per bit and one extra squaring per set bit, so a sparse exponent like this makes encryption and signature verification (both of which use e) noticeably faster than a dense one would.",
          "Smaller exponents like e = 3 are even faster, but they reopen exactly the kind of low-exponent attacks covered below — 65537 is small enough to stay fast and large enough to close off the simplest ones. It also happens to be a Fermat prime (2¹⁶ + 1), which guarantees it's coprime with φ(n) for essentially any RSA modulus, simplifying key generation.",
        ],
        math: [
          { expr: "e = 65537 = 2^{16} + 1" },
        ],
      },
      {
        heading: "RSA signatures: the same math, opposite roles",
        body: [
          "Encryption and signing use identical RSA arithmetic with the public and private key's roles reversed. To encrypt, anyone raises a message to the public exponent; to sign, the key-holder raises a (hashed) message to their private exponent — something only they can do. To decrypt, the key-holder raises the ciphertext to their private exponent; to verify a signature, anyone raises it to the public exponent and checks the result matches the message's hash.",
          "In practice, following the hash-then-sign pattern from the hashing module, RSA never signs a raw message directly — it signs a padded hash digest (via RSA-PSS, covered in the padding module), for exactly the same reasons raw RSA encryption is unsafe.",
        ],
        math: [
          {
            expr: "\\text{Sign: } S = H(m)^{d} \\bmod n \\qquad \\text{Verify: } H(m) \\stackrel{?}{=} S^{e} \\bmod n",
          },
        ],
      },
      {
        heading: "What can go wrong: classic implementation attacks",
        body: [
          "RSA's math is sound; most real-world breaks come from how it's deployed. Three patterns recur across decades of RSA vulnerabilities, and none of them require factoring anything.",
        ],
        diagram: {
          type: "structure",
          title: "RSA pitfalls that have nothing to do with factoring",
          blocks: [
            {
              label: "Common modulus attack",
              detail: "If two users are (incorrectly) issued the same n with different e values, anyone who intercepts the same message encrypted to both can recover it algebraically — without ever factoring n.",
            },
            {
              label: "Håstad's broadcast attack",
              detail: "The same message sent to several recipients using a small e (like 3) and different moduli can be recovered using the Chinese Remainder Theorem, entirely bypassing the private keys.",
            },
            {
              label: "Weak randomness in key generation",
              detail: "If the \"random\" primes p and q aren't actually independent and unpredictable, keys across different devices can end up sharing a prime factor — a real issue found in some embedded devices' RSA key generation.",
            },
          ],
        },
      },
      {
        heading: "Why factoring is the whole game",
        body: [
          "Every attack on RSA either tries to factor n directly or tries to find a shortcut that avoids factoring. The best known classical factoring algorithm, the General Number Field Sieve (GNFS), has sub-exponential running time — hard enough that factoring a 2048-bit RSA modulus is considered infeasible with any classical computer for the foreseeable future.",
          "This is precisely the assumption that Shor's algorithm breaks on a sufficiently large quantum computer — see the quantum threat module for why RSA is on every PQC migration roadmap.",
        ],
        math: [
          {
            expr: "O\\!\\left(\\exp\\left((1.92 + o(1))(\\ln n)^{1/3}(\\ln \\ln n)^{2/3}\\right)\\right)",
            caption: "GNFS's running time — sub-exponential, but still growing fast enough that doubling n's bit length costs far more than double the effort.",
          },
        ],
        diagram: {
          type: "structure",
          title: "The factoring record, over time",
          blocks: [
            { label: "RSA-100 (330 bits)", detail: "Factored in 1991." },
            { label: "RSA-129 (426 bits)", detail: "The modulus from the original 1977 RSA challenge — factored in 1994, using idle computer time volunteered over the internet." },
            { label: "RSA-768 (768 bits)", detail: "Factored in 2009, after roughly two years of computation across many machines." },
            { label: "RSA-2048 (2048 bits)", detail: "Today's minimum recommended size — still unfactored, and expected to stay that way classically for the foreseeable future." },
          ],
        },
      },
    ],
  },
  {
    slug: "rsa-padding-oaep-pkcs1",
    title: "RSA padding: OAEP, PKCS#1 v1.5, and why raw RSA fails",
    summary:
      "Textbook RSA is deterministic and malleable. Padding schemes are what actually make RSA encryption and signing safe to use in the real world.",
    minutes: 13,
    category: "Public-key",
    tags: ["developer", "architect", "researcher"],
    sections: [
      {
        heading: "Why raw RSA is insecure",
        body: [
          "Applying the RSA formula directly to a message (\"textbook RSA\") has several fatal properties for real-world use: it's deterministic, so the same plaintext always produces the same ciphertext, leaking whether two messages match; it's malleable, so an attacker can manipulate a ciphertext in predictable ways that transform the underlying plaintext; and small messages encrypted with a small public exponent can sometimes be recovered directly by taking a root, with no key-breaking required.",
        ],
      },
      {
        heading: "PKCS#1 v1.5 and the Bleichenbacher attack",
        body: [
          "PKCS#1 v1.5 padding, standardized in the 1990s, prepends structured random padding before encryption to defeat determinism. In 1998, Daniel Bleichenbacher showed that a server which distinguishes \"valid padding\" from \"invalid padding\" errors leaks enough information, through repeated queries, to decrypt a ciphertext entirely — a padding oracle attack. Variants of this attack (including the 2017 ROBOT attack) were still being found against production TLS servers nearly two decades later, because the padding-check logic is easy to implement subtly wrong.",
        ],
        diagram: {
          type: "structure",
          title: "PKCS#1 v1.5 padded message layout (before encryption)",
          blocks: [
            { label: "0x00", detail: "Leading zero byte" },
            { label: "0x02", detail: "Block type — 2 means \"encryption\"" },
            { label: "PS (padding string)", detail: "Random non-zero bytes, filling the block to the modulus size" },
            { label: "0x00", detail: "Separator marking the end of padding" },
            { label: "M (message)", detail: "The actual plaintext being encrypted" },
          ],
        },
      },
      {
        heading: "The oracle, step by step",
        body: [
          "Bleichenbacher's attack doesn't need to see plaintext — it only needs a yes/no signal about whether a decrypted, attacker-modified ciphertext happens to have valid PKCS#1 padding. That single bit of leakage, repeated tens of thousands of times against different modified ciphertexts, is enough to mathematically narrow down the original plaintext to an exact value.",
        ],
        diagram: {
          type: "sequence",
          title: "Padding oracle attack, simplified",
          steps: [
            { label: "Intercept a ciphertext", detail: "The attacker captures a legitimately encrypted ciphertext they want to decrypt." },
            { label: "Submit modified variants", detail: "They multiply the ciphertext by chosen values and resubmit it to the server thousands of times." },
            { label: "Watch the error signal", detail: "The server's response (or timing) reveals only whether the resulting padding was \"valid\" — nothing else." },
            { label: "Narrow the plaintext", detail: "Each valid/invalid answer mathematically shrinks the range of possible plaintexts, until only one remains." },
          ],
        },
      },
      {
        heading: "OAEP and PSS: the modern replacements",
        body: [
          "OAEP (Optimal Asymmetric Encryption Padding) is the modern standard for RSA encryption, built to be provably secure against chosen-ciphertext attacks using randomized padding derived from hash functions. For signatures, the analogous modern scheme is RSA-PSS (Probabilistic Signature Scheme), which similarly replaces the deterministic padding of PKCS#1 v1.5 signatures with a randomized construction.",
          "OAEP builds its randomization from a fresh random seed, mixed into the message through two rounds of masking with a hash-based mask generation function (MGF1) — each round's output feeds into the next, so recovering any part of the original message requires recovering the entire encoded block intact.",
        ],
        diagram: { type: "oaep" },
      },
      {
        heading: "The practical takeaway",
        body: [
          "Padding is not a minor implementation detail bolted onto RSA — it's load-bearing security logic, and it's exactly the kind of code where a subtle timing or error-message difference becomes a full key-recovery attack. This is why every serious cryptography guideline says the same thing: never implement RSA padding yourself, and use a vetted, actively maintained cryptographic library.",
        ],
      },
    ],
  },
  {
    slug: "elliptic-curve-cryptography",
    title: "Elliptic Curve Cryptography (ECC / ECDSA)",
    summary:
      "The same public-key guarantees as RSA, with dramatically smaller keys — because the underlying hard problem is different math entirely.",
    minutes: 28,
    category: "Public-key",
    tags: ["developer", "architect", "researcher"],
    sections: [
      {
        heading: "A different hard problem",
        body: [
          "Elliptic Curve Cryptography builds public-key systems on the algebra of points on an elliptic curve over a finite field, rather than on integer factorization. The hard problem here is the elliptic curve discrete logarithm problem (ECDLP): given a starting point G and a resulting point Q = kG (k applications of a 'point addition' operation), it's computationally infeasible to recover k.",
          "Crucially, no sub-exponential classical algorithm is known for ECDLP the way one exists for factoring — which means ECC achieves equivalent classical security to RSA with far smaller keys. A 256-bit ECC key is considered roughly as strong as a 3072-bit RSA key.",
        ],
        math: [
          {
            expr: "y^{2} = x^{3} + ax + b \\pmod{p}",
            caption: "The general form of an elliptic curve over a finite field — the set of (x, y) points satisfying this equation, plus a point at infinity.",
          },
          {
            expr: "Q = k \\cdot G",
            caption: "Public key Q is the base point G \"added to itself\" k times. Easy forward; recovering k (the private key) is the ECDLP.",
          },
        ],
      },
      {
        heading: "Point addition: the operation everything is built from",
        body: [
          "\"Adding\" two points on an elliptic curve has a genuinely geometric definition, which is part of why ECC feels less intuitive than RSA's arithmetic at first. To add two distinct points P and Q, draw a straight line through them — since the curve is cubic, that line crosses it at exactly one more point. Reflecting that third point across the x-axis gives P + Q. This isn't a metaphor for the algebra; it's literally how the group operation is defined, and it has a closed-form algebraic formula that a computer evaluates directly, with no actual line-drawing involved.",
          "Doubling a point (adding P to itself, needed whenever a bit of the private key is 1 during scalar multiplication) works the same way in the limit: instead of a line through two distinct points, you use the tangent line at P.",
        ],
        diagram: { type: "ec-point-addition" },
      },
      {
        heading: "Scalar multiplication: how kG is actually computed",
        body: [
          "Computing Q = kG for a 256-bit private key k doesn't mean adding G to itself k times — that would be astronomically slow. Instead, implementations use double-and-add, the same square-and-multiply idea behind fast RSA exponentiation: scan the bits of k, doubling a running point at every step and adding G whenever that bit is 1. A 256-bit scalar multiplication takes on the order of 256 doublings and up to 256 additions — fast enough to run thousands of times per second, while still being, as far as anyone knows, computationally impossible to reverse.",
        ],
      },
      {
        heading: "A worked example over a small curve",
        body: [
          "Real curves use primes hundreds of bits long, but the arithmetic works identically at toy scale. Take the curve y² = x³ + 2x + 2 (mod 17) — a small finite field with only 17 possible values for each coordinate — with base point G = (5, 1).",
          "Computing 2G (doubling G) using the curve's point-doubling formula gives (6, 3). Computing 3G = 2G + G gives (10, 6). An attacker who only sees G and 3G = (10, 6) has to recover the scalar 3 — trivial here with a 17-element field, but the identical computation over a 256-bit field is the ECDLP that underpins every ECC key in production.",
        ],
        math: [
          {
            expr: "y^{2} = x^{3} + 2x + 2 \\pmod{17}, \\quad G = (5,1)",
          },
          {
            expr: "2G = (6,3) \\qquad 3G = (10,6)",
          },
        ],
      },
      {
        heading: "Smaller keys, real consequences",
        body: [
          "Smaller keys mean less data to transmit and store, faster key generation, and faster signing operations — which is why ECC dominates mobile, IoT, and high-volume TLS deployments. Curve25519 (for key exchange, as X25519) and Curve448 are widely used modern curves chosen partly to avoid pitfalls found in some earlier NIST-standardized curves.",
        ],
        diagram: {
          type: "compare",
          left: {
            title: "NIST P-256 (secp256r1)",
            points: [
              "Standardized by NIST in 1999, still the most widely deployed curve in TLS certificates",
              "Parameters generated from an unexplained random seed — a long-running source of community distrust",
              "Implementation is more prone to subtle timing side-channels if not written carefully",
            ],
          },
          right: {
            title: "Curve25519 (X25519)",
            points: [
              "Designed by Daniel J. Bernstein in 2005 specifically to make safe implementation easier",
              "Every parameter choice is publicly justified — no unexplained constants",
              "Default key exchange curve in TLS 1.3, SSH, Signal, and WireGuard",
            ],
          },
        },
      },
      {
        heading: "ECDSA: signatures on curves",
        body: [
          "The Elliptic Curve Digital Signature Algorithm (ECDSA) uses ECC to produce digital signatures — proof that a message came from the holder of a private key, without revealing that key. It's the signature scheme behind most modern TLS certificates and behind Bitcoin and Ethereum transaction signing.",
          "ECDSA requires a fresh, truly random per-signature value (the nonce) for every signature. Reusing a nonce, or generating it with a weak random number generator, leaks the private key directly — this has caused real-world key compromises, including a widely cited 2010 Sony PlayStation 3 signing-key leak caused by a static nonce.",
        ],
        math: [
          {
            expr: "r = (k \\cdot G)_x \\bmod n \\qquad s = k^{-1}(H(m) + r \\cdot d) \\bmod n",
            caption: "The signature is the pair (r, s); k is the per-signature nonce, d is the private key, n is the curve's group order.",
          },
        ],
        diagram: {
          type: "sequence",
          title: "ECDSA sign and verify",
          steps: [
            { label: "Sign", detail: "Hash the message, generate a fresh random nonce k, and combine them with the private key to produce a signature pair (r, s)." },
            { label: "Publish", detail: "The message and signature (r, s) travel together; the private key never leaves the signer." },
            { label: "Verify", detail: "Anyone with the public key Q recomputes a value from (r, s) and the message hash, and checks it matches r." },
            { label: "Accept or reject", detail: "A match proves the signer holds the private key for Q — without Q ever having been used to sign anything itself." },
          ],
        },
      },
      {
        heading: "How a leaked nonce leaks the entire private key",
        body: [
          "The ECDSA signing formula involves the nonce k algebraically alongside the private key d. If an attacker ever learns k for even one signature — through a weak RNG, a side-channel leak, or (as in the PS3 case) the same k reused across two different signatures — they can rearrange the signing equation to solve directly for d. This is a one-shot, deterministic break, not a probabilistic weakening: a single exposed nonce is equivalent to publishing the private key outright.",
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
    minutes: 24,
    category: "Protocols",
    tags: ["developer", "architect", "researcher"],
    sections: [
      {
        heading: "The original public-key idea",
        body: [
          "Published by Whitfield Diffie and Martin Hellman in 1976, the Diffie-Hellman (DH) key exchange was the first published practical method for two parties to establish a shared secret over an insecure channel — without any prior shared secret.",
          "The classical version relies on the discrete logarithm problem in modular arithmetic: given a large prime p, a generator g, and g^a mod p, it's hard to recover a. Alice picks a secret a and sends g^a mod p; Bob picks a secret b and sends g^b mod p. Each raises the received value to their own secret: (g^b)^a = (g^a)^b = g^ab mod p — the shared secret, which an eavesdropper watching only g^a and g^b cannot feasibly compute.",
        ],
        math: [
          {
            expr: "A = g^{a} \\bmod p \\qquad B = g^{b} \\bmod p",
            caption: "Alice and Bob each compute a public value from their own secret exponent.",
          },
          {
            expr: "B^{a} \\bmod p = g^{ab} \\bmod p = A^{b} \\bmod p",
            caption: "Both sides land on the same shared secret — without ever transmitting a or b.",
          },
        ],
        diagram: {
          type: "swimlane",
          title: "Diffie-Hellman key exchange",
          leftActor: "Alice",
          rightActor: "Bob",
          messages: [
            { from: "left", label: "A = gᵃ mod p" },
            { from: "right", label: "B = gᵇ mod p" },
          ],
          caption: "Both then compute the same value independently: Alice raises B to her secret a; Bob raises A to his secret b. Neither ever transmits a or b.",
        },
      },
      {
        heading: "A worked example with small numbers",
        body: [
          "Take the small prime p = 23 and generator g = 5. Alice picks secret a = 6 and computes A = 5⁶ mod 23 = 8. Bob picks secret b = 15 and computes B = 5¹⁵ mod 23 = 19. They exchange A and B in the open.",
          "Alice now computes B^a mod p = 19⁶ mod 23 = 2. Bob computes A^b mod p = 8¹⁵ mod 23 = 2. Same answer, reached independently — and an eavesdropper who saw p, g, A, and B has to solve a discrete logarithm to recover a or b, which is infeasible once these numbers are hundreds of digits long instead of two.",
        ],
        math: [
          { expr: "p=23,\\ g=5,\\ a=6,\\ b=15" },
          { expr: "A = 5^{6} \\bmod 23 = 8 \\qquad B = 5^{15} \\bmod 23 = 19" },
          { expr: "19^{6} \\bmod 23 = 8^{15} \\bmod 23 = 2 \\quad\\text{(the shared secret)}" },
        ],
      },
      {
        heading: "Why DH alone isn't enough: the man-in-the-middle problem",
        body: [
          "Plain Diffie-Hellman guarantees secrecy from a passive eavesdropper, but nothing about who's actually on the other end. An active attacker sitting between Alice and Bob can run two separate DH exchanges — one with each of them — and relay traffic through itself, decrypting and re-encrypting everything, while both Alice and Bob believe they're talking directly to each other.",
          "This is exactly why real protocols never use bare DH: TLS combines the DH (or ECDH) exchange with a certificate-backed signature over the handshake transcript, and the Signal Protocol's X3DH verifies identity keys out of band — the key exchange handles secrecy, but authentication has to come from somewhere else entirely.",
        ],
        diagram: {
          type: "sequence",
          title: "Man-in-the-middle against unauthenticated DH",
          steps: [
            { label: "Alice → \"Bob\"", detail: "Alice starts a DH exchange, but Mallory intercepts it and impersonates Bob." },
            { label: "Mallory → real Bob", detail: "Mallory starts a second, separate DH exchange with Bob, impersonating Alice." },
            { label: "Two independent shared secrets", detail: "Alice shares a secret with Mallory; Bob shares a different secret with Mallory. Neither shares one with the other." },
            { label: "Mallory relays and reads everything", detail: "Every message is decrypted, read (and optionally altered), and re-encrypted as it passes through — invisibly to both sides." },
          ],
        },
      },
      {
        heading: "Elliptic-curve Diffie-Hellman (ECDH)",
        body: [
          "The same idea maps onto elliptic curves: instead of modular exponentiation, parties combine points on a curve, using exactly the scalar multiplication (kG) and point addition covered in the ECC module. X25519 (ECDH over Curve25519) is the default key exchange in TLS 1.3 and in most modern SSH and messaging protocols, valued for speed and resistance to several classes of implementation error.",
        ],
        math: [
          {
            expr: "A = a \\cdot G \\qquad B = b \\cdot G \\qquad \\text{shared secret} = a \\cdot B = b \\cdot A = ab \\cdot G",
            caption: "Structurally identical to classical DH — modular exponentiation is simply replaced with elliptic-curve scalar multiplication.",
          },
        ],
      },
      {
        heading: "Safe primes and small-subgroup attacks",
        body: [
          "The choice of p and g isn't arbitrary. If p is chosen carelessly, the group of values reachable by exponentiation can have small subgroups, and an attacker can sometimes force a DH exchange into one of those subgroups, drastically shrinking the search space for the discrete logarithm. Real implementations use \"safe primes\" (p where (p−1)/2 is also prime) specifically to avoid this, and validate that received public values aren't degenerate (like 0 or 1) before using them.",
        ],
      },
      {
        heading: "Forward secrecy",
        body: [
          "When DH parameters are generated fresh for each session (ephemeral Diffie-Hellman, denoted DHE or ECDHE), a compromise of a server's long-term private key doesn't let an attacker decrypt previously recorded sessions — each session's key existed only in memory and is gone once the connection ends. This property, forward secrecy, is now mandatory in TLS 1.3.",
        ],
        diagram: {
          type: "compare",
          left: {
            title: "Static key exchange (no forward secrecy)",
            points: [
              "The same long-term key pair is reused across many sessions",
              "If that private key is ever compromised, every past recorded session can be decrypted retroactively",
              "This is exactly the classical half of the harvest-now-decrypt-later risk",
            ],
          },
          right: {
            title: "Ephemeral DH/ECDH (DHE/ECDHE)",
            points: [
              "A fresh key pair is generated for every single session",
              "The session key exists only in memory and is discarded afterward",
              "Compromising a server's long-term identity key doesn't expose any past session's content",
            ],
          },
        },
      },
    ],
  },
  {
    slug: "hash-functions-and-signatures",
    title: "Hash functions & digital signatures",
    summary:
      "One-way fingerprints for data, and the mechanism that proves a message is authentic and untampered — without encrypting anything.",
    minutes: 26,
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
        math: [
          {
            expr: "H: \\{0,1\\}^{*} \\rightarrow \\{0,1\\}^{256}",
            caption: "SHA-256 maps an input of any length to a fixed 256-bit digest.",
          },
        ],
      },
      {
        heading: "The avalanche effect, concretely",
        body: [
          "\"Deterministic but unpredictable\" is easiest to see with real output. SHA-256 of the five-letter string \"hello\" and SHA-256 of \"hellp\" — one letter different, one step along the alphabet — share no visible structure at all, even though the inputs are nearly identical. This is the avalanche effect in practice: a well-designed hash function is built so that changing even a single input bit flips roughly half the output bits, with no way to predict which half in advance.",
        ],
        math: [
          { expr: "\\mathrm{SHA256}(\\texttt{\"hello\"}) = \\mathtt{2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824}" },
          { expr: "\\mathrm{SHA256}(\\texttt{\"hellp\"}) = \\mathtt{fdd7585e08c4e2afd71dcabdb4636c89d557a3f42db9e2040c8bbd1708aa4ce7}" },
        ],
      },
      {
        heading: "How SHA-2 actually processes a message: Merkle-Damgård",
        body: [
          "SHA-256 can't hash an arbitrary-length message in one mathematical step — internally, it uses the Merkle-Damgård construction: the message is padded and split into fixed-size blocks, and a compression function processes them one at a time, feeding its output (a \"chaining value\") in as part of the input for the next block. The final chaining value, after the last block, is the digest.",
          "This iterative structure is elegant and easy to reason about, but it has a well-known side effect: given only H(message) and the length of message (not the message itself), an attacker can compute H(message ‖ extra) for an attacker-chosen extra, without ever knowing the original message — a length-extension attack. It works precisely because the digest is just the last chaining value, which is all the compression function needs to keep going.",
        ],
        diagram: {
          type: "sequence",
          title: "Merkle-Damgård: hashing a multi-block message",
          steps: [
            { label: "Pad the message", detail: "The message is padded to a multiple of the block size, with its length encoded at the end." },
            { label: "Process block 1", detail: "The compression function combines block 1 with a fixed initial value, producing chaining value H₁." },
            { label: "Process block 2", detail: "The compression function combines block 2 with H₁, producing H₂ — and so on for every remaining block." },
            { label: "Final chaining value = digest", detail: "After the last block, the current chaining value is output directly as the hash." },
          ],
        },
      },
      {
        heading: "Why HMAC isn't just H(key ‖ message)",
        body: [
          "Length extension is exactly why HMAC (covered below) doesn't simply hash the key and message concatenated together — naive H(key ‖ message) is vulnerable to exactly the attack above: an attacker who knows H(key ‖ message) and its length can compute a valid H(key ‖ message ‖ extra) without ever learning the key. HMAC's nested double-hashing construction was specifically designed to close this gap, and it's why \"just concatenate and hash\" is one of the most common amateur cryptography mistakes.",
        ],
      },
      {
        heading: "SHA-3: a structurally different design",
        body: [
          "SHA-3, standardized in 2015 after a public competition (much like AES's selection process), doesn't use Merkle-Damgård at all — it's built on a sponge construction, which absorbs input into a large internal state and then squeezes output back out. Because the internal state is larger than the final digest, and the output isn't simply \"the last chaining value\" the way Merkle-Damgård's is, SHA-3 is naturally immune to length-extension attacks without needing an HMAC-style workaround.",
        ],
        diagram: {
          type: "compare",
          left: {
            title: "Merkle-Damgård (SHA-2)",
            points: [
              "Processes input in fixed-size blocks through a chained compression function",
              "The digest is literally the final chaining value",
              "Vulnerable to length-extension unless wrapped (as HMAC does)",
            ],
          },
          right: {
            title: "Sponge construction (SHA-3)",
            points: [
              "Absorbs input into a large internal state, then squeezes out the digest",
              "Internal state is larger than and structurally separate from the output",
              "Naturally resistant to length-extension attacks",
            ],
          },
        },
      },
      {
        heading: "The birthday bound: why 256 bits gives \"only\" 128-bit collision resistance",
        body: [
          "Preimage resistance (finding an input for a given digest) costs roughly 2ⁿ operations for an n-bit hash — but finding any collision (any two inputs sharing a digest) is cheaper than that, thanks to the birthday paradox: among a surprisingly small set of random values, the odds of two colliding are much higher than intuition suggests. For an n-bit hash, an attacker can expect to find a collision after roughly 2ⁿᐟ² attempts, not 2ⁿ — which is exactly why SHA-256 (256-bit output) is described as offering 128-bit collision resistance, not 256-bit.",
        ],
        math: [
          {
            expr: "\\text{preimage cost} \\approx 2^{n} \\qquad \\text{collision cost} \\approx 2^{n/2}",
            caption: "This is also why MD5 (128-bit) and SHA-1 (160-bit) fell to practical collision attacks well before anyone found a preimage attack against either.",
          },
        ],
      },
      {
        heading: "From hashing to signing",
        body: [
          "A digital signature proves two things at once: the message came from the holder of a specific private key (authenticity), and the message wasn't altered after signing (integrity). The signer hashes the message, then encrypts (more precisely, transforms) that hash with their private key. Anyone with the public key can verify by hashing the message themselves and checking it matches.",
          "RSA signatures and ECDSA both follow this hash-then-sign pattern. This is also why hash function security matters even in \"public-key\" workflows — if an attacker can find a second message with the same hash as a legitimately signed one, they can attach a valid signature to a message that was never actually signed.",
        ],
        diagram: {
          type: "sequence",
          title: "Hash-then-sign",
          steps: [
            { label: "Signer hashes the message", detail: "H(message) reduces arbitrary-length data to a fixed-size digest." },
            { label: "Signer signs the digest", detail: "The digest is transformed with the signer's private key, producing the signature." },
            { label: "Verifier re-hashes the message", detail: "The verifier independently computes H(message) from the message they received." },
            { label: "Verifier checks the signature", detail: "Using the public key, they confirm the signature matches that digest — proving both authenticity and integrity." },
          ],
        },
      },
      {
        heading: "HMAC: keyed hashing",
        body: [
          "HMAC combines a hash function with a secret key to produce a message authentication code — proof that a message wasn't tampered with, verifiable by anyone holding the shared key. HMAC-SHA256 is common wherever two parties share a symmetric secret and need integrity without full public-key signatures, including inside several TLS cipher suites and API authentication schemes.",
        ],
        math: [
          {
            expr: "\\mathrm{HMAC}(K, m) = H\\big((K' \\oplus \\mathrm{opad}) \\,\\|\\, H((K' \\oplus \\mathrm{ipad}) \\,\\|\\, m)\\big)",
            caption: "K′ is the key padded to the hash's block size; opad/ipad are fixed constants; ‖ is concatenation.",
          },
        ],
      },
    ],
  },
  {
    slug: "key-derivation-functions",
    title: "Password hashing & key derivation: PBKDF2, bcrypt, scrypt, Argon2",
    summary:
      "A cryptographic hash is too fast for passwords. KDFs deliberately slow things down — and not all of them do it the same way.",
    minutes: 11,
    category: "Foundations",
    tags: ["developer", "architect", "grc", "researcher"],
    sections: [
      {
        heading: "Why SHA-256 alone is the wrong tool for passwords",
        body: [
          "A general-purpose hash function like SHA-256 is designed to be fast — that's a feature for verifying file integrity and a serious liability for storing passwords. Modern GPUs and ASICs can compute billions of SHA-256 hashes per second, making brute-force and dictionary attacks against a stolen password database dramatically cheap unless the hashing itself is deliberately expensive.",
          "Salting — appending a unique random value to each password before hashing — is a separate, complementary defense: it defeats precomputed rainbow-table attacks by ensuring identical passwords don't produce identical hashes, but it does nothing to slow down an attacker targeting one specific hash.",
        ],
      },
      {
        heading: "PBKDF2, bcrypt, and scrypt",
        body: [
          "PBKDF2 slows things down by applying a hash function repeatedly, thousands or millions of times, controlled by a tunable iteration count — simple and standard, but cheaply parallelizable on GPUs. bcrypt, based on the Blowfish cipher, adds an adjustable \"cost factor\" and has been a de facto standard since 1999. scrypt goes further, deliberately requiring large amounts of memory as well as computation (memory-hard), which is significantly more expensive to parallelize on specialized hardware.",
        ],
        math: [
          {
            expr: "\\mathrm{DK} = \\mathrm{PBKDF2}(\\mathrm{password}, \\mathrm{salt}, c, \\mathrm{dkLen})",
            caption: "c is the iteration count — the tunable \"cost\" knob; dkLen is the derived key's length.",
          },
        ],
      },
      {
        heading: "Argon2: the current recommendation",
        body: [
          "Argon2 won the Password Hashing Competition in 2015 and is now the generally recommended choice for new systems. Like scrypt, it's memory-hard, with independently tunable time, memory, and parallelism costs, and comes in variants (Argon2id is typically recommended) balancing resistance to both GPU/ASIC attacks and side-channel attacks.",
        ],
        diagram: {
          type: "structure",
          title: "Password hashing options, in order of increasing GPU/ASIC resistance",
          blocks: [
            { label: "PBKDF2", detail: "Iteration-based only. Simple, standard, but cheap to parallelize on GPUs." },
            { label: "bcrypt", detail: "Blowfish-based with an adjustable cost factor. De facto standard since 1999." },
            { label: "scrypt", detail: "Memory-hard as well as iteration-based — expensive to parallelize on specialized hardware." },
            { label: "Argon2id", detail: "2015 competition winner. Independently tunable time, memory, and parallelism; current recommendation." },
          ],
        },
      },
      {
        heading: "A different job from HKDF",
        body: [
          "It's worth distinguishing this family from key derivation functions like HKDF, used to derive multiple cryptographic keys from a single shared secret (for example, inside a TLS or Signal Protocol handshake). HKDF is fast by design — it's deriving keys from data that's already high-entropy, not stretching a low-entropy human password, so slowness would add cost without adding security.",
        ],
      },
    ],
  },
  {
    slug: "digital-certificates-x509",
    title: "X.509 certificates & the PKI trust hierarchy",
    summary:
      "A certificate is just a signed statement binding a public key to an identity. Here's what's actually inside one, and how revocation works.",
    minutes: 24,
    category: "Protocols",
    tags: ["architect", "itops", "grc", "developer"],
    sections: [
      {
        heading: "Anatomy of a certificate",
        body: [
          "An X.509 certificate is a structured, digitally signed document binding a public key to an identity (a domain name, an organization, a person). Its key fields include the subject (who the certificate identifies, including Subject Alternative Names for the domains it covers), the issuer (which Certificate Authority signed it), the public key itself, a validity period, and the issuer's signature over all of it.",
        ],
        diagram: {
          type: "structure",
          title: "Core fields of an X.509 certificate",
          blocks: [
            { label: "Subject", detail: "The identity this certificate is issued to — e.g. CN=example.com, plus Subject Alternative Names." },
            { label: "Issuer", detail: "The Certificate Authority that signed this certificate." },
            { label: "Public key", detail: "The subject's public key (RSA or ECDSA) — the whole point of the certificate." },
            { label: "Validity period", detail: "notBefore / notAfter timestamps — outside this window, the certificate is expired." },
            { label: "Signature", detail: "The issuer's signature over every field above, binding them together." },
          ],
        },
      },
      {
        heading: "The chain of trust",
        body: [
          "Certificates form a chain: a leaf certificate (a website's) is signed by an intermediate CA, whose own certificate is signed by a root CA. Root CA certificates are the trust anchors — pre-installed in operating systems and browsers — and everything else is trusted only because it traces back, signature by signature, to one of them. This is the same hash-then-sign mechanism covered in the hashing and signatures module, applied recursively.",
        ],
        diagram: {
          type: "sequence",
          title: "Chain of trust",
          steps: [
            { label: "Root CA", detail: "Self-signed, pre-installed as a trust anchor in your OS or browser." },
            { label: "Intermediate CA", detail: "Its certificate is signed by the root CA — kept offline and rarely used directly, to protect the root key." },
            { label: "Leaf certificate", detail: "example.com's certificate, signed by the intermediate CA." },
            { label: "Your browser verifies", detail: "It walks the chain leaf → intermediate → root, checking each signature until it reaches an already-trusted anchor." },
          ],
        },
      },
      {
        heading: "Subject Alternative Names and wildcard certificates",
        body: [
          "A single certificate can cover far more than one hostname. Subject Alternative Names (SANs) let one certificate list many exact domains (example.com, www.example.com, api.example.com), while a wildcard certificate (CN=*.example.com) covers any single-level subdomain at once. Modern browsers ignore the legacy Subject/CN field for hostname matching entirely and check only the SAN list — a certificate without the right SAN entry fails validation even if the CN field looks correct.",
        ],
      },
      {
        heading: "Revocation: harder than it sounds",
        body: [
          "A certificate's validity period isn't the only way it can stop being trusted — it can be revoked early, for example if its private key is compromised. Certificate Revocation Lists (CRLs) are downloadable lists of revoked certificate serial numbers; OCSP (Online Certificate Status Protocol) lets a client ask a CA in real time whether a specific certificate is still valid.",
        ],
        diagram: {
          type: "compare",
          left: {
            title: "CRL",
            points: [
              "Client downloads a full list of revoked serial numbers from the CA",
              "Lists grow large over time and go stale between updates",
              "No per-check metadata leak — the whole list is downloaded once",
            ],
          },
          right: {
            title: "OCSP",
            points: [
              "Client asks the CA in real time: is this exact certificate still valid?",
              "Small, fast response — but a live query per connection is slow at scale",
              "Leaks which sites a client is visiting to the CA, and can fail open if the CA is unreachable",
            ],
          },
        },
      },
      {
        heading: "OCSP stapling: fixing both problems at once",
        body: [
          "OCSP stapling moves the OCSP query off the client entirely: the web server itself periodically fetches a signed, timestamped OCSP response from the CA and \"staples\" it to the TLS handshake, so the client gets revocation proof without ever contacting the CA directly. This eliminates the metadata leak, removes a round trip from every client connection, and is now the default approach for high-traffic HTTPS deployments.",
        ],
        diagram: {
          type: "sequence",
          title: "OCSP stapling",
          steps: [
            { label: "Server fetches proof periodically", detail: "Independently of any client connection, the server asks the CA's OCSP responder for a signed \"still valid\" statement, refreshed on a schedule (often hourly)." },
            { label: "Server caches the response", detail: "The signed OCSP response is stored and reused for every incoming connection until it needs refreshing." },
            { label: "Client connects", detail: "During the TLS handshake, the server attaches (\"staples\") the cached OCSP response alongside its certificate." },
            { label: "Client verifies locally", detail: "The client checks the OCSP response's signature and timestamp — no separate network call to the CA needed." },
          ],
        },
      },
      {
        heading: "Certificate Transparency: policing the CAs themselves",
        body: [
          "PKI's trust model has a structural weak point: any trusted CA can issue a valid certificate for any domain, and browsers have no way to know a certificate is fraudulent just by looking at it — this is exactly what happened in the 2011 DigiNotar breach, where attackers issued a valid, browser-trusted certificate for google.com without Google's involvement. Certificate Transparency (CT) addresses this by requiring newly issued certificates to be logged in public, append-only, cryptographically verifiable logs, so domain owners (and researchers) can monitor for certificates fraudulently issued in their name. Modern browsers now refuse to trust certificates that aren't backed by CT log entries.",
        ],
      },
      {
        heading: "Mutual TLS: certificates in both directions",
        body: [
          "Everything so far describes the server proving its identity to the client. Mutual TLS (mTLS) adds the reverse: the client also presents a certificate, and the server verifies it the same way the client verifies the server's — walking a chain of trust back to a CA the server trusts. This is common for service-to-service authentication inside a backend (rather than for regular websites, where issuing and managing a certificate for every visitor isn't practical), and it's the backbone of many zero-trust network architectures.",
        ],
      },
      {
        heading: "The shift to short-lived certificates",
        body: [
          "Let's Encrypt and the ACME protocol popularized free, automated certificate issuance with much shorter validity periods (90 days, versus the multi-year certificates common before). Shorter lifetimes shrink the exposure window if a key is compromised and reduce reliance on revocation infrastructure altogether — the certificate simply expires soon regardless.",
        ],
      },
    ],
  },
  {
    slug: "jwt-and-api-auth",
    title: "JSON Web Tokens & API authentication",
    summary:
      "JWTs put a signed claim in every request header. They're everywhere in modern APIs — and a few well-known implementation mistakes keep recurring.",
    minutes: 20,
    category: "Protocols",
    tags: ["developer", "architect"],
    sections: [
      {
        heading: "Structure",
        body: [
          "A JSON Web Token (JWT) is three base64url-encoded segments separated by dots: a header (naming the signing algorithm), a payload (the claims — arbitrary data such as user ID and expiry), and a signature over the first two segments. The signature can be produced with a symmetric HMAC (HS256) or an asymmetric algorithm like RSA or ECDSA (RS256, ES256).",
        ],
        diagram: {
          type: "structure",
          title: "Anatomy of a JWT",
          blocks: [
            { label: "Header (base64url)", detail: "{\"alg\": \"HS256\", \"typ\": \"JWT\"} — names the signing algorithm." },
            { label: "Payload (base64url)", detail: "{\"sub\": \"user123\", \"exp\": 1735689600, ...} — the claims. Encoded, not encrypted." },
            { label: "Signature", detail: "HMAC or RSA/ECDSA signature over \"header.payload\", proving neither was altered." },
          ],
        },
        math: [
          {
            expr: "\\text{signature} = \\mathrm{HMAC\\text{-}SHA256}(\\text{base64url(header)} \\,\\|\\, \\texttt{\".\"} \\,\\|\\, \\text{base64url(payload)},\\ \\text{secret})",
          },
        ],
      },
      {
        heading: "A real token, decoded",
        body: [
          "Here's an actual HS256-signed JWT encoding the claims {\"sub\": \"1234567890\", \"name\": \"Alice\", \"iat\": 1516239022}, signed with a symmetric secret. Each of the three segments below decodes with ordinary base64url — paste the first two into any base64 decoder and you'll get readable JSON back; only the third segment (the signature) is opaque, because it's the output of an HMAC, not an encoding of anything.",
        ],
        diagram: {
          type: "structure",
          title: "A real HS256 token, segment by segment",
          blocks: [
            { label: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", detail: "Decodes to {\"alg\":\"HS256\",\"typ\":\"JWT\"}" },
            { label: "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIiwiaWF0IjoxNTE2MjM5MDIyfQ", detail: "Decodes to {\"sub\":\"1234567890\",\"name\":\"Alice\",\"iat\":1516239022}" },
            { label: "gJh7jdj0jULbD61KFeWRh9Ux05MSQMND99uj_GbqN_k", detail: "HMAC-SHA256 over the first two segments, using the server's secret key" },
          ],
        },
      },
      {
        heading: "What the signature does and doesn't guarantee",
        body: [
          "Verifying a JWT's signature confirms the claims haven't been altered since signing and that they were signed by a holder of the corresponding key — it says nothing about whether the token has since been revoked or is still meant to be valid, which is why expiry (exp) claims and short lifetimes matter. The payload is only encoded, not encrypted: anyone can base64-decode it and read the claims, so secrets never belong there.",
        ],
      },
      {
        heading: "JWTs vs. opaque session tokens",
        body: [
          "The alternative to a JWT is an opaque session token: a random string that means nothing on its own, looked up in a server-side database on every request. The trade-off between them is really a trade-off about where state lives.",
        ],
        diagram: {
          type: "compare",
          left: {
            title: "Opaque session token",
            points: [
              "Server looks up session state in a database on every request",
              "Revoking access is instant — just delete the server-side record",
              "Doesn't scale as easily across independent services without a shared session store",
            ],
          },
          right: {
            title: "JWT",
            points: [
              "Self-contained — any service holding the public key (or shared secret) can verify it with no database lookup",
              "Scales well across microservices with no shared state",
              "Can't be revoked before its expiry without extra infrastructure (a blocklist, short lifetimes, etc.)",
            ],
          },
        },
      },
      {
        heading: "Well-known implementation pitfalls",
        body: [
          "The \"alg: none\" vulnerability let an attacker submit a token whose header claims no signature algorithm was used, and some early libraries would accept it as valid — effectively an unsigned token treated as trusted.",
        ],
      },
      {
        heading: "Algorithm confusion: turning a public key into an HMAC secret",
        body: [
          "A more subtle attack targets servers that support both RS256 (asymmetric) and HS256 (symmetric) verification. If the verifier trusts the algorithm named in the token's own header rather than pinning the algorithm it expects, an attacker can take a server's public RSA key (which is, by design, public) and use it as the secret for an HS256-signed forged token. A verifier that blindly follows the header's \"alg\": \"HS256\" will compute the HMAC using that public key as the secret — and the attacker, who also has that public key, can compute the exact same HMAC.",
        ],
        diagram: {
          type: "sequence",
          title: "Algorithm confusion attack",
          steps: [
            { label: "Attacker obtains the server's public key", detail: "RSA/ECDSA public keys used for RS256/ES256 verification are, by design, not secret." },
            { label: "Attacker crafts a forged token", detail: "They write whatever claims they want, set the header to \"alg\": \"HS256\", and sign it with HMAC using the public key as the HMAC secret." },
            { label: "Vulnerable server verifies", detail: "If the server reads \"alg\" from the token and uses HS256 verification with the same public key value, the forged signature checks out." },
            { label: "The fix", detail: "A correctly implemented verifier pins the expected algorithm itself and rejects any token that doesn't match — never trusting the header's own claim." },
          ],
        },
      },
    ],
  },
  {
    slug: "ssh-protocol",
    title: "SSH: key exchange, host keys, and authentication",
    summary:
      "The protocol behind every remote login and git push combines the same primitives as TLS, arranged slightly differently.",
    minutes: 10,
    category: "Protocols",
    tags: ["developer", "itops", "architect"],
    sections: [
      {
        heading: "The SSH handshake",
        body: [
          "An SSH connection begins with a key exchange — typically ECDH over Curve25519 (curve25519-sha256) in modern implementations — to establish a shared session key, followed by the server presenting its host key so the client can verify it's connecting to the right machine, and finally derivation of symmetric session keys (commonly AES or ChaCha20) used for the rest of the session.",
        ],
        diagram: {
          type: "sequence",
          title: "SSH connection setup",
          steps: [
            { label: "TCP connection + version exchange", detail: "Client and server announce their SSH protocol versions." },
            { label: "Key exchange (ECDH)", detail: "Both sides derive a shared secret via elliptic-curve Diffie-Hellman, typically over Curve25519." },
            { label: "Host key verification", detail: "The server proves it holds the private key matching its known host key fingerprint." },
            { label: "Session keys derived", detail: "Symmetric keys (AES or ChaCha20) are derived from the shared secret for the rest of the session." },
            { label: "User authentication", detail: "The client authenticates — typically by proving possession of a private key listed in authorized_keys." },
          ],
        },
      },
      {
        heading: "The exchange, client and server",
        body: [
          "The same setup, viewed as messages crossing the wire rather than internal steps: both sides contribute to the key exchange, then the server proves its identity before anything else is trusted.",
        ],
        diagram: {
          type: "swimlane",
          leftActor: "Client",
          rightActor: "Server",
          messages: [
            { from: "left", label: "version + key exchange init" },
            { from: "right", label: "host key + signature" },
            { from: "left", label: "encrypted session data" },
          ],
        },
      },
      {
        heading: "Trust-on-first-use vs. certificate authorities",
        body: [
          "Unlike TLS, which relies on a global PKI of Certificate Authorities, SSH's default host key model is trust-on-first-use: the first time you connect to a server, its host key fingerprint is recorded, and every future connection is checked against that record — which is exactly what the \"the authenticity of host X can't be established\" warning is asking you to verify manually. Larger organizations often layer an SSH certificate authority on top, having a trusted CA sign both host keys and user keys, closer to the TLS model.",
        ],
      },
      {
        heading: "User authentication",
        body: [
          "Public-key authentication — where the client proves possession of a private key whose matching public key is listed in the server's authorized_keys — is the recommended alternative to password authentication. Modern SSH deployments increasingly default to Ed25519 keys (a specific, fast elliptic-curve signature scheme) over RSA, for smaller key size and simpler, more misuse-resistant implementation.",
        ],
      },
    ],
  },
  {
    slug: "tls-in-practice",
    title: "TLS in practice: how HTTPS puts it all together",
    summary:
      "Every padlock icon runs a coordinated handshake combining key exchange, certificates, symmetric encryption, and integrity checks — in under a round trip.",
    minutes: 16,
    category: "Protocols",
    tags: ["developer", "architect", "itops", "grc", "curious", "researcher"],
    sections: [
      {
        heading: "What happens when you load an HTTPS page",
        body: [
          "Transport Layer Security (TLS) is the protocol behind the padlock icon, protecting the vast majority of web traffic. A TLS 1.3 handshake (the current version, standardized in 2018) typically completes in one round trip:",
          "1. The client offers supported cipher suites and a key share (an ephemeral ECDHE public value). 2. The server picks a cipher suite, replies with its own key share, and sends its certificate — signed by a Certificate Authority using RSA or ECDSA — plus a signature over the handshake so far. 3. Both sides independently derive the same shared secret via ECDHE, verify the certificate chain, and derive symmetric session keys from that shared secret. 4. All further application data is encrypted with a fast symmetric cipher, almost always AES-GCM or ChaCha20-Poly1305.",
        ],
        diagram: {
          type: "sequence",
          title: "TLS 1.3 handshake, one round trip",
          steps: [
            { label: "Client Hello", detail: "Client sends supported cipher suites and an ephemeral ECDHE key share." },
            { label: "Server Hello + certificate", detail: "Server picks a cipher suite, sends its own key share, its certificate chain, and a signature over the handshake transcript." },
            { label: "Both derive the shared secret", detail: "Client and server independently compute the same ECDHE shared secret and derive symmetric session keys from it." },
            { label: "Certificate verified", detail: "Client walks the certificate chain to a trusted root CA before trusting the connection." },
            { label: "Application data encrypted", detail: "All further traffic is encrypted with AES-GCM or ChaCha20-Poly1305 using the derived session keys." },
          ],
        },
      },
      {
        heading: "The handshake, as a message exchange",
        body: [
          "Stripped down to who sends what, a TLS 1.3 handshake is remarkably short — one message each way before application data starts flowing, which is exactly what makes it fast enough to happen on every new connection without a noticeable delay.",
        ],
        diagram: {
          type: "swimlane",
          leftActor: "Client",
          rightActor: "Server",
          messages: [
            { from: "left", label: "Hello + key share" },
            { from: "right", label: "Hello + key share + cert" },
            { from: "right", label: "Encrypted app data" },
          ],
          caption: "Everything after the server's first reply — including the rest of that same flight of messages — is already encrypted, which is why TLS 1.3 leaks less handshake metadata than TLS 1.2 did.",
        },
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
    slug: "secure-messaging-signal-protocol",
    title: "End-to-end encrypted messaging: the Signal Protocol",
    summary:
      "TLS protects data in transit to a server. The Signal Protocol's Double Ratchet goes further — encrypting so not even the server operator can read your messages.",
    minutes: 13,
    category: "Protocols",
    tags: ["developer", "architect", "curious", "researcher"],
    sections: [
      {
        heading: "Transport encryption vs. end-to-end encryption",
        body: [
          "TLS (covered in the previous module) encrypts data between a client and a server — the server itself sees the plaintext. End-to-end encryption (E2EE) encrypts data between two end users, such that the server relaying it, even if fully compromised, cannot read the content. Signal, and protocols derived from it (including WhatsApp's), are the most widely deployed implementations of this model for messaging.",
        ],
      },
      {
        heading: "X3DH: agreeing on a key while offline",
        body: [
          "Messaging has a problem TLS doesn't: the recipient may not be online to participate in a live key exchange. The Extended Triple Diffie-Hellman (X3DH) protocol solves this by having each user publish a set of pre-generated key material to a server in advance, so a sender can compute a shared secret and send a first encrypted message even if the recipient is offline at that moment.",
        ],
        diagram: {
          type: "sequence",
          title: "X3DH: starting a conversation while the recipient is offline",
          steps: [
            { label: "Bob publishes key bundles", detail: "Bob uploads a long-term identity key and a batch of pre-generated one-time keys to the server, then goes offline." },
            { label: "Alice fetches a bundle", detail: "Alice downloads one of Bob's pre-keys, even though Bob isn't online right now." },
            { label: "Alice derives a shared secret", detail: "She combines several Diffie-Hellman exchanges (her keys with Bob's identity and pre-key) into one shared secret." },
            { label: "Alice sends the first message", detail: "Encrypted with a key derived from that secret — Bob decrypts it once he comes back online, using the matching private keys." },
          ],
        },
      },
      {
        heading: "The Double Ratchet",
        body: [
          "After the initial key agreement, the Double Ratchet algorithm derives a new encryption key for every single message, combining a Diffie-Hellman ratchet (fresh key material exchanged periodically) with a symmetric-key ratchet (a one-way chain deriving each message key from the last). The result is forward secrecy at the level of individual messages — compromising one message's key doesn't expose earlier ones — plus post-compromise security: if an attacker briefly compromises a device's state, the ratchet's ongoing Diffie-Hellman exchanges eventually heal the session back to a secure state.",
        ],
        diagram: {
          type: "compare",
          left: {
            title: "Symmetric-key ratchet",
            points: [
              "Each message key is derived from the previous one via a one-way chain",
              "Fast — no new Diffie-Hellman exchange needed per message",
              "Alone, it wouldn't recover if a chain key were ever exposed",
            ],
          },
          right: {
            title: "Diffie-Hellman ratchet",
            points: [
              "New DH key pairs exchanged periodically alongside messages",
              "Injects fresh randomness that heals the session after a compromise",
              "Combined with the symmetric ratchet, gives both forward secrecy and post-compromise security",
            ],
          },
        },
      },
    ],
  },
  {
    slug: "key-sizes-and-security-levels",
    title: "Key sizes & security levels: what the numbers mean",
    summary:
      "128-bit AES, 2048-bit RSA, 256-bit ECC — these numbers aren't comparable at face value. Here's how to actually read them.",
    minutes: 10,
    category: "Foundations",
    tags: ["executive", "grc", "itops", "architect", "researcher"],
    sections: [
      {
        heading: "Bits of security, not bits of key",
        body: [
          "\"128-bit security\" means an attacker needs on the order of 2^128 operations to break the scheme — roughly the same difficulty regardless of which algorithm provides it. But the key size needed to reach a given security level varies enormously by algorithm family, because each is broken by a different class of attack.",
          "For AES (symmetric), the key size and the security level are the same number: a 128-bit key gives ~128-bit security. For RSA (broken by factoring, which has a sub-exponential classical algorithm), you need a much larger key — 3072 bits — to reach the same ~128-bit security level. For ECC (broken by the elliptic curve discrete log problem, which has no known sub-exponential classical attack), a 256-bit key already reaches ~128-bit security.",
        ],
        math: [
          {
            expr: "\\text{security level } = \\lambda \\;\\Longleftrightarrow\\; \\text{best known attack costs } \\approx 2^{\\lambda} \\text{ operations}",
          },
        ],
      },
      {
        heading: "A rough equivalence table",
        body: [
          "Roughly comparable classical security levels: 80-bit (deprecated) ≈ 1024-bit RSA ≈ 160-bit ECC. 112-bit (minimum acceptable today) ≈ 2048-bit RSA ≈ 224-bit ECC. 128-bit (current baseline) ≈ 3072-bit RSA ≈ 256-bit ECC ≈ AES-128. 192-bit ≈ 7680-bit RSA ≈ 384-bit ECC ≈ AES-192.",
          "These figures (based on NIST SP 800-57 guidance) are why a 2048-bit RSA key and a 256-bit ECC key are often deployed side by side as \"equivalent\" choices — they target the same classical security level via very different key sizes.",
        ],
        diagram: {
          type: "structure",
          title: "NIST SP 800-57 rough security-level equivalence",
          blocks: [
            { label: "80-bit (deprecated)", detail: "1024-bit RSA ≈ 160-bit ECC" },
            { label: "112-bit (today's minimum)", detail: "2048-bit RSA ≈ 224-bit ECC" },
            { label: "128-bit (current baseline)", detail: "3072-bit RSA ≈ 256-bit ECC ≈ AES-128" },
            { label: "192-bit", detail: "7680-bit RSA ≈ 384-bit ECC ≈ AES-192" },
          ],
        },
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
    slug: "random-number-generation",
    title: "Random number generation: the primitive everything else depends on",
    summary:
      "Every key, nonce, and IV in this catalog assumes truly unpredictable randomness. When that assumption breaks, everything built on top breaks with it.",
    minutes: 10,
    category: "Foundations",
    tags: ["developer", "architect", "itops", "researcher"],
    sections: [
      {
        heading: "CSPRNGs vs. ordinary randomness",
        body: [
          "A cryptographically secure pseudorandom number generator (CSPRNG) must satisfy a stronger property than statistical randomness: even seeing part of its output must give an attacker no useful ability to predict the rest, or to reconstruct its internal state. An ordinary PRNG used for simulations or games (like the Mersenne Twister) is often statistically excellent but trivially predictable once enough output is observed — it must never be used for keys, nonces, or IVs.",
        ],
        diagram: {
          type: "compare",
          left: {
            title: "Ordinary PRNG (e.g. Mersenne Twister)",
            points: [
              "Excellent statistical distribution — passes randomness test suites",
              "Deterministic from its seed — no unpredictability requirement",
              "Observing enough output can let an attacker reconstruct the internal state and predict all future output",
              "Fine for simulations and games; unsafe for keys, nonces, or IVs",
            ],
          },
          right: {
            title: "CSPRNG",
            points: [
              "Seeded from real hardware/OS entropy sources",
              "Output must be unpredictable even to an attacker who sees part of it",
              "Designed so recovering internal state from output is computationally infeasible",
              "Required for every key, nonce, and IV in this catalog",
            ],
          },
        },
      },
      {
        heading: "Where entropy actually comes from",
        body: [
          "Operating systems gather unpredictability (entropy) from physical sources — hardware interrupt timing, disk I/O timing, dedicated hardware RNGs on modern CPUs — and feed it into a CSPRNG exposed through an OS API: /dev/urandom on Linux and macOS, CryptGenRandom/BCryptGenRandom on Windows. Application code should always call these platform APIs rather than implementing its own randomness.",
        ],
      },
      {
        heading: "When it goes wrong: real incidents",
        body: [
          "In 2008, a patch to Debian's OpenSSL package accidentally removed nearly all sources of entropy from its key generation, causing it to produce keys from a pool of only about 32,768 possibilities for over a year before discovery — every key generated on an affected system was practically guessable. The 2010 Sony PlayStation 3 incident (referenced in the ECC module) was a related but distinct failure: not weak entropy, but reuse of the exact same \"random\" nonce for every ECDSA signature, which directly exposed the signing private key through simple algebra.",
        ],
      },
    ],
  },
  {
    slug: "side-channel-and-timing-attacks",
    title: "Side-channel & timing attacks: when the math is fine but the implementation isn't",
    summary:
      "A cryptographic algorithm can be mathematically unbreakable and still leak its secret key through how long it takes to run.",
    minutes: 11,
    category: "Practice",
    tags: ["developer", "architect", "researcher"],
    sections: [
      {
        heading: "What a side channel is",
        body: [
          "A side-channel attack recovers secret information not by attacking the mathematics of an algorithm, but by observing something about how it runs: how long an operation takes, how much power a chip draws, which memory addresses get accessed (and therefore which CPU cache lines get touched), or even electromagnetic emissions. None of these leaks require breaking AES or RSA mathematically — they exploit the physical reality of the implementation.",
        ],
      },
      {
        heading: "Timing attacks in TLS: Lucky Thirteen",
        body: [
          "The 2013 Lucky Thirteen attack exploited tiny timing differences in how some TLS implementations processed CBC-mode padding — a valid-padding check took a measurably different amount of time than an invalid one, letting an attacker who could send many requests and measure response timing gradually recover plaintext, echoing the Bleichenbacher padding-oracle pattern covered in the RSA padding module but at the symmetric-cipher layer.",
        ],
        diagram: {
          type: "sequence",
          title: "Lucky Thirteen, simplified",
          steps: [
            { label: "Modify a captured ciphertext", detail: "The attacker tweaks bytes of an intercepted CBC-encrypted TLS record." },
            { label: "Resubmit and measure response time", detail: "A record with valid padding takes a measurably different code path (and time) to process than one with invalid padding." },
            { label: "Repeat thousands of times", detail: "Statistical averaging filters out network noise from the microsecond-scale timing signal." },
            { label: "Recover the plaintext byte by byte", detail: "Each timing measurement narrows down one byte of the original encrypted data." },
          ],
        },
      },
      {
        heading: "Cache-timing attacks",
        body: [
          "Early software AES implementations used lookup tables for the SubBytes step. Because CPU caches are shared and timing-observable, an attacker running unrelated code on the same physical machine (relevant in cloud/virtualized environments) could sometimes infer which table entries were accessed, and from that recover key bits — a cache-timing attack. This is one of the reasons modern CPUs ship dedicated AES instructions (AES-NI), which execute in constant time regardless of data.",
        ],
      },
      {
        heading: "The mitigation: constant-time code",
        body: [
          "The general defense is constant-time programming: writing cryptographic code so its execution time, memory access pattern, and power draw never depend on secret data — no data-dependent branches, no data-dependent array indexing. This is precisely why cryptography guidelines insist on vetted libraries over custom implementations: constant-time discipline is easy to state and notoriously easy to violate by accident.",
        ],
      },
    ],
  },
  {
    slug: "blockchain-and-signatures",
    title: "Cryptography inside blockchains: hashing, Merkle trees, and signatures",
    summary:
      "Bitcoin and Ethereum don't invent new cryptography — they compose the same primitives in this catalog into a specific, tamper-evident structure.",
    minutes: 12,
    category: "Practice",
    tags: ["developer", "curious", "researcher"],
    sections: [
      {
        heading: "Hash chains",
        body: [
          "Each block in a blockchain includes the cryptographic hash of the previous block's header. Changing anything in an earlier block changes its hash, which no longer matches what the next block recorded, which cascades forward through every subsequent block — making tampering with history computationally evident, not just inconvenient.",
        ],
      },
      {
        heading: "Merkle trees",
        body: [
          "Rather than hashing an entire block's transaction list as one blob, transactions are organized into a Merkle tree: pairs of transaction hashes are hashed together, then pairs of those results, repeatedly, up to a single root hash stored in the block header. This lets a client prove a specific transaction is included in a block by presenting only a small path of hashes (a Merkle proof) rather than downloading every transaction in the block.",
        ],
        diagram: { type: "merkle" },
      },
      {
        heading: "ECDSA and self-custody",
        body: [
          "Bitcoin and Ethereum both use ECDSA (over the secp256k1 curve) to sign transactions, directly applying the signature module covered earlier: whoever holds the private key can produce a valid signature authorizing a transaction, and there's no third party who can reset or recover it. Losing the private key means losing access to the funds permanently — there's no password-reset flow, because there's no central authority to appeal to.",
        ],
        math: [
          {
            expr: "y^{2} = x^{3} + 7 \\pmod{p}",
            caption: "secp256k1, the curve Bitcoin and Ethereum use — a specific instance of the general curve equation from the ECC module, with a = 0, b = 7.",
          },
        ],
      },
      {
        heading: "The specific PQC angle for blockchains",
        body: [
          "Blockchains have an unusual quantum-risk profile worth noting: an ECDSA public key is only revealed on-chain the moment its owner first spends from that address. Coins that have never been spent from expose only a hash of the public key, adding a layer of protection — but any address that has ever sent a transaction has its full public key permanently on the public ledger, available today to be attacked by a future quantum computer running Shor's algorithm.",
        ],
      },
    ],
  },
  {
    slug: "quantum-threat-shor",
    title: "Why quantum computers break this: Shor's algorithm",
    summary:
      "The bridge module: why everything above is called \"classical\" cryptography, and exactly what a future quantum computer would do to it.",
    minutes: 11,
    category: "Foundations",
    tags: ["executive", "developer", "architect", "researcher", "curious"],
    sections: [
      {
        heading: "The specific mathematical trapdoor",
        body: [
          "RSA, Diffie-Hellman, and ECC all rest on problems classical computers cannot solve efficiently: factoring large integers, and computing discrete logarithms (in modular arithmetic or on elliptic curves). Every key size recommendation in this catalog is calibrated against the best known classical algorithms for these problems.",
          "In 1994, mathematician Peter Shor published a quantum algorithm that solves both integer factorization and discrete logarithms in polynomial time — meaning the running time grows manageably with input size, unlike the sub-exponential or exponential growth classical algorithms face. On a sufficiently large, sufficiently low-error quantum computer, Shor's algorithm would make RSA, classical Diffie-Hellman, and ECC/ECDSA all breakable in practical time.",
        ],
        math: [
          {
            expr: "\\text{Shor: } O\\big((\\log N)^{2}(\\log\\log N)(\\log\\log\\log N)\\big) \\quad\\text{vs.}\\quad \\text{GNFS: } O\\!\\left(e^{1.9(\\log N)^{1/3}(\\log\\log N)^{2/3}}\\right)",
            caption: "Shor's quantum running time grows polynomially with the number's size N; the best classical factoring algorithm (GNFS) grows sub-exponentially — the gap that makes large keys \"safe\" classically and irrelevant quantumly.",
          },
        ],
      },
      {
        heading: "\"Sufficiently large\" is doing a lot of work",
        body: [
          "Breaking RSA-2048 with Shor's algorithm is estimated to require several thousand logical (fully error-corrected) qubits — which, given current error rates, could require millions of physical qubits once error correction overhead is included. Today's largest quantum computers have on the order of hundreds to low thousands of physical, noisy qubits. No quantum computer today can run Shor's algorithm against real-world key sizes.",
          "That gap doesn't mean the risk is purely theoretical for now, though — see the next module on why data encrypted today can already be at risk.",
        ],
      },
      {
        heading: "What doesn't break",
        body: [
          "Symmetric algorithms (AES) and hash functions (SHA-2, SHA-3) are not vulnerable to Shor's algorithm — there's no known efficient quantum algorithm for brute-forcing a symmetric key or finding hash collisions beyond Grover's quadratic speedup, which is countered simply by using larger keys (AES-256 instead of AES-128).",
          "This is the exact fault line PQC standards draw: NIST's post-quantum standards (ML-KEM, ML-DSA, SLH-DSA) replace the public-key algorithms covered in this catalog — RSA, Diffie-Hellman, ECC — while leaving AES and SHA-2/3 in place, just with larger key sizes where needed.",
        ],
        diagram: {
          type: "compare",
          left: {
            title: "Broken by Shor's algorithm",
            points: [
              "RSA (factoring)",
              "Classical Diffie-Hellman (discrete log)",
              "ECC / ECDSA (elliptic curve discrete log)",
              "Effectively 0-bit security at any key size, once a large enough quantum computer exists",
            ],
          },
          right: {
            title: "Only weakened by Grover's algorithm",
            points: [
              "AES (symmetric encryption)",
              "SHA-2 / SHA-3 (hash functions)",
              "Security level roughly halves — AES-256 still gives ~128-bit quantum-resistant security",
              "Fixed by using larger keys, not by replacing the algorithm",
            ],
          },
        },
      },
    ],
  },
  {
    slug: "harvest-now-decrypt-later",
    title: "Harvest now, decrypt later: the risk that's already here",
    summary:
      "You don't need a working quantum computer today to be at risk today. Anything encrypted now with RSA or ECC can simply be recorded and decrypted later.",
    minutes: 9,
    category: "Practice",
    tags: ["executive", "grc", "architect", "researcher"],
    sections: [
      {
        heading: "The attack doesn't need quantum hardware yet",
        body: [
          "\"Harvest now, decrypt later\" describes a passive attack that's already executable with today's technology: an adversary records encrypted traffic now — TLS sessions, VPN traffic, stored backups — and simply holds onto the ciphertext, waiting until a cryptographically relevant quantum computer exists to decrypt the RSA or ECDH key exchange that protected it. The recording requires no quantum computer at all; only the eventual decryption does.",
        ],
        diagram: {
          type: "sequence",
          title: "The harvest-now-decrypt-later timeline",
          steps: [
            { label: "Today: record", detail: "An adversary passively captures and stores RSA/ECDH-protected ciphertext — no quantum computer needed for this step." },
            { label: "Years pass", detail: "The ciphertext sits in storage. Classically, it remains unbreakable the entire time." },
            { label: "Eventually: a capable quantum computer exists", detail: "Once a sufficiently large, low-error quantum computer runs Shor's algorithm, the key exchange that protected the recording is broken." },
            { label: "Retroactive decryption", detail: "Everything harvested years earlier is decrypted at once — the delay never protected it." },
          ],
        },
      },
      {
        heading: "Who this actually threatens",
        body: [
          "This risk is proportional to how long data needs to stay confidential. State secrets, medical records, trade secrets, and long-term personal data are exposed today if intercepted today, because they still need protection years or decades from now. A single ephemeral session that's operationally irrelevant a week later carries far less exposure — though it's worth noting exactly which key exchange protected it, since forward-secret ECDHE sessions are still individually vulnerable to this specific harvesting risk even though each session used a fresh key.",
        ],
      },
      {
        heading: "Why this drives migration timing, not just eventual planning",
        body: [
          "This is the practical argument organizations use for starting PQC migration — specifically hybrid key exchange, combining a classical algorithm like ECDH with a post-quantum algorithm like ML-KEM in the same handshake — well before a quantum computer capable of Shor's algorithm exists, rather than waiting for one to appear. Data harvested today under purely classical protection is already, in effect, on a countdown.",
        ],
      },
    ],
  },
];

export interface Persona {
  id: RoleId;
  label: string;
  tagline: string;
  pitch: string;
  firstWin: { label: string; slug: string; minutes: number };
  moduleSlugs: string[];
}

export const personas: Persona[] = [
  {
    id: "executive",
    label: "Executive / Business Leader",
    tagline: "Risk exposure & investment focus",
    pitch:
      "Your board is asking about the PQC migration. Before you can answer, you need to know what \"classic\" crypto your organisation actually depends on today.",
    firstWin: { label: "See what's actually at risk", slug: "key-sizes-and-security-levels", minutes: 10 },
    moduleSlugs: [
      "key-sizes-and-security-levels",
      "rsa-public-key",
      "quantum-threat-shor",
      "harvest-now-decrypt-later",
    ],
  },
  {
    id: "grc",
    label: "GRC / Risk & Compliance",
    tagline: "Obligations, inventory & evidence focus",
    pitch:
      "Auditors want a cryptographic bill of materials. Know which algorithms are in scope before you can attest to anything.",
    firstWin: { label: "Map the algorithms you must inventory", slug: "tls-in-practice", minutes: 16 },
    moduleSlugs: [
      "tls-in-practice",
      "key-sizes-and-security-levels",
      "hash-functions-and-signatures",
      "digital-certificates-x509",
      "key-derivation-functions",
      "harvest-now-decrypt-later",
    ],
  },
  {
    id: "developer",
    label: "Developer / Engineer",
    tagline: "Implementation & protocol focus",
    pitch:
      "RSA, AES, ECDSA and SHA-2 are already in every library you import. Understand what they actually do before you touch a crypto API.",
    firstWin: { label: "See a real handshake, step by step", slug: "tls-in-practice", minutes: 16 },
    moduleSlugs: [
      "math-foundations-modular-arithmetic",
      "symmetric-key-aes",
      "stream-ciphers-chacha20",
      "rsa-public-key",
      "rsa-padding-oaep-pkcs1",
      "elliptic-curve-cryptography",
      "diffie-hellman-key-exchange",
      "hash-functions-and-signatures",
      "key-derivation-functions",
      "jwt-and-api-auth",
      "tls-in-practice",
      "random-number-generation",
      "side-channel-and-timing-attacks",
    ],
  },
  {
    id: "architect",
    label: "Security Architect",
    tagline: "System & infrastructure focus",
    pitch:
      "Every PKI, VPN and TLS terminator you've designed rests on the same handful of primitives. Get the mental model right before you redesign anything.",
    firstWin: { label: "Trace trust from key exchange to signature", slug: "diffie-hellman-key-exchange", minutes: 24 },
    moduleSlugs: [
      "diffie-hellman-key-exchange",
      "elliptic-curve-cryptography",
      "hash-functions-and-signatures",
      "digital-certificates-x509",
      "tls-in-practice",
      "ssh-protocol",
      "secure-messaging-signal-protocol",
      "key-sizes-and-security-levels",
      "side-channel-and-timing-attacks",
      "harvest-now-decrypt-later",
    ],
  },
  {
    id: "itops",
    label: "IT Ops / DevOps",
    tagline: "Deploy & operate focus",
    pitch:
      "Certificates, cipher suites, key sizes — the settings you configure every day encode decades of cryptographic design. Know what they mean.",
    firstWin: { label: "Understand what a cipher suite actually says", slug: "tls-in-practice", minutes: 16 },
    moduleSlugs: [
      "symmetric-key-aes",
      "stream-ciphers-chacha20",
      "tls-in-practice",
      "digital-certificates-x509",
      "ssh-protocol",
      "key-sizes-and-security-levels",
      "random-number-generation",
    ],
  },
  {
    id: "researcher",
    label: "Researcher / Academic",
    tagline: "Comprehensive, no filtering",
    pitch: "Open the full catalog. Every module, in order, with no persona filtering.",
    firstWin: { label: "Start at the foundations", slug: "math-foundations-modular-arithmetic", minutes: 10 },
    moduleSlugs: modules.map((m) => m.slug),
  },
  {
    id: "curious",
    label: "Curious Explorer",
    tagline: "New to cryptography",
    pitch:
      "Your browser's padlock icon runs on math you use every day without seeing. Here's what's actually happening behind it.",
    firstWin: { label: "What happens when you visit a website", slug: "tls-in-practice", minutes: 16 },
    moduleSlugs: [
      "math-foundations-modular-arithmetic",
      "symmetric-key-aes",
      "rsa-public-key",
      "tls-in-practice",
      "hash-functions-and-signatures",
      "blockchain-and-signatures",
      "secure-messaging-signal-protocol",
    ],
  },
];

export function getModule(slug: string): Module | undefined {
  return modules.find((m) => m.slug === slug);
}

export function getPersona(id: string): Persona | undefined {
  return personas.find((p) => p.id === id);
}

export function getPersonaTrackStats(persona: Persona): { count: number; minutes: number } {
  const minutes = persona.moduleSlugs.reduce((sum, slug) => {
    const mod = getModule(slug);
    return sum + (mod?.minutes ?? 0);
  }, 0);
  return { count: persona.moduleSlugs.length, minutes };
}

export const roleLabels: Record<RoleId, string> = Object.fromEntries(
  personas.map((p) => [p.id, p.label])
) as Record<RoleId, string>;
