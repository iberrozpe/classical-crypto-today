import type { QuizQuestion } from "@/lib/quiz";

export interface UseCaseQuiz {
  useCaseSlug: string;
  questions: QuizQuestion[];
}

export const useCaseQuizzes: UseCaseQuiz[] = [
  {
    useCaseSlug: "kms-envelope-encryption",
    questions: [
      {
        question: "What problem does envelope encryption solve that direct master-key encryption doesn't?",
        options: [
          "It avoids sending bulk data to the KMS/HSM boundary, which is built for wrapping small keys, not vast amounts of data",
          "It makes AES faster",
          "It eliminates the need for a KMS entirely",
          "It removes the need for encryption keys altogether",
        ],
        correctIndex: 0,
        explanation: "An HSM handles wrapping small, fixed-size keys extremely well — but is a poor fit for encrypting gigabytes of data one call at a time. Envelope encryption keeps bulk encryption local and fast.",
      },
      {
        question: "What is a DEK?",
        options: [
          "The KMS's master key",
          "A key generated fresh to encrypt the actual data locally, never stored in plaintext",
          "A wrapped ciphertext",
          "A password hash",
        ],
        correctIndex: 1,
        explanation: "The Data Encryption Key does the actual bulk encryption locally and is discarded from memory once used — only its wrapped (encrypted) form is stored.",
      },
      {
        question: "What does \"wrapping\" a DEK mean?",
        options: [
          "Compressing it",
          "Hashing it",
          "Encrypting the DEK itself with the KEK",
          "Splitting it into shares",
        ],
        correctIndex: 2,
        explanation: "Wrapping is simply encrypting the DEK using the Key-Encryption Key — unwrapping reverses it, and only the KMS holding the KEK can do that.",
      },
      {
        question: "What does a KMS's Decrypt call actually see?",
        options: [
          "The plaintext data",
          "The DEK in plaintext, generated fresh",
          "The AES-GCM nonce",
          "Only the small wrapped DEK — never the encrypted data itself",
        ],
        correctIndex: 3,
        explanation: "The application sends only the wrapped DEK to the KMS; the actual encrypted data never has to leave the application's own environment.",
      },
      {
        question: "Why does an attacker with stolen ciphertext and its wrapped DEK still have nothing?",
        options: [
          "Unwrapping requires a live call to a KMS enforcing its own access policy over the KEK",
          "The ciphertext is compressed",
          "AES-GCM cannot be decrypted by anyone",
          "The DEK is hashed, not encrypted",
        ],
        correctIndex: 0,
        explanation: "Turning a wrapped DEK back into something usable requires access to the KMS itself, which enforces its own logging, access policy, and often a hardware boundary around the KEK.",
      },
      {
        question: "What determines the size of an RSA-OAEP wrapped DEK's ciphertext?",
        options: [
          "The size of the original DEK",
          "The RSA modulus size, regardless of the DEK's own size",
          "The AES block size",
          "The KMS's request latency",
        ],
        correctIndex: 1,
        explanation: "RSA ciphertext size always equals the modulus size — a 4096-bit KEK produces a 512-byte wrapped output no matter whether the DEK itself is 128 or 256 bits.",
      },
      {
        question: "Why do production systems often avoid generating a brand-new DEK via a live KMS call for every single small object?",
        options: [
          "KMS calls are free but insecure",
          "DEKs expire after one use",
          "The added per-call network latency adds up significantly at scale",
          "KMS only allows one DEK per account",
        ],
        correctIndex: 2,
        explanation: "100,000 objects at 20ms per call, serially, adds 2,000 seconds of pure latency — pushing real systems toward batching or caching DEK generation instead.",
      },
      {
        question: "What is the single biggest operational payoff of envelope encryption over direct master-key encryption?",
        options: [
          "It's cheaper per API call",
          "It removes the need for AES entirely",
          "It works without any KMS",
          "Rotating the KEK never requires re-encrypting any stored data",
        ],
        correctIndex: 3,
        explanation: "Rotating the KEK just changes which key version future wrap operations use — every already-wrapped DEK still unwraps correctly via the retained old key version.",
      },
      {
        question: "When a KEK is rotated, what happens to already-wrapped DEKs from before the rotation?",
        options: [
          "They still unwrap correctly, since the KMS keeps old key versions available",
          "They become permanently unreadable",
          "They must be manually re-wrapped immediately",
          "The underlying data must be re-encrypted",
        ],
        correctIndex: 0,
        explanation: "This is the entire payoff of envelope encryption — key rotation becomes a KMS-side configuration change, not a data migration project.",
      },
      {
        question: "Which cipher does the DEK typically use to encrypt data locally?",
        options: ["RSA", "AES-GCM", "SHA-256", "ECDSA"],
        correctIndex: 1,
        explanation: "The DEK is a symmetric key used with AES-GCM for fast, local, authenticated bulk encryption — RSA is reserved for wrapping the small DEK itself.",
      },
    ],
  },
  {
    useCaseSlug: "kms-key-wrapping-and-exchange",
    questions: [
      {
        question: "What determines whether AES Key Wrap or RSA-OAEP key transport is the right tool?",
        options: [
          "Whether the data is text or binary",
          "Whether the two sides already share a symmetric KEK, or only have the recipient's public key",
          "The time of day the transfer happens",
          "Whether TLS is in use",
        ],
        correctIndex: 1,
        explanation: "AES Key Wrap needs a pre-shared symmetric KEK; RSA-OAEP transport works with just the recipient's public key, no pre-shared secret required.",
      },
      {
        question: "Why is AES Key Wrap a dedicated construction rather than just AES-GCM applied to a key?",
        options: [
          "It's slower on purpose",
          "AES-GCM cannot encrypt 256-bit values",
          "It's built around the fact that key material is already high-entropy and needs no IV/nonce, with a strong built-in integrity check",
          "AES Key Wrap doesn't use AES internally",
        ],
        correctIndex: 2,
        explanation: "Because key material is already unpredictable, AES-KW can be deterministic (no IV/nonce) while still detecting an incorrect KEK immediately via its integrity check.",
      },
      {
        question: "How much overhead does AES Key Wrap (RFC 3394) add to a wrapped key, regardless of key size?",
        options: ["16 bytes", "0 bytes", "32 bytes", "8 bytes"],
        correctIndex: 3,
        explanation: "AES-KW adds a fixed 8-byte integrity-check block, whether wrapping a 128-, 192-, or 256-bit key.",
      },
      {
        question: "What integrity-check value does AES Key Wrap use to detect an incorrect KEK during unwrapping?",
        options: [
          "A fixed 64-bit value (0xA6A6A6A6A6A6A6A6)",
          "A random nonce",
          "A SHA-256 hash of the key",
          "The KEK's own fingerprint",
        ],
        correctIndex: 0,
        explanation: "RFC 3394 specifies this fixed 8-byte constant; if unwrapping doesn't recover it exactly, the wrong KEK was used and unwrapping fails loudly.",
      },
      {
        question: "In a cross-KMS \"Import Key Material\" flow, what plays the role of the \"recipient\" in RSA-OAEP key transport?",
        options: [
          "The original key's owner",
          "The destination KMS, which publishes a temporary public key only it can unwrap with",
          "A third-party escrow service",
          "The network itself",
        ],
        correctIndex: 1,
        explanation: "The destination KMS publishes an ephemeral public key and import token; the source wraps the key material with it, and only the destination KMS can unwrap it.",
      },
      {
        question: "What genuinely distinct problem does Diffie-Hellman/ECDH key exchange solve, compared to key wrapping?",
        options: [
          "It compresses keys before transport",
          "It converts symmetric keys into asymmetric ones",
          "Both sides derive an identical shared secret independently, without transmitting any key at all",
          "It eliminates the need for any encryption",
        ],
        correctIndex: 2,
        explanation: "Unlike wrapping, which always transmits an encrypted key, DH/ECDH never transmits a key at all — each side computes the same shared secret independently.",
      },
      {
        question: "Why does forward secrecy favor ECDHE over RSA-wrapped key transport for a live session?",
        options: [
          "ECDHE is always faster to compute",
          "RSA-wrapped transport requires more bandwidth in every case",
          "ECDHE certificates never expire",
          "A recorded RSA-wrapped exchange is retroactively exposed if the long-term key is later compromised; an ephemeral ECDHE exchange leaves nothing to retroactively expose",
        ],
        correctIndex: 3,
        explanation: "Because ECDHE generates a fresh key pair per session and discards it, there's nothing a later key compromise can retroactively decrypt — unlike a recorded RSA-wrapped session key.",
      },
      {
        question: "How large is a typical X25519 ephemeral public key used in ECDH key exchange?",
        options: [
          "32 bytes, fixed regardless of the security level within that curve",
          "256 bytes",
          "2048 bytes",
          "It varies with the size of the data being protected",
        ],
        correctIndex: 0,
        explanation: "X25519's public keys are a fixed 32 bytes — dramatically smaller than an equivalent-strength RSA key-transport payload.",
      },
      {
        question: "Which tool would a TLS 1.3 handshake use to establish a session key live, with forward secrecy?",
        options: [
          "AES Key Wrap",
          "ECDHE key exchange",
          "Plain RSA encryption of the session key",
          "A shared password",
        ],
        correctIndex: 1,
        explanation: "TLS 1.3 made ephemeral ECDHE mandatory specifically for the forward secrecy it provides over static RSA key transport.",
      },
      {
        question: "Which tool is best suited for moving a key between two services that already share a KEK inside the same trust domain?",
        options: ["RSA-OAEP key transport", "ECDH key exchange", "AES Key Wrap", "SAML"],
        correctIndex: 2,
        explanation: "AES Key Wrap is the fast, deterministic, minimal-overhead choice when a shared symmetric KEK already exists between the two sides.",
      },
    ],
  },
  {
    useCaseSlug: "pkcs11-cryptographic-tokens",
    questions: [
      {
        question: "What problem was PKCS#11 originally created to solve?",
        options: [
          "Every HSM and smart card vendor shipped its own proprietary API, so switching hardware meant rewriting an application's integration",
          "RSA encryption was too slow on early hardware",
          "There was no standard certificate format",
          "TLS needed a faster handshake",
        ],
        correctIndex: 0,
        explanation: "Before PKCS#11, an application had to integrate separately with each vendor's proprietary API. Cryptoki standardized the API itself, so the same application code works against any conforming token.",
      },
      {
        question: "What is Cryptoki?",
        options: [
          "A hashing algorithm",
          "A certificate format",
          "PKCS#11's other name — the vendor-neutral API for talking to hardware security tokens",
          "A key-wrapping mechanism",
        ],
        correctIndex: 2,
        explanation: "Cryptoki (\"cryptographic token interface\") is PKCS#11's own name for itself — the fixed set of C function calls every conforming token exposes.",
      },
      {
        question: "In Cryptoki's object model, what does an application actually receive when it asks for a private key?",
        options: [
          "The raw private key bytes, base64-encoded",
          "An opaque handle — an integer reference — never the key's actual value",
          "A PEM file",
          "Nothing; private keys can't be referenced at all",
        ],
        correctIndex: 1,
        explanation: "The application receives a handle and asks the token to perform operations using it. The key material itself never has to leave the hardware boundary.",
      },
      {
        question: "What does a PKCS#11 \"session\" carry?",
        options: [
          "A TLS certificate",
          "A copy of every object on the token",
          "The token's firmware version",
          "A login state — logged out, CKU_USER, or CKU_SO — that gates access to private and secret objects",
        ],
        correctIndex: 3,
        explanation: "A session is an application's open connection to a token. Its login state (public, user, or security officer) determines which objects and operations are accessible.",
      },
      {
        question: "What does setting CKA_EXTRACTABLE = false on a private key actually guarantee?",
        options: [
          "The key can be exported once, by an administrator only",
          "The key can be exported, but only in wrapped form",
          "The key can never leave the token in any form, including wrapped, enforced by the token itself",
          "The key will be deleted after first use",
        ],
        correctIndex: 2,
        explanation: "CKA_EXTRACTABLE = false blocks every operation — including C_WrapKey — that would let the key leave the token, in the clear or wrapped. It's enforced by the token, not the calling application.",
      },
      {
        question: "The Web Crypto API's generateKey takes an `extractable` boolean. What does it correspond to in PKCS#11 terms?",
        options: [
          "CKA_SENSITIVE",
          "CKA_EXTRACTABLE — real enforcement by the runtime, the same as a token refusing to export a non-extractable key",
          "CKA_SIGN",
          "It has no PKCS#11 equivalent",
        ],
        correctIndex: 1,
        explanation: "Setting extractable: false makes the browser itself refuse to export or wrap that key — the same real enforcement a PKCS#11 token applies via CKA_EXTRACTABLE.",
      },
      {
        question: "Which of these commonly uses PKCS#11 under the hood?",
        options: [
          "A government PIV/CAC smart card authenticating a workstation login",
          "A DNS lookup",
          "An HTTP redirect",
          "A CSS stylesheet"
        ],
        correctIndex: 0,
        explanation: "PIV/CAC cards, YubiKeys, browser client-certificate logins, and CA root keys held in HSMs typically all go through a PKCS#11 module — it's the one integration path that works across hardware vendors.",
      },
      {
        question: "What real-world attribute misconfiguration enables the classic PKCS#11 \"wrap-then-decrypt\" key extraction attack?",
        options: [
          "A key with both CKA_SIGN and CKA_VERIFY set",
          "A symmetric key with both CKA_WRAP and CKA_DECRYPT set to true",
          "A certificate with an expired validity period",
          "A token left in CKU_SO login state",
        ],
        correctIndex: 1,
        explanation: "If a wrapping key also has decrypt rights, an attacker can wrap a sensitive key, then decrypt that same wrapped blob with the identical key — recovering the sensitive key's raw bytes, bypassing CKA_SENSITIVE and CKA_EXTRACTABLE entirely.",
      },
      {
        question: "Why does the wrap-then-decrypt attack work even though the target key has CKA_SENSITIVE = true and CKA_EXTRACTABLE = false?",
        options: [
          "The attacker never asks the token to export the target key directly — they wrap it, then separately decrypt the wrapped blob using the wrapping key's own decrypt capability",
          "Those attributes only block C_UnwrapKey, not C_WrapKey",
          "CKA_SENSITIVE doesn't actually do anything in most implementations",
          "The attack requires physical access to the token",
        ],
        correctIndex: 0,
        explanation: "The target key's own attributes are never violated — the attacker exploits a second capability (CKA_DECRYPT) mistakenly left enabled on a different key, the wrapping key, to invert C_WrapKey's output.",
      },
      {
        question: "What is the recommended fix for the wrap-then-decrypt attack class?",
        options: [
          "Disable CKA_SENSITIVE entirely so keys are easier to audit",
          "Use a longer PIN for CKU_USER login",
          "Give every key both CKA_WRAP and CKA_DECRYPT so behavior is consistent",
          "Wrapping keys should carry CKA_WRAP (or CKA_UNWRAP) and nothing else — never encrypt/decrypt capability on the same key object",
        ],
        correctIndex: 3,
        explanation: "Separating capabilities by key role — a dedicated wrapping key that can never also decrypt arbitrary data — closes the attack class entirely. Every major HSM hardening guide recommends this today.",
      },
    ],
  },
  {
    useCaseSlug: "pki-in-production",
    questions: [
      {
        question: "Why does a root CA's private key typically stay offline and air-gapped?",
        options: [
          "To save on hosting costs",
          "Because root keys expire faster than intermediates",
          "Because compromising it would make every certificate chaining back to it suspect at once",
          "Because online keys are illegal under CA/Browser Forum rules",
        ],
        correctIndex: 2,
        explanation: "A root key is the single highest-value target in the hierarchy — its compromise puts every downstream certificate at once in doubt.",
      },
      {
        question: "What happens operationally if an intermediate CA's key is compromised, under the root/intermediate split?",
        options: [
          "The entire PKI must be rebuilt from scratch",
          "Nothing — intermediates can't be revoked",
          "All browsers must be reinstalled",
          "The intermediate is revoked, and the still-safe offline root signs a replacement",
        ],
        correctIndex: 3,
        explanation: "This is exactly the blast-radius containment the root/intermediate split exists to provide — the root stays safe and simply reissues.",
      },
      {
        question: "What is a \"key ceremony\" in the context of root CA key generation?",
        options: [
          "A scripted, audited, multi-party process where the HSM generates the key internally and it never exists outside the hardware boundary",
          "An annual celebration for the security team",
          "A backup procedure for lost keys",
          "The process of renewing a certificate",
        ],
        correctIndex: 0,
        explanation: "Because a root key's security depends on never being exposed even once, its generation is a formally scripted, recorded, multi-party event.",
      },
      {
        question: "What does the ACME protocol (RFC 8555) primarily automate?",
        options: [
          "AES key generation",
          "Domain-control validation and certificate issuance/renewal without human involvement",
          "TLS handshake negotiation",
          "Root CA key ceremonies",
        ],
        correctIndex: 1,
        explanation: "ACME (the protocol behind Let's Encrypt) automates proving domain control and issuing/renewing certificates entirely without a human in the loop.",
      },
      {
        question: "Which of these is NOT one of ACME's standard domain-validation challenge types?",
        options: ["HTTP-01", "DNS-01", "TLS-ALPN-01", "SMTP-01"],
        correctIndex: 3,
        explanation: "ACME's standard challenges are HTTP-01, DNS-01, and TLS-ALPN-01 — there is no SMTP-01 challenge type.",
      },
      {
        question: "As of the CA/Browser Forum's current published schedule, what is the maximum publicly-trusted TLS certificate validity as of March 2026?",
        options: ["398 days", "365 days", "47 days", "200 days"],
        correctIndex: 3,
        explanation: "The maximum dropped from 398 days to 200 days as of March 15, 2026, on the way to 100 days in 2027 and 47 days by 2029.",
      },
      {
        question: "By March 2029, the CA/Browser Forum's maximum certificate validity is scheduled to drop to how many days?",
        options: ["47 days", "90 days", "100 days", "200 days"],
        correctIndex: 0,
        explanation: "The published schedule reaches 47 days as its final step by March 2029 — down from today's 200-day maximum.",
      },
      {
        question: "Why has Let's Encrypt issued 90-day certificates since it launched in 2015, rather than a longer, more \"convenient\" lifetime?",
        options: [
          "90 days was a technical limitation of early TLS",
          "To deliberately force automation of renewal from day one",
          "Browsers rejected longer certificates at the time",
          "90 days matches the AES key rotation schedule",
        ],
        correctIndex: 1,
        explanation: "Let's Encrypt chose a short lifetime specifically to make manual renewal impractical, pushing automation into the default deployment pattern.",
      },
      {
        question: "In a (k, n)-threshold key-ceremony scheme requiring 3 of 5 participants, what's the maximum number of participants who can be absent while the ceremony still proceeds?",
        options: ["0", "1", "2", "5"],
        correctIndex: 2,
        explanation: "n − k = 5 − 3 = 2 participants can be absent while the remaining 3 still meet the threshold.",
      },
      {
        question: "What's the main operational reason shrinking certificate lifetimes are pushing PKI automation industry-wide?",
        options: [
          "Shorter certificates are cryptographically weaker and need frequent replacement for that reason",
          "Manual issuance becomes operationally impossible at the renewal frequency shrinking lifetimes require",
          "Shorter certificates are cheaper to purchase",
          "Browsers stopped supporting long-lived certificates entirely",
        ],
        correctIndex: 1,
        explanation: "At 8 renewals a year (47-day certificates), manual issuance simply doesn't scale — automation stops being optional.",
      },
    ],
  },
  {
    useCaseSlug: "federated-identity-oauth-oidc-saml",
    questions: [
      {
        question: "What does OAuth2 fundamentally provide?",
        options: [
          "User identity verification",
          "XML-based single sign-on",
          "Password storage",
          "Delegated, scoped authorization — without saying anything about who the user is",
        ],
        correctIndex: 3,
        explanation: "OAuth2 answers \"can this app act on my behalf, with this scope of access\" — identity is deliberately left out, which is exactly the gap OIDC closes.",
      },
      {
        question: "What does OIDC add on top of plain OAuth2?",
        options: [
          "An ID token — a signed JWT carrying standardized identity claims",
          "A faster token format",
          "XML-DSig signatures",
          "Support for SAML assertions",
        ],
        correctIndex: 0,
        explanation: "OIDC's one addition is the ID token: a signed JWT with standardized claims like sub, iss, aud, and exp proving who the user is.",
      },
      {
        question: "What problem does PKCE solve for a public OAuth2 client (like a mobile app)?",
        options: [
          "It replaces the access token with a password",
          "It prevents an attacker who intercepts the authorization code from redeeming it, without a stored client secret",
          "It encrypts the ID token",
          "It removes the need for an authorization server",
        ],
        correctIndex: 1,
        explanation: "PKCE has the client prove possession of a locally-generated secret at token exchange, so an intercepted authorization code alone isn't enough to redeem it.",
      },
      {
        question: "What format does a SAML assertion use, in contrast to an OIDC ID token?",
        options: [
          "A binary protobuf message",
          "A plain bearer string",
          "Signed XML (XML-DSig), rather than a signed JWT",
          "An unsigned JSON object",
        ],
        correctIndex: 2,
        explanation: "SAML predates JWTs and uses signed XML assertions carried via browser redirects or form POSTs, not a JWT bearer token.",
      },
      {
        question: "Why does SAML remain common in enterprise SSO despite OIDC being the more modern default?",
        options: [
          "SAML is cryptographically stronger than OIDC",
          "OIDC cannot support enterprise use cases",
          "SAML requires no signatures at all",
          "Many legacy and vendor-provided enterprise applications were built against SAML before OIDC existed",
        ],
        correctIndex: 3,
        explanation: "SAML's continued use is driven by legacy integration requirements, not a technical advantage over OIDC — most identity providers support both.",
      },
      {
        question: "What do the iss, sub, aud, and exp claims inside an OIDC ID token represent?",
        options: [
          "Standard identity claims: issuer, subject, intended audience, and expiry — the same JWT structure covered in the JWT module",
          "A proprietary SAML extension",
          "Encryption parameters",
          "OAuth2 scope definitions",
        ],
        correctIndex: 0,
        explanation: "These are ordinary, standardized JWT claims — OIDC doesn't invent a new token format, it applies the existing JWT structure to identity.",
      },
      {
        question: "What specific problem does FIDO/WebAuthn (passkeys) solve, relative to OIDC and SAML?",
        options: [
          "It replaces OAuth2's authorization scopes",
          "How a user proves their identity to the identity provider in the first place — a different layer than propagating that identity onward",
          "It's an alternative token format to JWT",
          "It handles XML signature verification",
        ],
        correctIndex: 1,
        explanation: "FIDO and OIDC/SAML solve different layers of the same problem: FIDO is about proving identity to the IdP; OIDC/SAML are about propagating that identity onward.",
      },
      {
        question: "A user logs into an identity provider with a passkey, and the IdP then issues an OIDC ID token to a downstream app. What does the downstream app need to know about the passkey login?",
        options: [
          "The user's raw biometric data",
          "The passkey's private key",
          "Nothing — it only sees the resulting ID token, regardless of how the user originally authenticated",
          "The WebAuthn flags byte from the original login",
        ],
        correctIndex: 2,
        explanation: "The downstream app trusts the IdP's signed ID token; it never sees or needs to know the specific authentication method the IdP used.",
      },
      {
        question: "Which protocol should an identity provider use to authenticate users into a legacy platform that only understands XML-based, XML-DSig-signed assertions?",
        options: ["OAuth2", "OIDC", "FIDO", "SAML"],
        correctIndex: 3,
        explanation: "SAML is the only one of the three built around signed XML assertions rather than JSON/JWT.",
      },
      {
        question: "What is the Authorization Code flow, in OAuth2 terms?",
        options: [
          "The secure flow where the client exchanges a short-lived code for an access token, rather than receiving the token directly",
          "A deprecated flow replaced entirely by SAML",
          "A method for hashing passwords",
          "A way to bypass token expiry",
        ],
        correctIndex: 0,
        explanation: "The Authorization Code flow avoids exposing the access token directly in a redirect, instead exchanging a short-lived code for it in a separate, back-channel request.",
      },
    ],
  },
];

export function getUseCaseQuiz(slug: string): UseCaseQuiz | undefined {
  return useCaseQuizzes.find((q) => q.useCaseSlug === slug);
}
