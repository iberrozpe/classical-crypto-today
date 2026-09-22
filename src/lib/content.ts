export type RoleId =
  | "executive"
  | "grc"
  | "developer"
  | "architect"
  | "itops"
  | "researcher"
  | "curious";

export interface Module {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  tags: RoleId[];
  category: "Foundations" | "Public-key" | "Symmetric-key" | "Protocols" | "Practice";
  sections: { heading: string; body: string[] }[];
}

export const modules: Module[] = [
  {
    slug: "math-foundations-modular-arithmetic",
    title: "The math underneath: modular arithmetic & one-way functions",
    summary:
      "Every public-key algorithm in this catalog leans on the same idea: a calculation that's easy in one direction and effectively impossible to undo in the other.",
    minutes: 8,
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
      },
      {
        heading: "Trapdoors: a shortcut for the key-holder",
        body: [
          "A trapdoor function is a one-way function with a secret that makes the hard direction easy again — but only if you know the secret. RSA's trapdoor is knowledge of the two prime factors of the modulus; with them, decryption is a fast modular exponentiation, but without them, an attacker faces the full difficulty of factoring. This single idea — one-way in general, easy with a secret — is the mechanism that makes a public key public and a private key private.",
        ],
      },
    ],
  },
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
    slug: "stream-ciphers-chacha20",
    title: "Stream ciphers & ChaCha20-Poly1305",
    summary:
      "Not every symmetric cipher works in fixed blocks. ChaCha20 generates a keystream instead — and paired with Poly1305, it's AES-GCM's fastest rival.",
    minutes: 8,
    category: "Symmetric-key",
    tags: ["developer", "architect", "itops", "researcher"],
    sections: [
      {
        heading: "Block ciphers vs. stream ciphers",
        body: [
          "AES is a block cipher: it transforms fixed 128-bit chunks. A stream cipher instead generates a pseudorandom keystream from the key and a nonce, then combines it with the plaintext one bit or byte at a time (almost always with XOR). Encryption and decryption are the identical operation — XOR the data with the same keystream again.",
        ],
      },
      {
        heading: "How ChaCha20 builds its keystream",
        body: [
          "ChaCha20, designed by Daniel J. Bernstein, generates its keystream by repeatedly mixing a 256-bit key, a counter, and a nonce through a sequence of addition, rotation, and XOR operations (ARX). Unlike AES, none of this depends on table lookups, which sidesteps a class of cache-timing side-channel attacks that have affected some AES software implementations on hardware without dedicated AES instructions.",
        ],
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
    slug: "rsa-padding-oaep-pkcs1",
    title: "RSA padding: OAEP, PKCS#1 v1.5, and why raw RSA fails",
    summary:
      "Textbook RSA is deterministic and malleable. Padding schemes are what actually make RSA encryption and signing safe to use in the real world.",
    minutes: 9,
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
      },
      {
        heading: "OAEP and PSS: the modern replacements",
        body: [
          "OAEP (Optimal Asymmetric Encryption Padding) is the modern standard for RSA encryption, built to be provably secure against chosen-ciphertext attacks using randomized padding derived from hash functions. For signatures, the analogous modern scheme is RSA-PSS (Probabilistic Signature Scheme), which similarly replaces the deterministic padding of PKCS#1 v1.5 signatures with a randomized construction.",
        ],
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
    slug: "key-derivation-functions",
    title: "Password hashing & key derivation: PBKDF2, bcrypt, scrypt, Argon2",
    summary:
      "A cryptographic hash is too fast for passwords. KDFs deliberately slow things down — and not all of them do it the same way.",
    minutes: 9,
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
      },
      {
        heading: "Argon2: the current recommendation",
        body: [
          "Argon2 won the Password Hashing Competition in 2015 and is now the generally recommended choice for new systems. Like scrypt, it's memory-hard, with independently tunable time, memory, and parallelism costs, and comes in variants (Argon2id is typically recommended) balancing resistance to both GPU/ASIC attacks and side-channel attacks.",
        ],
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
    minutes: 10,
    category: "Protocols",
    tags: ["architect", "itops", "grc", "developer"],
    sections: [
      {
        heading: "Anatomy of a certificate",
        body: [
          "An X.509 certificate is a structured, digitally signed document binding a public key to an identity (a domain name, an organization, a person). Its key fields include the subject (who the certificate identifies, including Subject Alternative Names for the domains it covers), the issuer (which Certificate Authority signed it), the public key itself, a validity period, and the issuer's signature over all of it.",
        ],
      },
      {
        heading: "The chain of trust",
        body: [
          "Certificates form a chain: a leaf certificate (a website's) is signed by an intermediate CA, whose own certificate is signed by a root CA. Root CA certificates are the trust anchors — pre-installed in operating systems and browsers — and everything else is trusted only because it traces back, signature by signature, to one of them. This is the same hash-then-sign mechanism covered in the hashing and signatures module, applied recursively.",
        ],
      },
      {
        heading: "Revocation: harder than it sounds",
        body: [
          "A certificate's validity period isn't the only way it can stop being trusted — it can be revoked early, for example if its private key is compromised. Certificate Revocation Lists (CRLs) are downloadable lists of revoked certificate serial numbers; OCSP (Online Certificate Status Protocol) lets a client ask a CA in real time whether a specific certificate is still valid. Both have practical weaknesses (CRLs grow large and go stale; live OCSP queries leak browsing metadata to the CA and can fail open if the CA is unreachable), which is why OCSP stapling — where the server itself periodically fetches and attaches a signed OCSP response — has become the preferred approach.",
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
    minutes: 8,
    category: "Protocols",
    tags: ["developer", "architect"],
    sections: [
      {
        heading: "Structure",
        body: [
          "A JSON Web Token (JWT) is three base64url-encoded segments separated by dots: a header (naming the signing algorithm), a payload (the claims — arbitrary data such as user ID and expiry), and a signature over the first two segments. The signature can be produced with a symmetric HMAC (HS256) or an asymmetric algorithm like RSA or ECDSA (RS256, ES256).",
        ],
      },
      {
        heading: "What the signature does and doesn't guarantee",
        body: [
          "Verifying a JWT's signature confirms the claims haven't been altered since signing and that they were signed by a holder of the corresponding key — it says nothing about whether the token has since been revoked or is still meant to be valid, which is why expiry (exp) claims and short lifetimes matter. The payload is only encoded, not encrypted: anyone can base64-decode it and read the claims, so secrets never belong there.",
        ],
      },
      {
        heading: "Well-known implementation pitfalls",
        body: [
          "The \"alg: none\" vulnerability let an attacker submit a token whose header claims no signature algorithm was used, and some early libraries would accept it as valid. A related algorithm-confusion attack tricks a server configured to verify RS256 (asymmetric) tokens into instead verifying an attacker-crafted HS256 token using the server's own public key as the HMAC secret — since the public key is, by definition, public. Modern libraries mitigate both by requiring the verifier to pin the expected algorithm rather than trusting the token's own header.",
        ],
      },
    ],
  },
  {
    slug: "ssh-protocol",
    title: "SSH: key exchange, host keys, and authentication",
    summary:
      "The protocol behind every remote login and git push combines the same primitives as TLS, arranged slightly differently.",
    minutes: 8,
    category: "Protocols",
    tags: ["developer", "itops", "architect"],
    sections: [
      {
        heading: "The SSH handshake",
        body: [
          "An SSH connection begins with a key exchange — typically ECDH over Curve25519 (curve25519-sha256) in modern implementations — to establish a shared session key, followed by the server presenting its host key so the client can verify it's connecting to the right machine, and finally derivation of symmetric session keys (commonly AES or ChaCha20) used for the rest of the session.",
        ],
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
    slug: "secure-messaging-signal-protocol",
    title: "End-to-end encrypted messaging: the Signal Protocol",
    summary:
      "TLS protects data in transit to a server. The Signal Protocol's Double Ratchet goes further — encrypting so not even the server operator can read your messages.",
    minutes: 10,
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
      },
      {
        heading: "The Double Ratchet",
        body: [
          "After the initial key agreement, the Double Ratchet algorithm derives a new encryption key for every single message, combining a Diffie-Hellman ratchet (fresh key material exchanged periodically) with a symmetric-key ratchet (a one-way chain deriving each message key from the last). The result is forward secrecy at the level of individual messages — compromising one message's key doesn't expose earlier ones — plus post-compromise security: if an attacker briefly compromises a device's state, the ratchet's ongoing Diffie-Hellman exchanges eventually heal the session back to a secure state.",
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
    slug: "random-number-generation",
    title: "Random number generation: the primitive everything else depends on",
    summary:
      "Every key, nonce, and IV in this catalog assumes truly unpredictable randomness. When that assumption breaks, everything built on top breaks with it.",
    minutes: 8,
    category: "Foundations",
    tags: ["developer", "architect", "itops", "researcher"],
    sections: [
      {
        heading: "CSPRNGs vs. ordinary randomness",
        body: [
          "A cryptographically secure pseudorandom number generator (CSPRNG) must satisfy a stronger property than statistical randomness: even seeing part of its output must give an attacker no useful ability to predict the rest, or to reconstruct its internal state. An ordinary PRNG used for simulations or games (like the Mersenne Twister) is often statistically excellent but trivially predictable once enough output is observed — it must never be used for keys, nonces, or IVs.",
        ],
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
    minutes: 9,
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
    minutes: 9,
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
      },
      {
        heading: "ECDSA and self-custody",
        body: [
          "Bitcoin and Ethereum both use ECDSA (over the secp256k1 curve) to sign transactions, directly applying the signature module covered earlier: whoever holds the private key can produce a valid signature authorizing a transaction, and there's no third party who can reset or recover it. Losing the private key means losing access to the funds permanently — there's no password-reset flow, because there's no central authority to appeal to.",
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
          "That gap doesn't mean the risk is purely theoretical for now, though — see the next module on why data encrypted today can already be at risk.",
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
  {
    slug: "harvest-now-decrypt-later",
    title: "Harvest now, decrypt later: the risk that's already here",
    summary:
      "You don't need a working quantum computer today to be at risk today. Anything encrypted now with RSA or ECC can simply be recorded and decrypted later.",
    minutes: 7,
    category: "Practice",
    tags: ["executive", "grc", "architect", "researcher"],
    sections: [
      {
        heading: "The attack doesn't need quantum hardware yet",
        body: [
          "\"Harvest now, decrypt later\" describes a passive attack that's already executable with today's technology: an adversary records encrypted traffic now — TLS sessions, VPN traffic, stored backups — and simply holds onto the ciphertext, waiting until a cryptographically relevant quantum computer exists to decrypt the RSA or ECDH key exchange that protected it. The recording requires no quantum computer at all; only the eventual decryption does.",
        ],
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
    firstWin: { label: "See what's actually at risk", slug: "key-sizes-and-security-levels", minutes: 8 },
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
    firstWin: { label: "Map the algorithms you must inventory", slug: "tls-in-practice", minutes: 13 },
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
    firstWin: { label: "See a real handshake, step by step", slug: "tls-in-practice", minutes: 13 },
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
    firstWin: { label: "Trace trust from key exchange to signature", slug: "diffie-hellman-key-exchange", minutes: 9 },
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
    firstWin: { label: "Understand what a cipher suite actually says", slug: "tls-in-practice", minutes: 13 },
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
    firstWin: { label: "Start at the foundations", slug: "math-foundations-modular-arithmetic", minutes: 8 },
    moduleSlugs: modules.map((m) => m.slug),
  },
  {
    id: "curious",
    label: "Curious Explorer",
    tagline: "New to cryptography",
    pitch:
      "Your browser's padlock icon runs on math you use every day without seeing. Here's what's actually happening behind it.",
    firstWin: { label: "What happens when you visit a website", slug: "tls-in-practice", minutes: 13 },
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
