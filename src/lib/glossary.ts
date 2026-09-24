export interface GlossaryTerm {
  term: string;
  definition: string;
  relatedModules?: string[];
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "AEAD (Authenticated Encryption with Associated Data)",
    definition:
      "An encryption mode that provides confidentiality and integrity together in one pass, and can also authenticate extra data that isn't encrypted (like a packet header). AES-GCM and ChaCha20-Poly1305 are both AEAD ciphers.",
    relatedModules: ["symmetric-key-aes"],
  },
  {
    term: "AES (Advanced Encryption Standard)",
    definition:
      "The current standard symmetric-key block cipher, operating on 128-bit blocks with 128-, 192-, or 256-bit keys, selected by NIST in 2001 after a public competition (winning design: Rijndael).",
    relatedModules: ["symmetric-key-aes"],
  },
  {
    term: "AES-NI",
    definition:
      "Dedicated AES instructions built into modern CPUs, executing in constant time regardless of data — closing the cache-timing side channel that plagued early software lookup-table implementations.",
    relatedModules: ["side-channel-and-timing-attacks"],
  },
  {
    term: "Algorithm confusion",
    definition:
      "A JWT attack where a verifier that trusts the algorithm named in a token's own header can be tricked into verifying an RS256 token as HS256, using the (public) RSA public key as the HMAC secret.",
    relatedModules: ["jwt-and-api-auth"],
  },
  {
    term: "Asymmetric encryption",
    definition:
      "Encryption using a mathematically related key pair — a public key for encrypting or verifying, and a private key for decrypting or signing — so two parties never need to share a secret in advance. RSA and ECC are the two families covered in this catalog.",
  },
  {
    term: "Authentication tag",
    definition:
      "The short value an AEAD cipher (like AES-GCM) appends to a ciphertext, letting the receiver detect any tampering with the ciphertext or its associated data before trusting the decrypted plaintext.",
    relatedModules: ["symmetric-key-aes"],
  },
  {
    term: "Avalanche effect",
    definition:
      "The property that changing a single input bit to a hash function or cipher flips roughly half the output bits, unpredictably — making outputs for similar inputs look completely unrelated.",
    relatedModules: ["hash-functions-and-signatures"],
  },
  {
    term: "Birthday bound",
    definition:
      "The reason an n-bit hash offers only n/2-bit collision resistance: thanks to the birthday paradox, finding any two colliding inputs takes roughly 2^(n/2) attempts, far fewer than the 2^n needed to reverse one specific digest.",
    relatedModules: ["hash-functions-and-signatures"],
  },
  {
    term: "Bleichenbacher attack",
    definition:
      "A padding-oracle attack against RSA PKCS#1 v1.5 encryption: by observing whether a server treats a modified ciphertext's padding as valid, an attacker can gradually decrypt it without ever learning the private key.",
    relatedModules: ["rsa-padding-oaep-pkcs1"],
  },
  {
    term: "Block cipher",
    definition:
      "A symmetric cipher that encrypts data in fixed-size chunks (blocks) — AES operates on 128-bit blocks. A mode of operation (GCM, CBC, CTR) defines how a block cipher handles messages longer than one block.",
    relatedModules: ["symmetric-key-aes"],
  },
  {
    term: "Cache-timing attack",
    definition:
      "A side-channel attack that infers secret data (like an AES key) by observing which CPU cache lines an implementation accesses, exploitable when attacker and victim code share a physical machine.",
    relatedModules: ["side-channel-and-timing-attacks"],
  },
  {
    term: "CBC (Cipher Block Chaining)",
    definition:
      "An older block cipher mode that XORs each plaintext block with the previous ciphertext block before encrypting. Vulnerable to padding-oracle attacks (like Lucky Thirteen) unless paired with a separate MAC.",
    relatedModules: ["symmetric-key-aes", "side-channel-and-timing-attacks"],
  },
  {
    term: "Certificate Authority (CA)",
    definition:
      "An organization trusted to verify identities and issue signed X.509 certificates binding a public key to that identity. Root CA certificates are pre-installed as trust anchors in operating systems and browsers.",
    relatedModules: ["digital-certificates-x509"],
  },
  {
    term: "Certificate Revocation List (CRL)",
    definition:
      "A downloadable, CA-signed list of revoked certificate serial numbers, checked by clients to detect certificates that should no longer be trusted before their expiry date.",
    relatedModules: ["digital-certificates-x509"],
  },
  {
    term: "Certificate Transparency (CT)",
    definition:
      "A system requiring newly issued certificates to be logged in public, append-only logs, so domain owners can detect certificates fraudulently issued in their name by a compromised or misbehaving CA.",
    relatedModules: ["digital-certificates-x509"],
  },
  {
    term: "ChaCha20-Poly1305",
    definition:
      "An AEAD cipher combining the ChaCha20 stream cipher with the Poly1305 MAC, widely used as a fast, side-channel-resistant alternative to AES-GCM, especially on devices without AES hardware acceleration.",
    relatedModules: ["stream-ciphers-chacha20"],
  },
  {
    term: "Chaining value",
    definition:
      "The running intermediate state passed from one compression-function step to the next inside the Merkle-Damgård hash construction; the final chaining value, after the last block, is the digest itself.",
    relatedModules: ["hash-functions-and-signatures"],
  },
  {
    term: "Collision resistance",
    definition:
      "The property that it should be computationally infeasible to find two different inputs producing the same hash digest — one of the three core guarantees of a cryptographic hash function.",
    relatedModules: ["hash-functions-and-signatures"],
  },
  {
    term: "Constant-time code",
    definition:
      "Code written so its execution time, memory access pattern, and power draw never depend on secret data — the general defense against timing and cache side-channel attacks.",
    relatedModules: ["side-channel-and-timing-attacks"],
  },
  {
    term: "CSPRNG (Cryptographically Secure Pseudorandom Number Generator)",
    definition:
      "A random number generator whose output is unpredictable even to an attacker who observes part of it — required for every key, nonce, and IV. Ordinary statistical PRNGs (like the Mersenne Twister) are unsafe for this purpose.",
    relatedModules: ["random-number-generation"],
  },
  {
    term: "Diffie-Hellman (DH)",
    definition:
      "A key-exchange protocol letting two parties derive a shared secret over a public channel without ever transmitting it, based on the difficulty of the discrete logarithm problem.",
    relatedModules: ["diffie-hellman-key-exchange"],
  },
  {
    term: "Digest",
    definition:
      "The fixed-size output of a hash function — for SHA-256, always 256 bits, regardless of the input's length.",
    relatedModules: ["hash-functions-and-signatures"],
  },
  {
    term: "Digital signature",
    definition:
      "A cryptographic proof that a message came from the holder of a specific private key and wasn't altered since signing, produced by transforming a hash of the message with that private key (hash-then-sign).",
    relatedModules: ["hash-functions-and-signatures"],
  },
  {
    term: "Discrete logarithm problem",
    definition:
      "The problem of finding the exponent k such that g^k = h in a mathematical group, given g and h — believed computationally hard classically, and the trapdoor underlying Diffie-Hellman and (in its elliptic-curve form) ECC.",
    relatedModules: ["diffie-hellman-key-exchange", "math-foundations-modular-arithmetic"],
  },
  {
    term: "Double Ratchet",
    definition:
      "The Signal Protocol algorithm that derives a fresh key for every message by combining a symmetric-key ratchet (a one-way chain) with a Diffie-Hellman ratchet, giving forward secrecy and post-compromise security.",
    relatedModules: ["secure-messaging-signal-protocol"],
  },
  {
    term: "ECC (Elliptic Curve Cryptography)",
    definition:
      "A public-key family based on the algebraic structure of points on an elliptic curve, offering equivalent security to RSA at much smaller key sizes because the elliptic curve discrete log problem has no known sub-exponential classical attack.",
    relatedModules: ["elliptic-curve-cryptography"],
  },
  {
    term: "ECDH (Elliptic Curve Diffie-Hellman)",
    definition:
      "Diffie-Hellman key exchange performed using elliptic curve point multiplication instead of modular exponentiation — the key-exchange method behind TLS 1.3, SSH, and Signal's X3DH.",
    relatedModules: ["elliptic-curve-cryptography", "diffie-hellman-key-exchange"],
  },
  {
    term: "ECDSA (Elliptic Curve Digital Signature Algorithm)",
    definition:
      "The elliptic-curve digital signature scheme used in TLS certificates, SSH, and Bitcoin/Ethereum transactions. Catastrophically breaks if the same per-signature random nonce is ever reused.",
    relatedModules: ["elliptic-curve-cryptography"],
  },
  {
    term: "Entropy",
    definition:
      "A measure of genuine unpredictability. CSPRNGs are seeded from physical entropy sources (hardware interrupt timing, dedicated RNG chips) rather than anything an attacker could predict or replay.",
    relatedModules: ["random-number-generation"],
  },
  {
    term: "Ephemeral key",
    definition:
      "A key pair generated fresh for a single session or exchange and discarded afterward — the mechanism behind forward secrecy in ECDHE key exchange.",
    relatedModules: ["diffie-hellman-key-exchange", "tls-in-practice"],
  },
  {
    term: "Forward secrecy",
    definition:
      "The property that compromising a long-term private key later doesn't expose past session keys, achieved by using fresh ephemeral keys for each session's key exchange instead of reusing a static one.",
    relatedModules: ["diffie-hellman-key-exchange", "tls-in-practice"],
  },
  {
    term: "GCM (Galois/Counter Mode)",
    definition:
      "The dominant AEAD mode for AES, combining CTR-mode encryption with GHASH-based authentication in a single pass, producing both ciphertext and an authentication tag.",
    relatedModules: ["symmetric-key-aes"],
  },
  {
    term: "Grover's algorithm",
    definition:
      "A quantum algorithm giving a quadratic speedup for unstructured search, which roughly halves the effective security level of symmetric ciphers and hash functions — countered simply by doubling key/output sizes, unlike Shor's algorithm's total break of public-key crypto.",
    relatedModules: ["quantum-threat-shor"],
  },
  {
    term: "Harvest now, decrypt later",
    definition:
      "A passive attack strategy: an adversary records RSA/ECDH-protected traffic today and stores it, waiting for a future quantum computer to decrypt the key exchange — meaning long-lived confidential data is at risk today, not just after quantum computers arrive.",
    relatedModules: ["harvest-now-decrypt-later"],
  },
  {
    term: "Hash-based signatures",
    definition:
      "A family of digital signature schemes whose security rests only on hash function properties rather than factoring or discrete logs — making them quantum-resistant. SLH-DSA (SPHINCS+) is NIST's standardized hash-based PQC signature scheme.",
  },
  {
    term: "HKDF (HMAC-based Key Derivation Function)",
    definition:
      "A fast key derivation function used to derive multiple cryptographic keys from a single high-entropy shared secret (e.g. inside TLS or Signal handshakes) — distinct from password-hashing KDFs, which are deliberately slow.",
    relatedModules: ["key-derivation-functions"],
  },
  {
    term: "HMAC (Hash-based Message Authentication Code)",
    definition:
      "A keyed hash construction proving a message wasn't tampered with, verifiable by anyone holding the shared key. Its nested double-hash design specifically defeats length-extension attacks that a naive H(key‖message) would be vulnerable to.",
    relatedModules: ["hash-functions-and-signatures"],
  },
  {
    term: "HSM (Hardware Security Module)",
    definition:
      "A dedicated, tamper-resistant hardware device that generates and stores private keys and performs cryptographic operations without ever exposing the key material to the host system.",
  },
  {
    term: "IV (Initialization Vector)",
    definition:
      "A value used to randomize the output of a cipher mode so that encrypting the same plaintext twice with the same key doesn't produce the same ciphertext. In AES-GCM this is usually called a nonce; it must never repeat for a given key.",
    relatedModules: ["symmetric-key-aes"],
  },
  {
    term: "JWT (JSON Web Token)",
    definition:
      "A compact, signed token format — header, payload, and signature, each base64url-encoded and dot-separated — commonly used for API authentication. The payload is encoded, not encrypted, so it's readable by anyone who has the token.",
    relatedModules: ["jwt-and-api-auth"],
  },
  {
    term: "KDF (Key Derivation Function)",
    definition:
      "An umbrella term for functions that derive one or more cryptographic keys from input material — covering both fast KDFs like HKDF (stretching high-entropy secrets) and slow, deliberately expensive password-hashing KDFs like PBKDF2 and Argon2.",
    relatedModules: ["key-derivation-functions"],
  },
  {
    term: "Length-extension attack",
    definition:
      "An attack exploiting the Merkle-Damgård construction: given only H(message) and its length, an attacker can compute H(message ‖ extra) for attacker-chosen data, without ever knowing the original message.",
    relatedModules: ["hash-functions-and-signatures"],
  },
  {
    term: "MAC (Message Authentication Code)",
    definition:
      "A short value proving both the integrity and authenticity of a message to anyone holding a shared secret key. HMAC is the most common hash-based MAC construction.",
    relatedModules: ["hash-functions-and-signatures"],
  },
  {
    term: "ML-DSA",
    definition:
      "NIST's standardized post-quantum digital signature algorithm (based on the Dilithium scheme, standardized as FIPS 204), replacing RSA and ECDSA signatures against quantum attack.",
  },
  {
    term: "ML-KEM",
    definition:
      "NIST's standardized post-quantum key encapsulation mechanism (based on the Kyber scheme, standardized as FIPS 203), replacing RSA and Diffie-Hellman key exchange against quantum attack — often deployed in hybrid with classical ECDH during migration.",
  },
  {
    term: "Modular arithmetic",
    definition:
      "Arithmetic that \"wraps around\" after reaching a fixed modulus, like a clock face — the mathematical foundation underlying RSA, Diffie-Hellman, and the discrete logarithm problem.",
    relatedModules: ["math-foundations-modular-arithmetic"],
  },
  {
    term: "MD5 / SHA-1",
    definition:
      "Older, now-broken hash functions. Both have had practical collisions publicly demonstrated and should never be used for security purposes today — only for non-adversarial checksums.",
    relatedModules: ["hash-functions-and-signatures"],
  },
  {
    term: "mTLS (Mutual TLS)",
    definition:
      "A TLS variant where both the client and the server present certificates, each verified by the other — common for service-to-service authentication and zero-trust network architectures.",
    relatedModules: ["digital-certificates-x509", "tls-in-practice"],
  },
  {
    term: "Nonce",
    definition:
      "A value used only once — most critically, the per-encryption value in AES-GCM (which must never repeat under the same key) and the per-signature random value in ECDSA (which, if reused, directly exposes the private key).",
    relatedModules: ["symmetric-key-aes", "elliptic-curve-cryptography"],
  },
  {
    term: "OAEP (Optimal Asymmetric Encryption Padding)",
    definition:
      "The modern, randomized padding scheme for RSA encryption, using a double-masking (MGF1-based) construction to defeat the padding-oracle attacks that plagued the older PKCS#1 v1.5 padding.",
    relatedModules: ["rsa-padding-oaep-pkcs1"],
  },
  {
    term: "OCSP (Online Certificate Status Protocol)",
    definition:
      "A protocol letting a client ask a CA in real time whether a specific certificate is still valid, as an alternative to downloading a full CRL. OCSP stapling moves this query to the server to avoid a per-client round trip and metadata leak.",
    relatedModules: ["digital-certificates-x509"],
  },
  {
    term: "One-way function",
    definition:
      "A function that's easy to compute in one direction but computationally infeasible to reverse — the conceptual foundation of hash functions, and (in trapdoor form) of public-key cryptography.",
    relatedModules: ["math-foundations-modular-arithmetic"],
  },
  {
    term: "PBKDF2",
    definition:
      "A key derivation function that deliberately slows password hashing by applying HMAC repeatedly, a tunable number of times — simple and standard, but more cheaply parallelizable on GPUs than memory-hard alternatives like Argon2.",
    relatedModules: ["key-derivation-functions"],
  },
  {
    term: "Perfect Forward Secrecy (PFS)",
    definition:
      "A stronger phrasing of forward secrecy, emphasizing that every session's key exchange uses fresh ephemeral keys, so no single key compromise — past or future — exposes more than one session.",
    relatedModules: ["diffie-hellman-key-exchange"],
  },
  {
    term: "PKCS#1 v1.5",
    definition:
      "The original, deterministic RSA padding scheme, vulnerable to the Bleichenbacher padding-oracle attack against encryption. Superseded by OAEP for encryption (PSS is the modern equivalent for signatures).",
    relatedModules: ["rsa-padding-oaep-pkcs1"],
  },
  {
    term: "Post-compromise security",
    definition:
      "The property that a session can recover security even after an attacker briefly compromises its state, because ongoing fresh Diffie-Hellman exchanges (as in the Signal Protocol's Double Ratchet) eventually heal it.",
    relatedModules: ["secure-messaging-signal-protocol"],
  },
  {
    term: "PQC (Post-Quantum Cryptography)",
    definition:
      "Cryptographic algorithms believed to resist attack by both classical and quantum computers, standardized by NIST to replace RSA, Diffie-Hellman, and ECC once Shor's algorithm becomes practical against them.",
    relatedModules: ["quantum-threat-shor"],
  },
  {
    term: "Preimage resistance",
    definition:
      "The property that, given only a hash digest, it should be computationally infeasible to find any input that produces it — costing roughly 2^n operations for an n-bit hash.",
    relatedModules: ["hash-functions-and-signatures"],
  },
  {
    term: "Private key",
    definition:
      "The half of an asymmetric key pair kept secret by its owner, used to decrypt messages encrypted to the matching public key, or to produce digital signatures.",
  },
  {
    term: "Public key",
    definition:
      "The half of an asymmetric key pair that can be freely shared, used to encrypt messages to its owner or verify their digital signatures.",
  },
  {
    term: "Qubit",
    definition:
      "The basic unit of quantum information, capable of existing in a superposition of states. Breaking RSA-2048 with Shor's algorithm is estimated to require several thousand error-corrected (logical) qubits — far beyond today's hardware.",
    relatedModules: ["quantum-threat-shor"],
  },
  {
    term: "Salt",
    definition:
      "A unique random value appended to a password before hashing, ensuring identical passwords don't produce identical hashes — defeats precomputed rainbow-table attacks, but does nothing to slow down an attacker targeting one specific hash (that's the KDF's job).",
    relatedModules: ["key-derivation-functions"],
  },
  {
    term: "Session key",
    definition:
      "A symmetric key derived for the duration of a single communication session (e.g. via TLS or SSH's Diffie-Hellman handshake), used for fast bulk encryption instead of slower public-key operations.",
  },
  {
    term: "Shor's algorithm",
    definition:
      "A quantum algorithm, published in 1994, that solves integer factorization and discrete logarithms in polynomial time — the specific mathematical result that makes RSA, classical Diffie-Hellman, and ECC breakable on a sufficiently large, low-error quantum computer.",
    relatedModules: ["quantum-threat-shor"],
  },
  {
    term: "Side-channel attack",
    definition:
      "An attack that recovers secret data not by breaking an algorithm's mathematics, but by observing something about its physical execution — timing, power draw, cache access patterns, or electromagnetic emissions.",
    relatedModules: ["side-channel-and-timing-attacks"],
  },
  {
    term: "Signal Protocol",
    definition:
      "The end-to-end encryption protocol combining X3DH (initial key agreement) and the Double Ratchet (per-message key derivation), used by Signal, WhatsApp, and others to keep even the server operator from reading messages.",
    relatedModules: ["secure-messaging-signal-protocol"],
  },
  {
    term: "SHA-2 / SHA-256",
    definition:
      "The current widely deployed hash function standard, using the Merkle-Damgård construction and producing a 256-bit digest (for SHA-256) — used throughout TLS, code signing, and blockchain.",
    relatedModules: ["hash-functions-and-signatures"],
  },
  {
    term: "SHA-3",
    definition:
      "A structurally different hash standard (sponge construction rather than Merkle-Damgård), standardized in 2015 as a hedge against future cryptanalysis of SHA-2 — naturally immune to length-extension attacks.",
    relatedModules: ["hash-functions-and-signatures"],
  },
  {
    term: "SLH-DSA",
    definition:
      "NIST's standardized hash-based post-quantum digital signature algorithm (based on SPHINCS+, standardized as FIPS 205) — its security rests only on hash function properties, offering a structurally different, conservative alternative to ML-DSA.",
  },
  {
    term: "Symmetric encryption",
    definition:
      "Encryption where the same key is used to both encrypt and decrypt, requiring the key to be shared secretly in advance. AES is the standard symmetric cipher; it's typically combined with asymmetric key exchange (as in TLS) to establish that shared key.",
    relatedModules: ["symmetric-key-aes"],
  },
  {
    term: "Timing attack",
    definition:
      "A side-channel attack that recovers secret data by measuring how long an operation takes, exploiting code whose execution time depends on secret values — mitigated by constant-time implementations.",
    relatedModules: ["side-channel-and-timing-attacks"],
  },
  {
    term: "TLS (Transport Layer Security)",
    definition:
      "The protocol behind HTTPS, combining a key exchange (ECDHE), certificate-based authentication, and symmetric encryption (typically AES-GCM) to protect data between a client and a server.",
    relatedModules: ["tls-in-practice"],
  },
  {
    term: "Trapdoor function",
    definition:
      "A one-way function that becomes easy to reverse if you possess a specific secret (the \"trapdoor\") — the structural idea behind RSA, where factoring the public modulus is the trapdoor known only to the private key holder.",
    relatedModules: ["math-foundations-modular-arithmetic", "rsa-public-key"],
  },
  {
    term: "X.509",
    definition:
      "The standard format for public-key certificates, defining fields like subject, issuer, public key, validity period, and signature — the format underlying HTTPS certificates.",
    relatedModules: ["digital-certificates-x509"],
  },
  {
    term: "X3DH (Extended Triple Diffie-Hellman)",
    definition:
      "The Signal Protocol's initial key agreement, letting a sender compute a shared secret and send a first encrypted message even while the recipient is offline, by combining several Diffie-Hellman exchanges against a pre-published key bundle.",
    relatedModules: ["secure-messaging-signal-protocol"],
  },
  {
    term: "Zero-knowledge proof",
    definition:
      "A proof that lets one party convince another that a statement is true without revealing any information beyond the statement's truth itself — not covered in depth in this catalog, but a growing area adjacent to it.",
  },
];
