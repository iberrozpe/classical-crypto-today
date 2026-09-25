export type LibraryType = "paper" | "standard" | "site" | "book";

export interface LibraryEntry {
  title: string;
  publisher: string;
  url: string;
  note?: string;
  type: LibraryType;
  topic: string;
}

export const libraryTypeLabels: Record<LibraryType, string> = {
  paper: "Foundational papers",
  standard: "Standards & RFCs",
  site: "Sites & practice",
  book: "Books",
};

export const libraryEntries: LibraryEntry[] = [
  // ---------------------------------------------------------------------
  // Foundational papers
  // ---------------------------------------------------------------------
  {
    type: "paper",
    topic: "Foundational papers",
    title: "Communication Theory of Secrecy Systems",
    publisher: "C. E. Shannon, Bell System Technical Journal, 1949",
    url: "https://ieeexplore.ieee.org/document/6769090",
    note: "The paper that put cryptography on a mathematical footing, and proved the one-time pad achieves perfect secrecy.",
  },
  {
    type: "paper",
    topic: "Foundational papers",
    title: "New Directions in Cryptography",
    publisher: "W. Diffie & M. Hellman, IEEE Transactions on Information Theory, 1976",
    url: "https://ee.stanford.edu/~hellman/publications/24.pdf",
    note: "The original public-key key-exchange paper.",
  },
  {
    type: "paper",
    topic: "Foundational papers",
    title: "A Method for Obtaining Digital Signatures and Public-Key Cryptosystems",
    publisher: "R. Rivest, A. Shamir, L. Adleman, Communications of the ACM, 1978",
    url: "https://people.csail.mit.edu/rivest/Rsapaper.pdf",
    note: "The original RSA paper.",
  },
  {
    type: "paper",
    topic: "Foundational papers",
    title: "A Public Key Cryptosystem and a Signature Scheme Based on Discrete Logarithms",
    publisher: "T. ElGamal, IEEE Transactions on Information Theory, 1985",
    url: "https://ieeexplore.ieee.org/document/1057074",
    note: "The original ElGamal encryption and signature paper.",
  },
  {
    type: "paper",
    topic: "Foundational papers",
    title: "How to Share a Secret",
    publisher: "A. Shamir, Communications of the ACM, 1979",
    url: "https://dl.acm.org/doi/10.1145/359168.359176",
    note: "The original threshold secret-sharing paper.",
  },
  {
    type: "paper",
    topic: "Foundational papers",
    title: "Algorithms for Quantum Computation: Discrete Logarithms and Factoring",
    publisher: "P. W. Shor, Proceedings of the 35th Annual Symposium on Foundations of Computer Science, 1994",
    url: "https://ieeexplore.ieee.org/document/365700",
    note: "The paper behind the entire post-quantum migration this site is framed around.",
  },

  // ---------------------------------------------------------------------
  // Symmetric-key cryptography
  // ---------------------------------------------------------------------
  {
    type: "standard",
    topic: "Symmetric-key cryptography",
    title: "FIPS 197 — Advanced Encryption Standard (AES)",
    publisher: "NIST",
    url: "https://csrc.nist.gov/pubs/fips/197/final",
  },
  {
    type: "standard",
    topic: "Symmetric-key cryptography",
    title: "FIPS 46-3 — Data Encryption Standard (DES)",
    publisher: "NIST",
    url: "https://csrc.nist.gov/pubs/fips/46-3/final",
    note: "Withdrawn in 2005 once its 56-bit key became exhaustively searchable; superseded by AES.",
  },
  {
    type: "standard",
    topic: "Symmetric-key cryptography",
    title: "SP 800-38D — Recommendation for Block Cipher Modes of Operation: Galois/Counter Mode (GCM) and GMAC",
    publisher: "NIST",
    url: "https://csrc.nist.gov/pubs/sp/800/38/d/final",
  },
  {
    type: "standard",
    topic: "Symmetric-key cryptography",
    title: "RFC 8439 — ChaCha20 and Poly1305 for IETF Protocols",
    publisher: "IETF",
    url: "https://www.rfc-editor.org/rfc/rfc8439",
  },

  // ---------------------------------------------------------------------
  // Public-key cryptography
  // ---------------------------------------------------------------------
  {
    type: "standard",
    topic: "Public-key cryptography (RSA, Diffie-Hellman, ElGamal, ECC)",
    title: "FIPS 186-5 — Digital Signature Standard (DSS)",
    publisher: "NIST",
    url: "https://csrc.nist.gov/publications/detail/fips/186/5/final",
    note: "Covers RSA and ECDSA signature parameters.",
  },
  {
    type: "standard",
    topic: "Public-key cryptography (RSA, Diffie-Hellman, ElGamal, ECC)",
    title: "RFC 8017 — PKCS #1: RSA Cryptography Specifications Version 2.2",
    publisher: "IETF",
    url: "https://www.rfc-editor.org/rfc/rfc8017",
    note: "OAEP and PKCS#1 v1.5 padding.",
  },
  {
    type: "standard",
    topic: "Public-key cryptography (RSA, Diffie-Hellman, ElGamal, ECC)",
    title: "SP 800-56A Rev. 3 — Recommendation for Pair-Wise Key-Establishment Using Discrete Logarithm Cryptography",
    publisher: "NIST",
    url: "https://csrc.nist.gov/pubs/sp/800/56/a/r3/final",
    note: "Covers Diffie-Hellman and ECDH.",
  },
  {
    type: "standard",
    topic: "Public-key cryptography (RSA, Diffie-Hellman, ElGamal, ECC)",
    title: "SP 800-186 — Recommendations for Discrete Logarithm-based Cryptography: Elliptic Curve Domain Parameters",
    publisher: "NIST",
    url: "https://csrc.nist.gov/pubs/sp/800/186/final",
  },

  // ---------------------------------------------------------------------
  // Hashing, signatures & key derivation
  // ---------------------------------------------------------------------
  {
    type: "standard",
    topic: "Hashing, signatures & key derivation",
    title: "FIPS 180-4 — Secure Hash Standard (SHS)",
    publisher: "NIST",
    url: "https://csrc.nist.gov/publications/detail/fips/180/4/final",
    note: "SHA-2 family.",
  },
  {
    type: "standard",
    topic: "Hashing, signatures & key derivation",
    title: "FIPS 202 — SHA-3 Standard",
    publisher: "NIST",
    url: "https://csrc.nist.gov/pubs/fips/202/final",
  },
  {
    type: "standard",
    topic: "Hashing, signatures & key derivation",
    title: "RFC 2104 — HMAC: Keyed-Hashing for Message Authentication",
    publisher: "IETF",
    url: "https://www.rfc-editor.org/rfc/rfc2104",
  },
  {
    type: "standard",
    topic: "Hashing, signatures & key derivation",
    title: "RFC 8018 — PKCS #5: Password-Based Cryptography Specification Version 2.1",
    publisher: "IETF",
    url: "https://www.rfc-editor.org/rfc/rfc8018",
    note: "PBKDF2.",
  },
  {
    type: "standard",
    topic: "Hashing, signatures & key derivation",
    title: "RFC 9106 — Argon2 Memory-Hard Function for Password Hashing and Proof-of-Work Applications",
    publisher: "IETF / IRTF CFRG",
    url: "https://www.rfc-editor.org/rfc/rfc9106",
  },

  // ---------------------------------------------------------------------
  // Protocols
  // ---------------------------------------------------------------------
  {
    type: "standard",
    topic: "Protocols (TLS, certificates, JWT, SSH, Signal, WebAuthn)",
    title: "RFC 9846 — The Transport Layer Security (TLS) Protocol Version 1.3",
    publisher: "IETF",
    url: "https://www.rfc-editor.org/rfc/rfc9846",
  },
  {
    type: "standard",
    topic: "Protocols (TLS, certificates, JWT, SSH, Signal, WebAuthn)",
    title: "RFC 5280 — Internet X.509 Public Key Infrastructure Certificate and CRL Profile",
    publisher: "IETF",
    url: "https://www.rfc-editor.org/rfc/rfc5280",
  },
  {
    type: "standard",
    topic: "Protocols (TLS, certificates, JWT, SSH, Signal, WebAuthn)",
    title: "RFC 6960 — X.509 Internet PKI Online Certificate Status Protocol (OCSP)",
    publisher: "IETF",
    url: "https://www.rfc-editor.org/rfc/rfc6960",
  },
  {
    type: "standard",
    topic: "Protocols (TLS, certificates, JWT, SSH, Signal, WebAuthn)",
    title: "RFC 9162 — Certificate Transparency Version 2.0",
    publisher: "IETF",
    url: "https://www.rfc-editor.org/rfc/rfc9162",
  },
  {
    type: "standard",
    topic: "Protocols (TLS, certificates, JWT, SSH, Signal, WebAuthn)",
    title: "RFC 7519 — JSON Web Token (JWT)",
    publisher: "IETF",
    url: "https://www.rfc-editor.org/rfc/rfc7519",
  },
  {
    type: "standard",
    topic: "Protocols (TLS, certificates, JWT, SSH, Signal, WebAuthn)",
    title: "RFC 7515 — JSON Web Signature (JWS)",
    publisher: "IETF",
    url: "https://www.rfc-editor.org/rfc/rfc7515",
  },
  {
    type: "standard",
    topic: "Protocols (TLS, certificates, JWT, SSH, Signal, WebAuthn)",
    title: "RFC 4251 — The Secure Shell (SSH) Protocol Architecture",
    publisher: "IETF",
    url: "https://www.rfc-editor.org/rfc/rfc4251",
  },
  {
    type: "standard",
    topic: "Protocols (TLS, certificates, JWT, SSH, Signal, WebAuthn)",
    title: "The X3DH Key Agreement Protocol",
    publisher: "Signal",
    url: "https://signal.org/docs/specifications/x3dh/",
  },
  {
    type: "standard",
    topic: "Protocols (TLS, certificates, JWT, SSH, Signal, WebAuthn)",
    title: "The Double Ratchet Algorithm",
    publisher: "Signal",
    url: "https://signal.org/docs/specifications/doubleratchet/",
  },
  {
    type: "standard",
    topic: "Protocols (TLS, certificates, JWT, SSH, Signal, WebAuthn)",
    title: "Web Authentication: An API for accessing Public Key Credentials — Level 3",
    publisher: "W3C Recommendation",
    url: "https://www.w3.org/TR/webauthn-3/",
    note: "The WebAuthn standard passkeys are built on.",
  },

  // ---------------------------------------------------------------------
  // Key management, PKI automation & federated identity
  // ---------------------------------------------------------------------
  {
    type: "standard",
    topic: "Key management, PKI automation & federated identity",
    title: "RFC 3394 — Advanced Encryption Standard (AES) Key Wrap Algorithm",
    publisher: "IETF",
    url: "https://www.rfc-editor.org/rfc/rfc3394",
  },
  {
    type: "standard",
    topic: "Key management, PKI automation & federated identity",
    title: "RFC 8555 — Automatic Certificate Management Environment (ACME)",
    publisher: "IETF",
    url: "https://www.rfc-editor.org/rfc/rfc8555",
    note: "The protocol behind Let's Encrypt and automated certificate issuance.",
  },
  {
    type: "standard",
    topic: "Key management, PKI automation & federated identity",
    title: "RFC 6749 — The OAuth 2.0 Authorization Framework",
    publisher: "IETF",
    url: "https://www.rfc-editor.org/rfc/rfc6749",
  },
  {
    type: "standard",
    topic: "Key management, PKI automation & federated identity",
    title: "RFC 7636 — Proof Key for Code Exchange by OAuth Public Clients (PKCE)",
    publisher: "IETF",
    url: "https://www.rfc-editor.org/rfc/rfc7636",
  },
  {
    type: "standard",
    topic: "Key management, PKI automation & federated identity",
    title: "OpenID Connect Core 1.0",
    publisher: "OpenID Foundation",
    url: "https://openid.net/specs/openid-connect-core-1_0.html",
  },
  {
    type: "standard",
    topic: "Key management, PKI automation & federated identity",
    title: "Assertions and Protocols for the OASIS Security Assertion Markup Language (SAML) V2.0",
    publisher: "OASIS Standard",
    url: "https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf",
  },
  {
    type: "standard",
    topic: "Key management, PKI automation & federated identity",
    title: "PKCS #11 Cryptographic Token Interface Base Specification Version 3.0",
    publisher: "OASIS Standard",
    url: "https://docs.oasis-open.org/pkcs11/pkcs11-base/v3.0/pkcs11-base-v3.0.html",
    note: "The current Cryptoki specification: the object model, attributes (CKA_SENSITIVE, CKA_EXTRACTABLE), and the full function list this site's PKCS#11 use case and Playground tool are built from.",
  },
  {
    type: "standard",
    topic: "Key management, PKI automation & federated identity",
    title: "RFC 5958 — Asymmetric Key Packages (PKCS #8)",
    publisher: "IETF",
    url: "https://www.rfc-editor.org/rfc/rfc5958",
  },
  {
    type: "standard",
    topic: "Key management, PKI automation & federated identity",
    title: "RFC 7292 — PKCS #12: Personal Information Exchange Syntax v1.1",
    publisher: "IETF",
    url: "https://www.rfc-editor.org/rfc/rfc7292",
  },

  // ---------------------------------------------------------------------
  // Post-quantum cryptography & the quantum threat
  // ---------------------------------------------------------------------
  {
    type: "standard",
    topic: "Post-quantum cryptography & the quantum threat",
    title: "FIPS 203 — Module-Lattice-Based Key-Encapsulation Mechanism Standard (ML-KEM)",
    publisher: "NIST",
    url: "https://csrc.nist.gov/pubs/fips/203/final",
  },
  {
    type: "standard",
    topic: "Post-quantum cryptography & the quantum threat",
    title: "FIPS 204 — Module-Lattice-Based Digital Signature Standard (ML-DSA)",
    publisher: "NIST",
    url: "https://csrc.nist.gov/pubs/fips/204/final",
  },
  {
    type: "standard",
    topic: "Post-quantum cryptography & the quantum threat",
    title: "FIPS 205 — Stateless Hash-Based Digital Signature Standard (SLH-DSA)",
    publisher: "NIST",
    url: "https://csrc.nist.gov/pubs/fips/205/final",
  },
  {
    type: "standard",
    topic: "Post-quantum cryptography & the quantum threat",
    title: "SP 800-57 Part 1 Rev. 5 — Recommendation for Key Management",
    publisher: "NIST",
    url: "https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final",
    note: "Source of the key-size/security-level equivalence table used in this catalog.",
  },

  // ---------------------------------------------------------------------
  // Standardization bodies
  // ---------------------------------------------------------------------
  {
    type: "standard",
    topic: "Standardization bodies",
    title: "NIST Computer Security Resource Center",
    publisher: "NIST",
    url: "https://csrc.nist.gov/",
    note: "Home of every FIPS and SP 800 document cited throughout this library.",
  },
  {
    type: "standard",
    topic: "Standardization bodies",
    title: "IETF",
    publisher: "Internet Engineering Task Force",
    url: "https://www.ietf.org/",
    note: "Home of the RFC series and its working groups.",
  },
  {
    type: "standard",
    topic: "Standardization bodies",
    title: "RFC 2119 — Key words for use in RFCs to Indicate Requirement Levels",
    publisher: "IETF",
    url: "https://www.rfc-editor.org/rfc/rfc2119",
    note: "Defines what MUST, SHOULD, and MAY mean inside every other RFC that uses them.",
  },
  {
    type: "standard",
    topic: "Standardization bodies",
    title: "ISO",
    publisher: "International Organization for Standardization",
    url: "https://www.iso.org/",
    note: "Publishes ISO/IEC 27001, 18033, 19790, and the rest of the JTC 1/SC 27 security series jointly with the IEC.",
  },
  {
    type: "standard",
    topic: "Standardization bodies",
    title: "OASIS Open",
    publisher: "OASIS",
    url: "https://www.oasis-open.org/",
    note: "Home of SAML 2.0, PKCS#11, and KMIP.",
  },

  // ---------------------------------------------------------------------
  // Further hands-on practice
  // ---------------------------------------------------------------------
  {
    type: "site",
    topic: "Further hands-on practice",
    title: "CryptoHack",
    publisher: "CryptoHack",
    url: "https://cryptohack.org/",
    note: "A categorized library of cryptography challenges, from classical ciphers through elliptic curves and real-world protocol flaws.",
  },
  {
    type: "site",
    topic: "Further hands-on practice",
    title: "Cryptopals Crypto Challenges",
    publisher: "Cryptopals",
    url: "https://cryptopals.com/",
    note: "A structured set of exercises, organized into progressive sets, that build real attacks against AES, RSA, Diffie-Hellman, and more from scratch.",
  },

  // ---------------------------------------------------------------------
  // Sites & blogs
  // ---------------------------------------------------------------------
  {
    type: "site",
    topic: "Sites & blogs",
    title: "Schneier on Security",
    publisher: "Bruce Schneier",
    url: "https://www.schneier.com/",
    note: "Long-running blog on crypto policy, applied security, and the occasional deep dive into a broken protocol.",
  },
  {
    type: "site",
    topic: "Sites & blogs",
    title: "A Few Thoughts on Cryptographic Engineering",
    publisher: "Matthew Green",
    url: "https://blog.cryptographyengineering.com/",
    note: "A Johns Hopkins cryptographer writing accessibly about TLS, protocol security, and why real-world crypto keeps breaking.",
  },
  {
    type: "site",
    topic: "Sites & blogs",
    title: "cr.yp.to",
    publisher: "Daniel J. Bernstein",
    url: "https://cr.yp.to/",
    note: "The designer of ChaCha20 and Curve25519, writing directly about the algorithms covered in this catalog.",
  },
  {
    type: "site",
    topic: "Sites & blogs",
    title: "IACR ePrint Archive",
    publisher: "International Association for Cryptologic Research",
    url: "https://eprint.iacr.org/",
    note: "The preprint server where new cryptography research — including attacks on things covered here — appears first.",
  },
  {
    type: "site",
    topic: "Sites & blogs",
    title: "Real World Crypto",
    publisher: "IACR",
    url: "https://rwc.iacr.org/",
    note: "An annual conference bridging cryptography research and real deployments — talks and proceedings are free.",
  },
  {
    type: "site",
    topic: "Sites & blogs",
    title: "Cryptography I",
    publisher: "Dan Boneh, Stanford (Coursera)",
    url: "https://www.coursera.org/learn/crypto",
    note: "The standard free introductory cryptography course — covers the same primitives this site does, with formal rigor.",
  },
  {
    type: "site",
    topic: "Sites & blogs",
    title: "MIT OpenCourseWare — Mathematics & EECS",
    publisher: "MIT",
    url: "https://ocw.mit.edu/",
    note: "Free lecture notes and problem sets from MIT's cryptography and number theory courses.",
  },
  {
    type: "site",
    topic: "Sites & blogs",
    title: "Cryptography Stack Exchange",
    publisher: "Stack Exchange community",
    url: "https://crypto.stackexchange.com/",
    note: "A Q&A site where working cryptographers answer specific, technical questions — good for when a module raises more questions than it answers.",
  },
  {
    type: "site",
    topic: "Sites & blogs",
    title: "CrypTool",
    publisher: "CrypTool project",
    url: "https://www.cryptool.org/",
    note: "Open-source, interactive software for experimenting with classical and modern ciphers and cryptanalysis techniques.",
  },
  {
    type: "site",
    topic: "Sites & blogs",
    title: "NIST Cryptographic Standards and Guidelines",
    publisher: "NIST",
    url: "https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines",
    note: "The official hub for the FIPS and Special Publications this library cites throughout.",
  },

  // ---------------------------------------------------------------------
  // Books
  // ---------------------------------------------------------------------
  {
    type: "book",
    topic: "Books",
    title: "Applied Cryptography",
    publisher: "Bruce Schneier",
    url: "https://www.schneier.com/books/applied-cryptography/",
    note: "The classic reference on cryptographic protocols, algorithms, and source code — dated in places, foundational everywhere else.",
  },
  {
    type: "book",
    topic: "Books",
    title: "Serious Cryptography",
    publisher: "Jean-Philippe Aumasson",
    url: "https://nostarch.com/seriouscrypto",
    note: "A practical, modern guide to encryption — symmetric, asymmetric, and the protocols built from them.",
  },
  {
    type: "book",
    topic: "Books",
    title: "Real-World Cryptography",
    publisher: "David Wong",
    url: "https://www.manning.com/books/real-world-cryptography",
    note: "A hands-on guide to the cryptographic primitives and protocols actually deployed today, not just the textbook versions.",
  },
  {
    type: "book",
    topic: "Books",
    title: "Cryptography Engineering",
    publisher: "Niels Ferguson, Bruce Schneier & Tadayoshi Kohno",
    url: "https://www.schneier.com/books/cryptography-engineering/",
    note: "Design principles and hard-won practical guidance for building cryptographic systems that survive contact with reality.",
  },
  {
    type: "book",
    topic: "Books",
    title: "Understanding Cryptography",
    publisher: "Christof Paar & Jan Pelzl",
    url: "https://www.crypto-textbook.com/",
    note: "A textbook covering essentially the same algorithm set as this site — AES, RSA, ECC, hashing — with more mathematical depth.",
  },
  {
    type: "book",
    topic: "Books",
    title: "A Graduate Course in Applied Cryptography",
    publisher: "Dan Boneh & Victor Shoup",
    url: "https://toc.cryptobook.us/",
    note: "Comprehensive, rigorous, and free — covers private-key encryption, public-key encryption, and digital signatures in full.",
  },
  {
    type: "book",
    topic: "Books",
    title: "The Code Book",
    publisher: "Simon Singh",
    url: "https://simonsingh.net/books/the-code-book/",
    note: "The most accessible history of cryptography available — from the scytale to the Enigma to modern public-key cryptography.",
  },
  {
    type: "book",
    topic: "Books",
    title: "The Codebreakers",
    publisher: "David Kahn",
    url: "https://en.wikipedia.org/wiki/The_Codebreakers",
    note: "The definitive, exhaustive history of cryptography up to its 1967 publication — the book that founded the field of crypto history.",
  },
];
