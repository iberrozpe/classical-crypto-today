export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ModuleQuiz {
  moduleSlug: string;
  questions: QuizQuestion[];
}

export const quizzes: ModuleQuiz[] = [
  {
    moduleSlug: "history-and-purpose-of-cryptography",
    questions: [
      {
        question: "Which of the four core properties can a MAC (message authentication code) NOT provide, even though it authenticates a message?",
        options: ["Integrity", "Authenticity", "Non-repudiation", "Confidentiality (of the MAC tag itself)"],
        correctIndex: 2,
        explanation: "A MAC proves a message came from someone holding the shared key — but since the verifier holds that same key, they could have forged it too. Only a digital signature (asymmetric) prevents the sender from later denying they sent it.",
      },
      {
        question: "Who documented the first systematic method for breaking substitution ciphers, around 850 CE?",
        options: ["Julius Caesar", "Blaise de Vigenère", "Al-Kindi", "Claude Shannon"],
        correctIndex: 2,
        explanation: "Al-Kindi's frequency analysis exploited the fact that letters occur at predictable frequencies in a language, unraveling simple substitution ciphers statistically.",
      },
      {
        question: "What specific property did Shannon prove the one-time pad achieves, that AES, RSA, and ECC do not?",
        options: ["Forward secrecy", "Collision resistance", "Non-repudiation", "Perfect secrecy"],
        correctIndex: 3,
        explanation: "A correctly used one-time pad reveals mathematically zero information about the plaintext, regardless of an attacker's computing power. AES, RSA, and ECC are only computationally secure — breakable in principle given enough computing power.",
      },
    ],
  },
  {
    moduleSlug: "math-foundations-modular-arithmetic",
    questions: [
      {
        question: "When does a's modular inverse mod n exist?",
        options: ["Only when n is prime", "Only when gcd(a, n) = 1", "Always, for any a and n", "Only when a is even"],
        correctIndex: 1,
        explanation: "a's modular inverse exists exactly when a and n share no common factors — gcd(a, n) = 1. When it exists, the extended Euclidean algorithm finds it efficiently.",
      },
      {
        question: "What is a trapdoor function?",
        options: [
          "A function with no known algorithm to compute it",
          "A hash function that always produces the same output",
          "A one-way function that becomes easy to reverse if you know a specific secret",
          "A function that is equally easy to compute in both directions",
        ],
        correctIndex: 2,
        explanation: "RSA's trapdoor is knowledge of the two prime factors of the modulus — with them, decryption is fast; without them, an attacker faces the full difficulty of factoring.",
      },
      {
        question: "What do Diffie-Hellman's modular exponentiation and ECC's point addition have in common, mathematically?",
        options: [
          "Nothing — they're unrelated hard problems",
          "They both require a trusted third party",
          "They're the same abstract group operation, performed in two different groups",
          "They both rest on integer factorization",
        ],
        correctIndex: 2,
        explanation: "Strip away the specific numbers, and both are the same group-theoretic operation — repeated combination of an element with itself — just performed in different underlying groups.",
      },
    ],
  },
  {
    moduleSlug: "symmetric-key-aes",
    questions: [
      {
        question: "How many rounds does AES-256 use?",
        options: ["10", "12", "14", "16"],
        correctIndex: 2,
        explanation: "AES-128 uses 10 rounds, AES-192 uses 12, and AES-256 uses 14 — more rounds for larger keys.",
      },
      {
        question: "What is the AES \"state\"?",
        options: [
          "The cipher's current round number",
          "The 16 input bytes of a block arranged into a 4×4 grid",
          "The key schedule's internal counter",
          "The IV used for the current block",
        ],
        correctIndex: 1,
        explanation: "AES arranges its 128-bit block into a 4×4 grid of bytes, filled one column at a time — every round transformation operates on this grid shape.",
      },
      {
        question: "Which AES mode provides both confidentiality and integrity in a single pass?",
        options: ["ECB", "CBC alone", "CTR alone", "GCM"],
        correctIndex: 3,
        explanation: "GCM (Galois/Counter Mode) is an AEAD mode — it combines CTR-mode encryption with GHASH-based authentication, producing both ciphertext and an authentication tag.",
      },
    ],
  },
  {
    moduleSlug: "stream-ciphers-chacha20",
    questions: [
      {
        question: "What operation does a stream cipher like ChaCha20 use to combine its keystream with the plaintext?",
        options: ["Matrix multiplication", "Modular exponentiation", "XOR", "AES substitution"],
        correctIndex: 2,
        explanation: "The keystream is XORed with the plaintext one bit or byte at a time — which is also why encryption and decryption are the identical operation.",
      },
      {
        question: "Why doesn't ChaCha20 rely on table lookups the way some AES software implementations do?",
        options: [
          "It doesn't support 256-bit keys",
          "Tables would make decryption a different operation than encryption",
          "To avoid a class of cache-timing side-channel attacks",
          "Table lookups are incompatible with the AEAD construction",
        ],
        correctIndex: 2,
        explanation: "ChaCha20 builds its keystream purely from addition, rotation, and XOR (ARX) — sidestepping the cache-timing side channel that has affected some table-based AES software.",
      },
      {
        question: "Paired with Poly1305, ChaCha20 becomes an AEAD construction functionally equivalent to which AES mode?",
        options: ["CBC", "ECB", "GCM", "CTR alone"],
        correctIndex: 2,
        explanation: "ChaCha20-Poly1305 encrypts and authenticates in one pass, serving the same purpose as AES-GCM.",
      },
    ],
  },
  {
    moduleSlug: "rsa-public-key",
    questions: [
      {
        question: "Why is the public exponent e = 65537 used in almost every RSA key?",
        options: [
          "It's required by the RSA patent",
          "It equals the modulus size in bits",
          "It's the largest prime under 100,000",
          "Its binary form has only two set bits, keeping exponentiation fast while avoiding low-exponent attacks",
        ],
        correctIndex: 3,
        explanation: "65537 = 2^16 + 1 has only two set bits, so square-and-multiply exponentiation is fast — while still being large enough to close off the simplest low-exponent attacks.",
      },
      {
        question: "What is RSA typically used for in practice, rather than encrypting bulk data directly?",
        options: [
          "Password hashing",
          "Random number generation",
          "Real-time video encryption",
          "Encrypting a short symmetric key, or producing digital signatures",
        ],
        correctIndex: 3,
        explanation: "RSA is slow and size-limited, so it's typically used for key transport (encrypting a short AES key) or signatures, with AES handling the bulk data.",
      },
      {
        question: "What mistake makes RSA's common modulus attack possible?",
        options: [
          "The primes p and q are too large",
          "Two users are issued the same modulus n with different exponents e",
          "The message is padded with OAEP",
          "The private key is too short",
        ],
        correctIndex: 1,
        explanation: "If two users share the same n with different e values, an attacker who intercepts the same message encrypted to both can recover it algebraically, without factoring n.",
      },
    ],
  },
  {
    moduleSlug: "rsa-padding-oaep-pkcs1",
    questions: [
      {
        question: "What made Bleichenbacher's 1998 attack against PKCS#1 v1.5 possible?",
        options: [
          "A collision in SHA-1",
          "A brute-force attack on the private key",
          "A server leaking whether decrypted padding was valid or invalid",
          "A weak random number generator",
        ],
        correctIndex: 2,
        explanation: "That single valid/invalid signal, repeated against many modified ciphertexts, is enough to mathematically decrypt the original ciphertext — a padding oracle attack.",
      },
      {
        question: "What replaced PKCS#1 v1.5 padding as the modern standard for RSA encryption?",
        options: ["AES-GCM", "HMAC", "OAEP", "ECDSA"],
        correctIndex: 2,
        explanation: "OAEP (Optimal Asymmetric Encryption Padding) uses randomized, hash-based double masking (MGF1) and is provably secure against chosen-ciphertext attacks.",
      },
      {
        question: "Why is \"textbook RSA\" (the raw formula, no padding) insecure?",
        options: [
          "It requires a trusted third party",
          "It's deterministic and malleable, among other issues",
          "It can't be implemented in software",
          "It uses too large a key",
        ],
        correctIndex: 1,
        explanation: "Without padding, identical plaintexts always produce identical ciphertexts (deterministic), and ciphertexts can be manipulated in predictable ways (malleable).",
      },
    ],
  },
  {
    moduleSlug: "elliptic-curve-cryptography",
    questions: [
      {
        question: "What is the elliptic curve discrete logarithm problem (ECDLP)?",
        options: [
          "Factoring the curve's prime modulus",
          "Finding two points that collide",
          "Given G and Q = kG, recovering k",
          "Computing the curve's tangent slope at any point",
        ],
        correctIndex: 2,
        explanation: "Computing Q = kG is easy; recovering the scalar k from Q and G alone is computationally infeasible — that asymmetry is ECC's hard problem.",
      },
      {
        question: "What causes ECDSA to catastrophically leak the private key?",
        options: [
          "Signing more than one message",
          "Choosing a NIST-standardized curve",
          "Using too large a key size",
          "Reusing (or weakly generating) the per-signature random nonce",
        ],
        correctIndex: 3,
        explanation: "The signing equation involves the nonce k algebraically alongside the private key d — if k is ever exposed or reused, an attacker can solve directly for d. This caused the real-world 2010 PS3 signing-key leak.",
      },
      {
        question: "Roughly what RSA key size gives equivalent classical security to a 256-bit ECC key?",
        options: ["1024 bits", "512 bits", "3072 bits", "8192 bits"],
        correctIndex: 2,
        explanation: "A 256-bit ECC key is considered roughly as strong as a 3072-bit RSA key — ECC reaches the same security with dramatically smaller keys.",
      },
    ],
  },
  {
    moduleSlug: "diffie-hellman-key-exchange",
    questions: [
      {
        question: "What does plain (unauthenticated) Diffie-Hellman fail to protect against?",
        options: ["A passive eavesdropper", "Brute-force key guessing", "A man-in-the-middle attack", "Replay of old messages"],
        correctIndex: 2,
        explanation: "DH guarantees secrecy from passive eavesdropping but says nothing about identity — an active attacker can run two separate exchanges and relay traffic invisibly, unless the exchange is authenticated (e.g. by a certificate).",
      },
      {
        question: "What property does ephemeral Diffie-Hellman (DHE/ECDHE) provide that static DH doesn't?",
        options: ["Larger key sizes", "Non-repudiation", "Integrity", "Forward secrecy"],
        correctIndex: 3,
        explanation: "A fresh key pair per session means a compromised long-term key can't be used to decrypt previously recorded sessions — mandatory in TLS 1.3.",
      },
      {
        question: "What's the risk of choosing Diffie-Hellman parameters (p, g) carelessly?",
        options: [
          "The exchange becomes symmetric-only",
          "AES can no longer be used afterward",
          "Small-subgroup attacks can drastically shrink the effective search space",
          "The shared secret is transmitted in plaintext",
        ],
        correctIndex: 2,
        explanation: "A poorly chosen p can allow small subgroups an attacker can force the exchange into, shrinking the discrete-log search space — real implementations use \"safe primes\" to avoid this.",
      },
    ],
  },
  {
    moduleSlug: "hash-functions-and-signatures",
    questions: [
      {
        question: "What causes a length-extension attack against SHA-2?",
        options: [
          "A collision in the hash's output",
          "Reusing an IV",
          "A weak salt",
          "The Merkle-Damgård digest is literally just the final chaining value",
        ],
        correctIndex: 3,
        explanation: "Given only H(message) and its length, an attacker can compute H(message ‖ extra) because the digest carries no more information than that final chaining value.",
      },
      {
        question: "Why does HMAC resist length-extension attacks that naive H(key‖message) doesn't?",
        options: [
          "It never processes the key at all",
          "It hashes the message twice with two different algorithms",
          "It uses a longer key than usual",
          "Its nested double-hash construction closes the gap length extension exploits",
        ],
        correctIndex: 3,
        explanation: "HMAC's H((K'⊕opad) ‖ H((K'⊕ipad) ‖ m)) structure was specifically designed to close the length-extension gap that a naive concatenate-and-hash approach leaves open.",
      },
      {
        question: "Why is SHA-256 described as offering ~128-bit, not 256-bit, collision resistance?",
        options: [
          "128 bits is the maximum key size SHA-256 supports",
          "Half of SHA-256's compression rounds are considered weak",
          "The birthday bound means a collision is found in roughly 2^(n/2) attempts, not 2^n",
          "SHA-256 only uses half of its output bits for security",
        ],
        correctIndex: 2,
        explanation: "Thanks to the birthday paradox, finding any two colliding inputs costs roughly 2^(n/2) attempts for an n-bit hash — far cheaper than the 2^n needed for a preimage attack.",
      },
    ],
  },
  {
    moduleSlug: "key-derivation-functions",
    questions: [
      {
        question: "Why is SHA-256 alone a poor choice for hashing passwords?",
        options: [
          "It requires a private key",
          "It can't process variable-length input",
          "It's designed to be fast, making brute-force attacks cheap",
          "It doesn't produce a fixed-size output",
        ],
        correctIndex: 2,
        explanation: "Modern GPUs/ASICs compute billions of SHA-256 hashes per second — great for integrity checks, a serious liability for password storage unless deliberately slowed down.",
      },
      {
        question: "What does salting a password specifically defend against?",
        options: [
          "Man-in-the-middle attacks",
          "Side-channel timing attacks",
          "Brute-force attacks against one specific hash",
          "Precomputed rainbow-table attacks",
        ],
        correctIndex: 3,
        explanation: "Salting ensures identical passwords don't produce identical hashes, defeating precomputed tables — but it does nothing to slow down an attacker targeting one specific hash. That's the KDF's job.",
      },
      {
        question: "What makes Argon2 and scrypt more resistant to GPU/ASIC cracking than PBKDF2?",
        options: [
          "They don't require a salt",
          "They produce a longer output",
          "They are symmetric ciphers, not hash functions",
          "They are memory-hard, not just iteration-based",
        ],
        correctIndex: 3,
        explanation: "Memory-hard KDFs require large amounts of memory as well as computation, which is significantly more expensive to parallelize on specialized hardware than pure iteration counts.",
      },
    ],
  },
  {
    moduleSlug: "digital-certificates-x509",
    questions: [
      {
        question: "What's the purpose of a root CA certificate in the chain of trust?",
        options: [
          "It's only used for revocation checks",
          "It's signed by an intermediate CA",
          "It's issued fresh for every website",
          "It's a self-signed trust anchor pre-installed in operating systems and browsers",
        ],
        correctIndex: 3,
        explanation: "Root CA certificates are trusted only because they're pre-installed — every other certificate is trusted because it traces back, signature by signature, to one of them.",
      },
      {
        question: "What does OCSP stapling eliminate, compared to plain OCSP?",
        options: [
          "The need for a certificate at all",
          "The need for a digital signature",
          "The client's live round trip to the CA, and the metadata leak that comes with it",
          "The certificate's validity period",
        ],
        correctIndex: 2,
        explanation: "The server itself periodically fetches and caches a signed OCSP response, stapling it to the handshake — so clients never contact the CA directly.",
      },
      {
        question: "What does Certificate Transparency (CT) defend against?",
        options: [
          "A man-in-the-middle attack on DNS",
          "A server using an expired certificate",
          "A trusted CA fraudulently issuing a valid certificate for a domain it doesn't control",
          "A weak private key",
        ],
        correctIndex: 2,
        explanation: "CT requires newly issued certificates to be logged publicly, so domain owners can detect fraudulent certificates — exactly what happened in the 2011 DigiNotar breach.",
      },
    ],
  },
  {
    moduleSlug: "jwt-and-api-auth",
    questions: [
      {
        question: "What does a JWT's signature actually protect?",
        options: [
          "That the token can never be replayed",
          "That the header and payload haven't been altered since signing",
          "That the payload is encrypted and unreadable",
          "That the token is automatically revoked on logout",
        ],
        correctIndex: 1,
        explanation: "The payload is only base64url-encoded, not encrypted — anyone can read it. The signature proves integrity and authenticity, not confidentiality or revocation.",
      },
      {
        question: "What makes the \"algorithm confusion\" attack against JWTs possible?",
        options: [
          "An expired token being accepted",
          "A missing \"iat\" claim",
          "A weak HMAC secret",
          "A verifier trusting the algorithm named in the token's own header instead of pinning it itself",
        ],
        correctIndex: 3,
        explanation: "If a verifier blindly follows the header's claimed \"alg\": \"HS256\", an attacker can sign a forged token using the server's own (public) RSA key as the HMAC secret.",
      },
      {
        question: "Compared to an opaque session token, what's a key limitation of JWTs?",
        options: [
          "They require a database lookup on every request",
          "They can't be revoked before expiry without extra infrastructure",
          "They can't be verified by more than one service",
          "They are always encrypted, adding latency",
        ],
        correctIndex: 1,
        explanation: "JWTs are self-contained and stateless — which means revoking one before its expiry needs extra infrastructure (a blocklist, short lifetimes), unlike an opaque token backed by a server-side record.",
      },
    ],
  },
  {
    moduleSlug: "ssh-protocol",
    questions: [
      {
        question: "What key-exchange method do modern SSH implementations typically use?",
        options: [
          "A static pre-shared key",
          "RSA encryption of a session key",
          "ECDH, often over Curve25519",
          "Plain unauthenticated Diffie-Hellman only",
        ],
        correctIndex: 2,
        explanation: "curve25519-sha256 (ECDH over Curve25519) is the typical key exchange in modern SSH, establishing a shared session key before host verification.",
      },
      {
        question: "What does SSH's default \"trust-on-first-use\" host key model mean?",
        options: [
          "A CA must sign every host key before it's trusted",
          "Host keys expire after 90 days by default",
          "The server's host key fingerprint is recorded on first connection and checked against on every future one",
          "The client re-verifies the host key from scratch every session",
        ],
        correctIndex: 2,
        explanation: "Unlike TLS's CA-based PKI, SSH by default just remembers the fingerprint from the first connection — which is what the \"can't be established\" warning is asking you to manually verify.",
      },
      {
        question: "What key type do modern SSH deployments increasingly default to for user authentication, and why?",
        options: [
          "A shared password — simplest to configure",
          "DSA — required by the SSH standard",
          "RSA-4096 — maximum compatibility",
          "Ed25519 — smaller keys and simpler, more misuse-resistant implementation",
        ],
        correctIndex: 3,
        explanation: "Ed25519 is a fast, specific elliptic-curve signature scheme favored over RSA for smaller key size and an implementation less prone to subtle mistakes.",
      },
    ],
  },
  {
    moduleSlug: "tls-in-practice",
    questions: [
      {
        question: "How many round trips does a typical TLS 1.3 handshake take before application data flows?",
        options: ["Zero", "One", "Two", "Three"],
        correctIndex: 1,
        explanation: "TLS 1.3, standardized in 2018, typically completes its handshake in a single round trip — client hello, server hello plus certificate, then encrypted application data.",
      },
      {
        question: "What key exchange does the TLS 1.3 handshake use?",
        options: [
          "Static RSA key transport",
          "A pre-shared symmetric key only",
          "Plain unauthenticated Diffie-Hellman",
          "Ephemeral ECDHE",
        ],
        correctIndex: 3,
        explanation: "Both sides exchange ephemeral ECDHE key shares and independently derive the same shared secret, authenticated by the server's certificate signature.",
      },
      {
        question: "Why is TLS described as a \"stack\" of several algorithms rather than one?",
        options: [
          "It re-encrypts data four times for redundancy",
          "It requires four separate TCP connections",
          "It combines DH/ECDH key exchange, RSA/ECDSA signatures, SHA-2 hashing, and AES/ChaCha20 encryption",
          "It only uses AES, but in four different modes",
        ],
        correctIndex: 2,
        explanation: "A single TLS connection demonstrates nearly every module in this catalog working together — which is exactly why PQC migration for TLS means replacing several algorithms, not just one.",
      },
    ],
  },
  {
    moduleSlug: "secure-messaging-signal-protocol",
    questions: [
      {
        question: "What problem does X3DH solve that plain Diffie-Hellman can't?",
        options: [
          "Encrypting metadata as well as message content",
          "Letting a sender compute a shared secret and send a first message even while the recipient is offline",
          "Providing forward secrecy for every individual message",
          "Avoiding the need for any key exchange at all",
        ],
        correctIndex: 1,
        explanation: "By having Bob publish pre-generated key material in advance, Alice can complete every DH computation herself and send a first message before Bob ever comes online.",
      },
      {
        question: "What two mechanisms combine to make up the Double Ratchet algorithm?",
        options: [
          "RSA and AES-GCM",
          "HMAC and PBKDF2",
          "X3DH and TLS",
          "A symmetric-key ratchet and a Diffie-Hellman ratchet",
        ],
        correctIndex: 3,
        explanation: "The symmetric ratchet derives each message key from the last via a one-way chain; the DH ratchet periodically injects fresh key material — together giving forward secrecy and post-compromise security.",
      },
      {
        question: "What is post-compromise security?",
        options: [
          "A guarantee that keys can never be compromised",
          "Encrypting data before a breach occurs",
          "A session recovering security after a brief compromise, thanks to ongoing fresh DH exchanges",
          "A property only TLS provides, not Signal",
        ],
        correctIndex: 2,
        explanation: "Even if an attacker briefly compromises a device's state, the Double Ratchet's ongoing DH exchanges eventually heal the session back to a secure state.",
      },
    ],
  },
  {
    moduleSlug: "key-sizes-and-security-levels",
    questions: [
      {
        question: "Why does RSA need a much larger key than ECC to reach the same security level?",
        options: [
          "RSA is a newer algorithm than ECC",
          "ECC uses AES internally, RSA doesn't",
          "RSA's factoring problem has a sub-exponential classical algorithm; ECC's discrete log problem doesn't",
          "RSA keys are stored in a less efficient format",
        ],
        correctIndex: 2,
        explanation: "Because a faster-than-brute-force classical attack (GNFS) exists for factoring but not for ECDLP, RSA needs a much bigger key to reach the same effective security level.",
      },
      {
        question: "Roughly what ECC key size reaches the same ~128-bit security level as 3072-bit RSA?",
        options: ["128 bits", "512 bits", "1024 bits", "256 bits"],
        correctIndex: 3,
        explanation: "256-bit ECC ≈ 3072-bit RSA ≈ AES-128, per NIST SP 800-57's rough equivalence table.",
      },
      {
        question: "Why does AES's key size equal its security level, while RSA's key size doesn't equal its security level?",
        options: [
          "AES has no known attacks at all",
          "RSA's key size is measured in bytes, not bits",
          "AES is broken only by brute force with no faster classical shortcut; RSA is broken by factoring, which has one",
          "AES uses an entirely different security model"
        ],
        correctIndex: 2,
        explanation: "A 128-bit AES key gives ~128-bit security directly, since brute force is the best known attack. RSA needs a much larger key because factoring is faster than brute force.",
      },
    ],
  },
  {
    moduleSlug: "random-number-generation",
    questions: [
      {
        question: "What must be true of a CSPRNG's output that isn't required of an ordinary statistical PRNG?",
        options: [
          "It must use a longer seed",
          "It must run faster than a statistical PRNG",
          "It must pass more randomness test suites",
          "It must be unpredictable even to an attacker who observes part of the output",
        ],
        correctIndex: 3,
        explanation: "An ordinary PRNG (like the Mersenne Twister) can be statistically excellent yet trivially predictable once enough output is seen — unsafe for keys, nonces, or IVs.",
      },
      {
        question: "What caused the 2008 Debian OpenSSL vulnerability?",
        options: [
          "An expired root certificate",
          "A misconfigured firewall",
          "A hash collision discovered in SHA-1",
          "A patch that accidentally removed nearly all entropy sources from key generation",
        ],
        correctIndex: 3,
        explanation: "The patch reduced key generation to a pool of only about 32,768 possibilities for over a year — every key generated on an affected system was practically guessable.",
      },
      {
        question: "What was the actual flaw behind the 2010 Sony PlayStation 3 ECDSA key leak?",
        options: [
          "The certificate had expired",
          "A weak password was used",
          "The private key was stored in plaintext",
          "The same nonce was reused for every signature",
        ],
        correctIndex: 3,
        explanation: "Reusing the same 'random' per-signature nonce across multiple ECDSA signatures directly exposes the signing private key through simple algebra.",
      },
    ],
  },
  {
    moduleSlug: "side-channel-and-timing-attacks",
    questions: [
      {
        question: "What does a side-channel attack exploit that mathematical cryptanalysis doesn't?",
        options: [
          "A protocol downgrade",
          "A weak key size",
          "Something about an algorithm's physical execution — timing, power draw, cache access",
          "A flaw in the algorithm's underlying mathematics",
        ],
        correctIndex: 2,
        explanation: "None of these leaks require breaking AES or RSA mathematically — they exploit the physical reality of how an implementation runs.",
      },
      {
        question: "What made the 2013 Lucky Thirteen attack against TLS possible?",
        options: [
          "An expired certificate",
          "A weak RSA modulus",
          "A collision in AES-GCM's authentication tag",
          "A measurable timing difference between valid and invalid CBC padding checks",
        ],
        correctIndex: 3,
        explanation: "An attacker who could send many requests and measure response timing could gradually recover plaintext — a timing-based padding-oracle pattern.",
      },
      {
        question: "What is the general defense against timing and cache side-channel attacks?",
        options: [
          "Disabling TLS session resumption",
          "Rotating keys more frequently",
          "Constant-time code, whose execution never depends on secret data",
          "Using a longer key",
        ],
        correctIndex: 2,
        explanation: "Writing code so execution time, memory access pattern, and power draw never depend on secret data closes off timing and cache-based leaks at the source.",
      },
    ],
  },
  {
    moduleSlug: "blockchain-and-signatures",
    questions: [
      {
        question: "What makes tampering with an earlier blockchain block computationally evident?",
        options: [
          "Blocks are limited to one transaction each",
          "Every node stores a signature over the entire chain",
          "Blocks are encrypted with a shared secret",
          "Each block includes the hash of the previous block, so a change cascades forward",
        ],
        correctIndex: 3,
        explanation: "Changing an earlier block changes its hash, which no longer matches what the next block recorded — the mismatch cascades through every subsequent block.",
      },
      {
        question: "What does a Merkle proof let a client do?",
        options: [
          "Reverse a completed transaction",
          "Prove a specific transaction is included in a block, using only a small path of hashes",
          "Decrypt a block without the private key",
          "Skip signature verification entirely",
        ],
        correctIndex: 1,
        explanation: "Rather than downloading every transaction, a client can verify inclusion with just the sibling hashes along the path to the Merkle root.",
      },
      {
        question: "What's the quantum-risk nuance specific to Bitcoin/Ethereum addresses, per the module?",
        options: [
          "All addresses expose their public key immediately upon creation",
          "An address's full public key is only exposed on-chain once it first sends a transaction",
          "Quantum computers can't threaten blockchain signatures at all",
          "Only mining nodes are at quantum risk",
        ],
        correctIndex: 1,
        explanation: "Unspent addresses expose only a hash of the public key. Any address that has ever sent a transaction has its full public key permanently on the ledger, available today for a future quantum attack.",
      },
    ],
  },
  {
    moduleSlug: "quantum-threat-shor",
    questions: [
      {
        question: "What did Shor's algorithm (1994) prove could be solved efficiently on a quantum computer?",
        options: [
          "Elliptic curve point counting only",
          "Hash collision finding, instantly",
          "AES key search, in constant time",
          "Integer factorization and discrete logarithms, in polynomial time",
        ],
        correctIndex: 3,
        explanation: "This is the specific mathematical result that makes RSA, classical Diffie-Hellman, and ECC/ECDSA all breakable on a sufficiently large, low-error quantum computer.",
      },
      {
        question: "What is Grover's algorithm's effect on symmetric ciphers and hash functions?",
        options: [
          "Only threatens RSA and ECC, not AES",
          "Breaks them completely, with no defense",
          "Has no effect on them at all",
          "Roughly halves their effective security level, countered by larger keys/outputs",
        ],
        correctIndex: 3,
        explanation: "Unlike Shor's algorithm's total break of public-key crypto, Grover's quadratic speedup is countered simply by using larger keys — AES-256 still gives ~128-bit quantum-resistant security.",
      },
      {
        question: "Roughly how many logical (error-corrected) qubits are estimated to be needed to break RSA-2048 with Shor's algorithm?",
        options: ["A few dozen", "About 100", "Several thousand", "Over a billion"],
        correctIndex: 2,
        explanation: "Given current error rates, this could require millions of physical qubits once error-correction overhead is included — far beyond today's hardware.",
      },
    ],
  },
  {
    moduleSlug: "harvest-now-decrypt-later",
    questions: [
      {
        question: "What does \"harvest now, decrypt later\" require an adversary to do today?",
        options: [
          "Break AES directly with brute force",
          "Already possess a working quantum computer",
          "Compromise the recipient's device directly",
          "Record and store encrypted traffic — no quantum computer needed yet",
        ],
        correctIndex: 3,
        explanation: "Only the eventual decryption needs a quantum computer — recording RSA/ECDH-protected traffic today requires nothing more than passive interception.",
      },
      {
        question: "Which kind of data is most at risk from harvest-now-decrypt-later?",
        options: [
          "Data encrypted only with AES-256",
          "A single ephemeral session, irrelevant a week later",
          "Data that was never transmitted over a network",
          "Long-lived confidential data, like state secrets or medical records",
        ],
        correctIndex: 3,
        explanation: "The risk is proportional to how long data needs to stay confidential — data that must remain secret for years or decades is exposed today if intercepted today.",
      },
      {
        question: "What migration strategy does this risk drive organizations toward, well before a capable quantum computer exists?",
        options: [
          "Disabling TLS session resumption",
          "Switching entirely to symmetric encryption",
          "Doubling all RSA key sizes",
          "Hybrid key exchange, combining a classical algorithm with a post-quantum one in the same handshake",
        ],
        correctIndex: 3,
        explanation: "Combining ECDH with ML-KEM in the same handshake lets organizations start migrating now, rather than waiting for a quantum computer to actually appear.",
      },
    ],
  },
];

export function getQuiz(slug: string): ModuleQuiz | undefined {
  return quizzes.find((q) => q.moduleSlug === slug);
}
