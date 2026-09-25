export interface Reference {
  title: string;
  publisher: string;
  url: string;
  note?: string;
}

export interface ReferenceGroup {
  heading: string;
  intro?: string;
  references: Reference[];
}

export const referenceGroups: ReferenceGroup[] = [
  {
    heading: "Foundational papers",
    references: [
      {
        title: "Communication Theory of Secrecy Systems",
        publisher: "C. E. Shannon, Bell System Technical Journal, 1949",
        url: "https://ieeexplore.ieee.org/document/6769090",
        note: "The paper that put cryptography on a mathematical footing, and proved the one-time pad achieves perfect secrecy.",
      },
      {
        title: "New Directions in Cryptography",
        publisher: "W. Diffie & M. Hellman, IEEE Transactions on Information Theory, 1976",
        url: "https://ee.stanford.edu/~hellman/publications/24.pdf",
        note: "The original public-key key-exchange paper.",
      },
      {
        title: "A Method for Obtaining Digital Signatures and Public-Key Cryptosystems",
        publisher: "R. Rivest, A. Shamir, L. Adleman, Communications of the ACM, 1978",
        url: "https://people.csail.mit.edu/rivest/Rsapaper.pdf",
        note: "The original RSA paper.",
      },
      {
        title: "A Public Key Cryptosystem and a Signature Scheme Based on Discrete Logarithms",
        publisher: "T. ElGamal, IEEE Transactions on Information Theory, 1985",
        url: "https://ieeexplore.ieee.org/document/1057074",
        note: "The original ElGamal encryption and signature paper.",
      },
      {
        title: "How to Share a Secret",
        publisher: "A. Shamir, Communications of the ACM, 1979",
        url: "https://dl.acm.org/doi/10.1145/359168.359176",
        note: "The original threshold secret-sharing paper.",
      },
      {
        title: "Algorithms for Quantum Computation: Discrete Logarithms and Factoring",
        publisher: "P. W. Shor, Proceedings of the 35th Annual Symposium on Foundations of Computer Science, 1994",
        url: "https://ieeexplore.ieee.org/document/365700",
        note: "The paper behind the entire post-quantum migration this site is framed around.",
      },
    ],
  },
  {
    heading: "Symmetric-key cryptography",
    references: [
      { title: "FIPS 197 — Advanced Encryption Standard (AES)", publisher: "NIST", url: "https://csrc.nist.gov/pubs/fips/197/final" },
      {
        title: "FIPS 46-3 — Data Encryption Standard (DES)",
        publisher: "NIST",
        url: "https://csrc.nist.gov/pubs/fips/46-3/final",
        note: "Withdrawn in 2005 once its 56-bit key became exhaustively searchable; superseded by AES.",
      },
      {
        title: "SP 800-38D — Recommendation for Block Cipher Modes of Operation: Galois/Counter Mode (GCM) and GMAC",
        publisher: "NIST",
        url: "https://csrc.nist.gov/pubs/sp/800/38/d/final",
      },
      { title: "RFC 8439 — ChaCha20 and Poly1305 for IETF Protocols", publisher: "IETF", url: "https://www.rfc-editor.org/rfc/rfc8439" },
    ],
  },
  {
    heading: "Public-key cryptography (RSA, Diffie-Hellman, ElGamal, ECC)",
    references: [
      { title: "FIPS 186-5 — Digital Signature Standard (DSS)", publisher: "NIST", url: "https://csrc.nist.gov/pubs/fips/186/5/final", note: "Covers RSA and ECDSA signature parameters." },
      { title: "RFC 8017 — PKCS #1: RSA Cryptography Specifications Version 2.2", publisher: "IETF", url: "https://www.rfc-editor.org/rfc/rfc8017", note: "OAEP and PKCS#1 v1.5 padding." },
      {
        title: "SP 800-56A Rev. 3 — Recommendation for Pair-Wise Key-Establishment Using Discrete Logarithm Cryptography",
        publisher: "NIST",
        url: "https://csrc.nist.gov/pubs/sp/800/56/a/r3/final",
        note: "Covers Diffie-Hellman and ECDH.",
      },
      { title: "SP 800-186 — Recommendations for Discrete Logarithm-based Cryptography: Elliptic Curve Domain Parameters", publisher: "NIST", url: "https://csrc.nist.gov/pubs/sp/800/186/final" },
    ],
  },
  {
    heading: "Hashing, signatures & key derivation",
    references: [
      { title: "FIPS 180-4 — Secure Hash Standard (SHS)", publisher: "NIST", url: "https://csrc.nist.gov/pubs/fips/180/4/final", note: "SHA-2 family." },
      { title: "FIPS 202 — SHA-3 Standard", publisher: "NIST", url: "https://csrc.nist.gov/pubs/fips/202/final" },
      { title: "RFC 2104 — HMAC: Keyed-Hashing for Message Authentication", publisher: "IETF", url: "https://www.rfc-editor.org/rfc/rfc2104" },
      { title: "RFC 8018 — PKCS #5: Password-Based Cryptography Specification Version 2.1", publisher: "IETF", url: "https://www.rfc-editor.org/rfc/rfc8018", note: "PBKDF2." },
      { title: "RFC 9106 — Argon2 Memory-Hard Function for Password Hashing and Proof-of-Work Applications", publisher: "IETF / IRTF CFRG", url: "https://www.rfc-editor.org/rfc/rfc9106" },
    ],
  },
  {
    heading: "Protocols (TLS, certificates, JWT, SSH, Signal, WebAuthn)",
    references: [
      { title: "RFC 8446 — The Transport Layer Security (TLS) Protocol Version 1.3", publisher: "IETF", url: "https://www.rfc-editor.org/rfc/rfc8446" },
      { title: "RFC 5280 — Internet X.509 Public Key Infrastructure Certificate and CRL Profile", publisher: "IETF", url: "https://www.rfc-editor.org/rfc/rfc5280" },
      { title: "RFC 6960 — X.509 Internet PKI Online Certificate Status Protocol (OCSP)", publisher: "IETF", url: "https://www.rfc-editor.org/rfc/rfc6960" },
      { title: "RFC 6962 — Certificate Transparency", publisher: "IETF", url: "https://www.rfc-editor.org/rfc/rfc6962" },
      { title: "RFC 7519 — JSON Web Token (JWT)", publisher: "IETF", url: "https://www.rfc-editor.org/rfc/rfc7519" },
      { title: "RFC 7515 — JSON Web Signature (JWS)", publisher: "IETF", url: "https://www.rfc-editor.org/rfc/rfc7515" },
      { title: "RFC 4251 — The Secure Shell (SSH) Protocol Architecture", publisher: "IETF", url: "https://www.rfc-editor.org/rfc/rfc4251" },
      { title: "The X3DH Key Agreement Protocol", publisher: "Signal", url: "https://signal.org/docs/specifications/x3dh/" },
      { title: "The Double Ratchet Algorithm", publisher: "Signal", url: "https://signal.org/docs/specifications/doubleratchet/" },
      {
        title: "Web Authentication: An API for accessing Public Key Credentials — Level 3",
        publisher: "W3C Recommendation",
        url: "https://www.w3.org/TR/webauthn-3/",
        note: "The WebAuthn standard passkeys are built on.",
      },
    ],
  },
  {
    heading: "Key management, PKI automation & federated identity",
    references: [
      { title: "RFC 3394 — Advanced Encryption Standard (AES) Key Wrap Algorithm", publisher: "IETF", url: "https://www.rfc-editor.org/rfc/rfc3394" },
      { title: "RFC 8555 — Automatic Certificate Management Environment (ACME)", publisher: "IETF", url: "https://www.rfc-editor.org/rfc/rfc8555", note: "The protocol behind Let's Encrypt and automated certificate issuance." },
      { title: "RFC 6749 — The OAuth 2.0 Authorization Framework", publisher: "IETF", url: "https://www.rfc-editor.org/rfc/rfc6749" },
      { title: "RFC 7636 — Proof Key for Code Exchange by OAuth Public Clients (PKCE)", publisher: "IETF", url: "https://www.rfc-editor.org/rfc/rfc7636" },
      { title: "OpenID Connect Core 1.0", publisher: "OpenID Foundation", url: "https://openid.net/specs/openid-connect-core-1_0.html" },
      {
        title: "Assertions and Protocols for the OASIS Security Assertion Markup Language (SAML) V2.0",
        publisher: "OASIS Standard",
        url: "https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf",
      },
      {
        title: "PKCS #11 Cryptographic Token Interface Base Specification Version 3.0",
        publisher: "OASIS Standard",
        url: "https://docs.oasis-open.org/pkcs11/pkcs11-base/v3.0/pkcs11-base-v3.0.html",
        note: "The current Cryptoki specification: the object model, attributes (CKA_SENSITIVE, CKA_EXTRACTABLE), and the full function list this site's PKCS#11 use case and Playground tool are built from.",
      },
      { title: "RFC 8017 — PKCS #1: RSA Cryptography Specifications Version 2.2", publisher: "IETF", url: "https://www.rfc-editor.org/rfc/rfc8017" },
      { title: "RFC 5958 — Asymmetric Key Packages (PKCS #8)", publisher: "IETF", url: "https://www.rfc-editor.org/rfc/rfc5958" },
      { title: "RFC 7292 — PKCS #12: Personal Information Exchange Syntax v1.1", publisher: "IETF", url: "https://www.rfc-editor.org/rfc/rfc7292" },
    ],
  },
  {
    heading: "Post-quantum cryptography & the quantum threat",
    references: [
      { title: "FIPS 203 — Module-Lattice-Based Key-Encapsulation Mechanism Standard (ML-KEM)", publisher: "NIST", url: "https://csrc.nist.gov/pubs/fips/203/final" },
      { title: "FIPS 204 — Module-Lattice-Based Digital Signature Standard (ML-DSA)", publisher: "NIST", url: "https://csrc.nist.gov/pubs/fips/204/final" },
      { title: "FIPS 205 — Stateless Hash-Based Digital Signature Standard (SLH-DSA)", publisher: "NIST", url: "https://csrc.nist.gov/pubs/fips/205/final" },
      { title: "SP 800-57 Part 1 Rev. 5 — Recommendation for Key Management", publisher: "NIST", url: "https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final", note: "Source of the key-size/security-level equivalence table used in this catalog." },
    ],
  },
  {
    heading: "Further hands-on practice",
    intro: "This site's Challenges section draws its format and flag convention from these two long-running cryptography CTF sites — both excellent next steps once you've worked through the challenges here.",
    references: [
      { title: "CryptoHack", publisher: "CryptoHack", url: "https://cryptohack.org/", note: "A categorized library of cryptography challenges, from classical ciphers through elliptic curves and real-world protocol flaws." },
      { title: "Cryptopals Crypto Challenges", publisher: "Cryptopals", url: "https://cryptopals.com/", note: "A structured set of exercises, organized into progressive sets, that build real attacks against AES, RSA, Diffie-Hellman, and more from scratch." },
    ],
  },
];
