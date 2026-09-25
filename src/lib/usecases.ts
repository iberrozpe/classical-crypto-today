import type { MathBlock, DiagramSpec, PracticeProblem, RoleId } from "@/lib/content";

export interface UseCaseSection {
  heading: string;
  body: string[];
  math?: MathBlock[];
  diagram?: DiagramSpec;
  practice?: PracticeProblem[];
  advanced?: boolean;
}

export interface UseCase {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  category: "Key Management" | "PKI & Certificates" | "Identity & Access";
  tags: RoleId[];
  relatedModules: string[];
  sections: UseCaseSection[];
}

export const useCases: UseCase[] = [
  {
    slug: "kms-envelope-encryption",
    title: "Envelope encryption: how a KMS actually protects your data",
    summary:
      "Every cloud KMS — AWS KMS, GCP Cloud KMS, Azure Key Vault, HashiCorp Vault — uses the same pattern to encrypt data without ever moving your master key. Here's why, and how it actually works.",
    minutes: 20,
    category: "Key Management",
    tags: ["developer", "architect", "itops"],
    relatedModules: ["symmetric-key-aes", "rsa-public-key", "key-derivation-functions"],
    sections: [
      {
        heading: "The problem envelope encryption solves",
        body: [
          "The obvious way to use a KMS is to send it your data and ask it to encrypt that data directly with your master key. Almost no production system actually does this, for a simple reason: a KMS's whole security model depends on the master key never leaving a tightly controlled, audited boundary (an HSM or an equivalent hardware root of trust) — but encrypting gigabytes of data one API call at a time, inside that boundary, is both slow and a poor match for what an HSM is built to do well.",
          "Envelope encryption solves this by splitting the job in two: a fast, local, symmetric key does the actual bulk encryption (using AES-GCM, covered in the AES module), and the KMS's master key is used only to encrypt that one small key — never the data itself. The master key's job shrinks to something an HSM handles extremely well: wrapping and unwrapping keys, which are always small, fixed-size, and few in number compared to the data they protect.",
        ],
      },
      {
        heading: "The pattern: a Data Key wrapped by a Key-Encryption Key",
        body: [
          "The key that actually touches your data is called a Data Encryption Key (DEK) — generated fresh, used locally, and never stored anywhere in plaintext. The key that protects the DEK is the Key-Encryption Key (KEK) — the KMS's master key, which never leaves the KMS boundary in plaintext, ever. \"Wrapping\" is just encrypting the DEK with the KEK; \"unwrapping\" is decrypting it back.",
          "What gets stored alongside your ciphertext isn't the DEK itself — it's the wrapped (encrypted) DEK. That's the entire trick: the only thing that can turn a wrapped DEK back into a usable key is the KMS holding the matching KEK, so an attacker who steals your encrypted data and its wrapped DEK together still has nothing without access to the KMS itself.",
        ],
        diagram: {
          type: "sequence",
          title: "Envelope encryption, end to end",
          steps: [
            { label: "Request a data key", detail: "The application asks the KMS to generate a new DEK for this object." },
            { label: "KMS returns two things", detail: "A plaintext DEK (used immediately, then discarded from memory) and that same DEK encrypted under the KEK — the \"wrapped\" DEK." },
            { label: "Encrypt locally", detail: "The application uses the plaintext DEK to AES-GCM-encrypt the actual data, entirely outside the KMS." },
            { label: "Store both pieces together", detail: "The ciphertext and the wrapped DEK are stored side by side — the wrapped DEK is safe to store in the clear, since only the KMS can unwrap it." },
          ],
        },
      },
      {
        heading: "Decryption: nothing readable exists until the last step",
        body: [
          "Reading the data back reverses the exact same path: the application sends the stored wrapped DEK to the KMS, which unwraps it using the KEK and returns the plaintext DEK — the KMS never sees the actual encrypted data, only the small wrapped key. The application then uses that plaintext DEK locally to AES-GCM-decrypt the object.",
          "Notice what this means for a stolen backup or a leaked storage bucket: an attacker with the ciphertext and the wrapped DEK has exactly nothing readable, because turning that wrapped DEK back into something useful requires a live call to a KMS that enforces its own access policy, logging, and (usually) a hardware boundary around the KEK itself.",
        ],
      },
      {
        heading: "What it costs: a wrapped key's size, and a KMS call's latency",
        body: [
          "Wrapping via RSA-OAEP (the padding module covers exactly why raw RSA can't do this safely) produces a ciphertext exactly the size of the KMS's RSA modulus — nothing more, nothing less, regardless of how large the original DEK was. A 4096-bit RSA KEK wrapping a 256-bit AES DEK still produces a 512-byte wrapped output, because RSA ciphertext size depends only on the modulus.",
          "The other real cost is latency: every GenerateDataKey or Decrypt call is a network round trip to the KMS, and at scale that adds up in ways worth actually computing, not just hand-waving about.",
        ],
        math: [
          { expr: "\\text{wrapped DEK size (bytes)} = \\frac{\\text{RSA modulus size in bits}}{8}" },
        ],
        practice: [
          {
            prompt: "A KMS wraps every DEK using RSA-OAEP with a 4096-bit RSA KEK. How many bytes is the resulting wrapped DEK, regardless of the DEK's own size?",
            hint: "RSA ciphertext size depends only on the modulus size, not on the size of what's being encrypted.",
            placeholder: "bytes",
            answer: "512",
            explanation: "4096 ÷ 8 = 512 bytes. This is true no matter whether the wrapped DEK is 128, 192, or 256 bits — RSA-OAEP's output is always exactly the modulus size, which is also why RSA is used to wrap a small key rather than to encrypt bulk data directly.",
          },
          {
            prompt: "A service generates a fresh DEK via a network KMS call for each of 100,000 small objects it encrypts, with each call taking 20 milliseconds and running serially (one after another). How many total seconds does that add?",
            hint: "Convert milliseconds to seconds, then multiply by the number of calls.",
            placeholder: "seconds",
            answer: "2000",
            explanation: "100,000 × 20ms = 2,000,000ms = 2,000 seconds — over half an hour of pure KMS latency for something that adds no value once you realize the DEK could instead be reused across a batch, or generated locally and only wrapped (not generated) by the KMS. This is exactly the kind of cost that pushes real systems toward caching or batching DEK generation rather than calling the KMS per object.",
          },
        ],
      },
      {
        heading: "Rotating the KEK without touching a single byte of stored data",
        body: [
          "This is the payoff for the whole design: rotating the master key normally means re-encrypting everything that key ever touched — a massive, risky, often infeasible operation at scale. Envelope encryption sidesteps it entirely. Rotating the KEK just means the KMS starts wrapping new DEKs with a new key version; every already-wrapped DEK still unwraps correctly, because the KMS keeps old key versions available for exactly this purpose. Nothing stored — not the ciphertext, not the wrapped DEK — needs to change at all.",
          "This single property is why envelope encryption, not direct master-key encryption, is the default pattern in every major cloud KMS and in tools like HashiCorp Vault's transit engine — key rotation becomes a KMS-side configuration change instead of a data migration project.",
        ],
      },
    ],
  },
  {
    slug: "kms-key-wrapping-and-exchange",
    title: "Key wrapping and key exchange: moving keys without ever exposing them",
    summary:
      "Envelope encryption covers wrapping a key with your own KMS. This is about the broader problem: getting a key from one system, person, or organization to another — without it ever existing in the clear outside a trust boundary.",
    minutes: 18,
    category: "Key Management",
    tags: ["developer", "architect", "itops"],
    relatedModules: ["symmetric-key-aes", "rsa-public-key", "diffie-hellman-key-exchange", "elliptic-curve-cryptography"],
    sections: [
      {
        heading: "Three different problems, three different tools",
        body: [
          "\"Get a key from A to B safely\" sounds like one problem, but production systems actually face three distinct versions of it, and reaching for the wrong tool is a common real-world mistake. Wrapping a key with a symmetric KEK you already share with the recipient is one tool. Transporting a key to someone you've never shared a secret with, using their public key, is a different tool. Agreeing on a fresh shared secret with someone, without ever transmitting a key at all, is a third tool entirely — and it's the Diffie-Hellman idea from earlier in this catalog, applied at the systems level.",
        ],
        diagram: {
          type: "compare",
          left: {
            title: "Symmetric key wrap (AES Key Wrap)",
            points: [
              "Requires a KEK both sides already share",
              "Fast, deterministic, no IV or nonce management needed",
              "Best when moving a key between systems already inside the same trust domain",
            ],
          },
          right: {
            title: "Asymmetric key transport (RSA-OAEP)",
            points: [
              "No pre-shared secret needed — only the recipient's public key",
              "Ciphertext size is fixed by the modulus, regardless of key size",
              "Best when sending a key to a party you've never securely communicated with before",
            ],
          },
        },
      },
      {
        heading: "AES Key Wrap: a construction built specifically for keys",
        body: [
          "RFC 3394's AES Key Wrap (AES-KW) is deliberately not \"just AES-GCM applied to a key\" — it's a dedicated construction built around the fact that key material is already high-entropy, fixed in size, and never reused as wrapping input the way ordinary plaintext might be reused. AES-KW runs the key through six rounds of an AES-based transformation together with a fixed 64-bit integrity-check value (0xA6A6A6A6A6A6A6A6), so unwrapping with the wrong KEK fails loudly and immediately rather than silently returning garbage.",
          "The practical result: AES-KW adds exactly 8 bytes of overhead to whatever it wraps, no matter the key size, and needs no IV or nonce at all — one of the few symmetric constructions in this catalog that's fully deterministic by design, because the input (a key) is guaranteed to already be unpredictable.",
        ],
        math: [
          { expr: "\\text{wrapped size (bytes)} = \\text{key size (bytes)} + 8" },
        ],
        practice: [
          {
            prompt: "A system wraps a 256-bit (32-byte) AES key using AES Key Wrap (RFC 3394). How many bytes is the wrapped output?",
            hint: "AES-KW adds a fixed 8-byte integrity-check overhead to the key size.",
            placeholder: "bytes",
            answer: "40",
            explanation: "32 + 8 = 40 bytes. That fixed 8-byte overhead holds regardless of whether the wrapped key is 128, 192, or 256 bits — it's the integrity-check value that makes unwrapping with the wrong KEK fail immediately rather than producing a corrupted key silently.",
          },
        ],
      },
      {
        heading: "Cross-boundary key import: wrapping as the actual API contract",
        body: [
          "\"Import Key Material\" flows — used when bringing an existing key into a cloud KMS, or moving one between KMS providers — are RSA-OAEP key transport in production, not a diagram: the destination KMS publishes a temporary public key and a short-lived import token, the source system wraps the key material with that public key, uploads it, and the destination KMS is the only thing able to unwrap it, using the private half it never exposed. This is exactly the asymmetric transport pattern above, just with the KMS itself as the recipient.",
        ],
      },
      {
        heading: "Key exchange: when neither side wants to transmit a key at all",
        body: [
          "Both wrapping approaches above still transmit an encrypted key. Diffie-Hellman and ECDH (covered in depth earlier in this catalog) solve a genuinely different problem: two systems derive the identical shared secret independently, without either one ever sending a key — encrypted or otherwise — across the wire. This is the pattern behind TLS's ephemeral key exchange and modern VPN tunnels, and it's the right tool whenever forward secrecy matters: if an attacker records the exchange and later compromises a long-term key, a wrapped key transported over RSA is retroactively exposed, but an ephemeral ECDH exchange leaves nothing recorded that reconstructs the session key.",
          "The trade-off is payload size versus what you get for it. An X25519 ephemeral public key (the ECDH exchange itself) is a fixed 32 bytes, no matter what security level is needed at that curve — while an RSA-wrapped key transport payload scales with the RSA modulus, which has to be far larger than 32 bytes to reach equivalent security (the key-sizes module covers exactly why).",
        ],
        practice: [
          {
            prompt: "An X25519 ephemeral public key (used in ECDH key exchange) is 32 bytes. An RSA-2048 key-transport ciphertext is 256 bytes. How many times larger is the RSA-wrapped payload?",
            hint: "Divide the RSA ciphertext size by the X25519 key size.",
            placeholder: "times larger",
            answer: "8",
            explanation: "256 ÷ 32 = 8. ECDH's compact, fixed-size exchange — plus the forward secrecy that comes from never transmitting a long-term key at all — is exactly why TLS 1.3 made ephemeral ECDHE mandatory rather than relying on RSA key transport, even though RSA transport is simpler to reason about for a one-off, non-interactive scenario like the KMS import flow above.",
          },
        ],
      },
      {
        heading: "Choosing the right pattern",
        body: [
          "In practice these three tools compose rather than compete: a TLS session uses ECDHE to agree on a session key live, a backup system uses AES Key Wrap to move a key between two services that already trust each other, and a one-time cross-organization key handoff uses RSA-OAEP transport because there's no pre-shared secret and no live session to negotiate over.",
        ],
        diagram: {
          type: "structure",
          title: "Which tool, for which job",
          blocks: [
            { label: "Already share a KEK", detail: "AES Key Wrap — fast, deterministic, minimal overhead." },
            { label: "No shared secret, one-off transfer", detail: "RSA-OAEP key transport — needs only the recipient's public key." },
            { label: "Live session, forward secrecy matters", detail: "ECDH/ECDHE key exchange — no key ever transmitted, encrypted or otherwise." },
          ],
        },
      },
    ],
  },
  {
    slug: "pkcs11-cryptographic-tokens",
    title: "PKCS#11: the standard behind every HSM and smart card",
    summary:
      "Wrapping and unwrapping keys, covered so far, all happens somewhere. PKCS#11 is the standard interface that lets an application talk to that somewhere — an HSM, a smart card, a USB token — without caring which vendor built it.",
    minutes: 24,
    category: "Key Management",
    tags: ["developer", "architect", "itops", "researcher"],
    relatedModules: ["symmetric-key-aes", "rsa-public-key", "rsa-padding-oaep-pkcs1"],
    sections: [
      {
        heading: "The PKCS family: one numbered standard per job",
        body: [
          "PKCS — the Public-Key Cryptography Standards — is a set of specifications originally published by RSA Laboratories starting in 1991, most of which now live on as IETF RFCs or OASIS standards. Each one solves one specific, narrow interoperability problem: how to format an RSA key, how to bundle a certificate with its private key, how to ask a hardware token to sign something. You'll run into several of these by name without necessarily knowing it — a browser's \"Export as .p12\" button, for instance, is PKCS#12.",
          "This use case focuses on one member of that family in depth — PKCS#11 — because it's the one that governs how software talks to physical security hardware, which is a different kind of problem than the others: not a file format, but a live, stateful API.",
        ],
        diagram: {
          type: "structure",
          title: "The PKCS family, briefly",
          blocks: [
            { label: "PKCS#1", detail: "RSA encryption and signature padding (RSAES-OAEP, RSASSA-PSS) — covered in the RSA module." },
            { label: "PKCS#3", detail: "Diffie-Hellman key agreement parameters." },
            { label: "PKCS#5 / #12", detail: "Password-based key derivation (PBKDF2), and bundling a cert + private key into one password-protected file (.p12/.pfx)." },
            { label: "PKCS#7 / CMS", detail: "Cryptographic Message Syntax — signed and enveloped data, the format behind S/MIME and most code-signing." },
            { label: "PKCS#8", detail: "A standard syntax for storing a private key, with or without encryption." },
            { label: "PKCS#9", detail: "Extra attribute types usable inside other PKCS structures (e.g. a certificate request's extensions)." },
            { label: "PKCS#10", detail: "Certificate Signing Request (CSR) syntax — covered in the PKI use case." },
            { label: "PKCS#11", detail: "\"Cryptoki\" — a vendor-neutral API for talking to hardware security tokens (this use case)." },
            { label: "PKCS#15", detail: "A standard way to organize keys and certificates on a token, layered on top of PKCS#11." },
          ],
        },
      },
      {
        heading: "The problem PKCS#11 actually solves",
        body: [
          "Before PKCS#11 (first published in 1995, now maintained by OASIS as version 3.0), every hardware security module and smart card vendor shipped its own proprietary API. An application that wanted to use a Thales HSM, a Luna HSM, and a Gemalto smart card needed three separate integrations — and swapping a hardware vendor meant rewriting the integration, not just reconfiguring it.",
          "PKCS#11 — formally titled \"Cryptographic Token Interface\" and nicknamed Cryptoki (\"cryptographic token interface,\" pronounced \"crypto-key\") — fixes this by standardizing the API itself: a fixed set of C function calls (C_GenerateKeyPair, C_Sign, C_WrapKey, and so on) that every conforming token exposes identically, regardless of what's actually inside the box. An application written against Cryptoki works against any PKCS#11-compliant token without modification. This is exactly why AWS CloudHSM, Azure Dedicated HSM, Google Cloud HSM, and on-premises HSMs from Thales and Entrust all expose a PKCS#11 interface as one of their supported integration paths.",
        ],
      },
      {
        heading: "The object model: slots, sessions, and objects",
        body: [
          "Cryptoki organizes everything around four concepts that stay the same across every implementation. A slot is a logical socket — a smart card reader, or a virtual slot on an HSM appliance. A token is the actual security device sitting in that slot, holding keys and certificates. A session is a connection an application opens to a token, roughly like a database connection, which carries a login state (public, or authenticated as a regular user or a security officer). And an object is anything the token stores and hands back a reference to — a key, a certificate, or arbitrary data — identified by an opaque handle, never by its raw value.",
          "That last point is the whole security model in one sentence: an application never receives the actual bytes of a private or secret key. It receives a handle — an integer — and asks the token to perform operations (sign, decrypt, wrap) using the key that handle refers to. The key material itself never has to leave the hardware boundary at all.",
        ],
        diagram: {
          type: "structure",
          title: "Cryptoki's object hierarchy",
          blocks: [
            { label: "Slot", detail: "A logical socket for a token — a card reader, or a virtual slot on an HSM appliance." },
            { label: "Token", detail: "The actual security hardware in that slot, holding objects and enforcing a login state." },
            { label: "Session", detail: "An application's open connection to a token — logged out, CKU_USER, or CKU_SO (security officer)." },
            { label: "Object", detail: "A key, certificate, or data item on the token, referenced only by an opaque handle — never by its raw value." },
          ],
        },
      },
      {
        heading: "A typical session, function by function",
        body: [
          "Every Cryptoki interaction follows the same rough shape, whether the token is a $10 USB key or a rack-mounted HSM protecting a bank's signing keys. The Playground's PKCS#11 tool below runs a real version of exactly this sequence — using actual Web Crypto operations standing in for the hardware token.",
        ],
        diagram: {
          type: "sequence",
          title: "Signing something with a token-resident key",
          steps: [
            { label: "C_OpenSession", detail: "The application opens a session against a slot's token." },
            { label: "C_Login", detail: "Authenticates the session as CKU_USER, unlocking access to private/secret objects (public objects are readable even logged out)." },
            { label: "C_GenerateKeyPair", detail: "The token generates a key pair internally and returns two handles — the private key never exists outside the token." },
            { label: "C_SignInit / C_Sign", detail: "The application asks the token to sign data using the private key's handle; only the signature comes back." },
            { label: "C_CloseSession", detail: "The session ends. Nothing sensitive was ever transmitted in the clear." },
          ],
        },
      },
      {
        heading: "Attributes: the access-control layer on every object",
        body: [
          "Every object carries a set of attributes (named CKA_*) that control what can be done with it, enforced by the token itself — not by the calling application, which is exactly the point. Two matter most for security: CKA_SENSITIVE, which means the value can never be read back in the clear once set, and CKA_EXTRACTABLE, which controls whether the key can ever leave the token at all (even wrapped). A private signing key on a well-configured token is created with CKA_SENSITIVE = true and CKA_EXTRACTABLE = false: it can be used to sign, forever, but it can never be exported — not by the application, not by an administrator, not even by the vendor.",
          "This maps directly onto something you've already used: the Web Crypto API's own generateKey takes an `extractable` boolean, for exactly the same reason. Setting it to false on a private key means the browser itself will refuse to export or wrap that key — real enforcement, not a label. The Playground tool below relies on this directly.",
        ],
        practice: [
          {
            prompt: "A token-resident RSA private key is created with CKA_SENSITIVE = true and CKA_EXTRACTABLE = false. An administrator with full physical access to the HSM appliance wants to copy that key onto a second HSM for backup. Can they extract it in the clear via the PKCS#11 API?",
            hint: "CKA_EXTRACTABLE controls whether the key can ever leave the token in any form, including wrapped.",
            placeholder: "yes or no",
            answer: "no",
            explanation: "No — CKA_EXTRACTABLE = false means the API will refuse every operation that would let the key leave the token, including C_WrapKey. This is by design: it's what lets an organization credibly claim a key exists in exactly one place. (Real HSMs do offer separate, more tightly controlled cloning mechanisms for legitimate backup between paired devices — but the ordinary PKCS#11 API surface is not one of them.)",
          },
        ],
      },
      {
        heading: "Where you've already used PKCS#11 without knowing it",
        body: [
          "A government PIV or CAC smart card authenticating you to a workstation, a YubiKey holding an SSH or code-signing key, a browser's client-certificate login to a corporate VPN, a certificate authority's root key living in an HSM instead of a file — all of these typically go through a PKCS#11 module under the hood. Windows' CNG and macOS's Keychain both support loading third-party PKCS#11 providers; OpenSSL, Java's JCA, and most CA software (like step-ca or EJBCA) support it natively as a plug-in backend for exactly this reason: it's the one integration path that works across HSM vendors without rewriting anything.",
        ],
      },
      {
        heading: "When the API itself is the vulnerability",
        body: [
          "Cryptoki's attribute model is only as strong as how a given deployment actually assigns attributes — and a well-documented class of attacks, first formalized by Jolyon Clulow in 2003, shows what goes wrong when a single key is given two capabilities that should never coexist. The classic case: a symmetric key configured with both CKA_WRAP and CKA_DECRYPT set to true.",
          "C_WrapKey, in its simplest mechanisms (like CKM_AES_CBC_PAD), does nothing more exotic than encrypt the target key's raw bytes with the wrapping key. If that same wrapping key also has decrypt rights, an attacker who can merely call the API — with no need to touch the token's internals — can wrap a sensitive, non-extractable key, then immediately call C_Decrypt on the very blob C_WrapKey just produced, using the identical key and mechanism. The token faithfully decrypts it, and out comes the \"non-extractable\" key's raw bytes in the clear. CKA_SENSITIVE and CKA_EXTRACTABLE never came into play at all — the attacker never asked the token to export the target key, only to wrap it and then separately decrypt something.",
          "The fix is a discipline, not a patch: wrapping keys should carry CKA_WRAP (or CKA_UNWRAP) and nothing else — never CKA_ENCRYPT/CKA_DECRYPT on the same key object. Every serious HSM vendor's hardening guide says this explicitly today, precisely because so many real deployments got it wrong before the attack class was widely known. The Challenges section has a hands-on version of this exact attack — recovering a \"sensitive\" key by exploiting a wrapping key that was also left with decrypt rights.",
          "Try it yourself in the Playground below: generating a signing key pair with the private key's extractable flag set to false, then watching a real wrapKey() call on that handle fail — the same refusal a correctly configured token gives, for the same reason.",
        ],
        advanced: true,
        practice: [
          {
            prompt: "A token has an AES key with CKA_WRAP = true and CKA_DECRYPT = true (the misconfiguration). An attacker legitimately calls C_WrapKey to wrap a separate, non-extractable AES key they want to steal. What PKCS#11 function do they call next to recover it in the clear?",
            hint: "The wrapping key's OTHER enabled capability is what makes this attack possible.",
            placeholder: "C_ function name",
            answer: "C_Decrypt",
            explanation: "C_Decrypt (after C_DecryptInit) — using the same wrapping key and mechanism used to produce the wrapped blob. Since simple wrap mechanisms like CKM_AES_CBC_PAD are just encryption, decrypting the wrapped blob with the same key that wrapped it recovers the target key's raw bytes directly, completely bypassing CKA_SENSITIVE and CKA_EXTRACTABLE on the target key.",
          },
        ],
      },
    ],
  },
  {
    slug: "pki-in-production",
    title: "Running a PKI: how a certificate authority actually operates",
    summary:
      "The X.509 module covers what's inside one certificate and how a chain verifies. This is the other half: how an organization actually runs the CA hierarchy that issues, automates, and eventually retires millions of them.",
    minutes: 20,
    category: "PKI & Certificates",
    tags: ["architect", "itops", "grc"],
    relatedModules: ["digital-certificates-x509", "hash-functions-and-signatures", "key-sizes-and-security-levels"],
    sections: [
      {
        heading: "From one certificate to an operating hierarchy",
        body: [
          "Understanding what fields sit inside a certificate, and how a chain of signatures walks back to a trusted root, is the X.509 module's job. This use case is the operational layer on top: how a real organization generates, protects, and rotates the keys that make that whole chain trustworthy in the first place — decisions that show up as concrete, auditable practices, not just protocol fields.",
        ],
      },
      {
        heading: "Why the root stays offline",
        body: [
          "A root CA's private key is the single highest-value target in the entire hierarchy: compromise it, and every certificate that chains back to it — potentially the trust anchor for an entire browser or operating system's certificate store — is suspect at once. Production CAs respond by keeping the root key air-gapped: generated once, used rarely (mainly to sign new intermediate certificates), and stored offline in a vault-controlled hardware security module that never touches a network.",
          "Day-to-day certificate issuance runs through intermediate CAs instead, whose keys are online and actively used but individually far less catastrophic if compromised — an intermediate can simply be revoked and replaced by the still-safe offline root, exactly the blast-radius containment the root/intermediate split exists to provide.",
        ],
        diagram: {
          type: "compare",
          left: {
            title: "Root CA",
            points: [
              "Kept offline, air-gapped, in an HSM",
              "Used only rarely — mainly to sign intermediate certificates",
              "Compromise is catastrophic: every downstream certificate is suspect",
            ],
          },
          right: {
            title: "Intermediate CA",
            points: [
              "Online, used continuously for day-to-day issuance",
              "Compromise is serious but contained — revoke it, and the root signs a replacement",
              "This containment is the entire reason the split exists",
            ],
          },
        },
      },
      {
        heading: "Key ceremonies: generating a root key under audit",
        body: [
          "Because a root key's entire security rests on never being exposed even once, generating one isn't a routine engineering task — it's a scripted, multi-party \"key ceremony,\" typically video-recorded and independently audited, where the HSM generates the key internally (it never exists outside the hardware boundary, even during creation) and multiple trusted individuals must jointly authorize any sensitive operation, echoing the threshold-of-trust idea from the Shamir's Secret Sharing use case elsewhere in this catalog.",
        ],
        advanced: true,
        practice: [
          {
            prompt: "A root CA's offline signing key requires 3 of 5 authorized ceremony participants to jointly authorize any use, following a Shamir threshold scheme. During a scheduled ceremony, 2 of the 5 participants are unreachable. Can the ceremony proceed with the 3 who are present?",
            hint: "Compare the number of available participants to the threshold k.",
            placeholder: "yes or no",
            answer: "yes",
            explanation: "3 of 5 exactly meets the threshold k = 3, so the ceremony can proceed — this is precisely the point of a (k, n)-threshold scheme: it tolerates up to n − k = 2 absent participants while still requiring genuine multi-party agreement, never a single individual acting alone.",
          },
        ],
      },
      {
        heading: "Automated issuance: the ACME protocol",
        body: [
          "Manual certificate issuance doesn't scale to the volume the modern web needs, which is exactly the gap ACME (RFC 8555, the protocol behind Let's Encrypt) closes: a server proves it controls a domain by completing an automated challenge — serving a specific file over HTTP (HTTP-01), publishing a specific DNS record (DNS-01), or presenting a specific value during the TLS handshake itself (TLS-ALPN-01) — and once that challenge passes, a certificate is issued and can be renewed automatically before it ever expires, with no human involved.",
        ],
        diagram: {
          type: "sequence",
          title: "ACME domain validation and issuance",
          steps: [
            { label: "Client requests a certificate", detail: "An ACME client (like Certbot or a built-in load-balancer integration) asks the CA for a certificate for a domain." },
            { label: "CA issues a challenge", detail: "The CA asks the client to prove control of the domain via HTTP-01, DNS-01, or TLS-ALPN-01." },
            { label: "Client completes the challenge", detail: "The client publishes the required file, DNS record, or TLS response." },
            { label: "CA verifies and issues", detail: "The CA checks the challenge, signs the certificate, and the client installs it — all without a human in the loop." },
          ],
        },
      },
      {
        heading: "Shrinking lifetimes are forcing this automation industry-wide",
        body: [
          "The X.509 module's \"shift to short-lived certificates\" section covers why lifetimes keep shrinking; the operational consequence is that manual issuance is no longer a viable option at any scale. The CA/Browser Forum's maximum publicly-trusted certificate validity has already dropped from 398 days to 200 days as of March 2026, is scheduled to fall to 100 days in March 2027, and to just 47 days by March 2029 — figures set on a fixed public timeline, not a rough trend.",
          "Let's Encrypt has run at 90-day certificates since it launched in 2015, specifically to force automation from day one: with ACME renewal running on a schedule (commonly renewing at roughly the two-thirds mark for safety margin), a domain renews on the order of six times a year, entirely invisibly to whoever operates it.",
        ],
        practice: [
          {
            prompt: "By the CA/Browser Forum's March 2029 target, the maximum certificate validity will be 47 days. Rounding up to the nearest whole renewal, how many times must a continuously-running domain renew its certificate to cover one 365-day year?",
            hint: "Divide 365 by 47, then round up to the next whole number — a partial cycle still needs a full renewal.",
            placeholder: "renewals per year",
            answer: "8",
            explanation: "365 ÷ 47 ≈ 7.77, which rounds up to 8 renewals per year (7 renewals only cover 7 × 47 = 329 days, short of a full year). At that cadence, manual issuance isn't merely inconvenient — it's operationally impossible at any real scale, which is exactly the pressure driving ACME and equivalent automation into every serious TLS deployment.",
          },
        ],
      },
    ],
  },
  {
    slug: "federated-identity-oauth-oidc-saml",
    title: "Federated identity: OAuth2, OIDC, and SAML, untangled",
    summary:
      "\"Just use OAuth\" conflates three different standards solving three different problems. Here's what each one actually does, how they relate to the JWTs you already know, and where passkeys fit in.",
    minutes: 20,
    category: "Identity & Access",
    tags: ["developer", "architect", "itops"],
    relatedModules: ["jwt-and-api-auth", "hash-functions-and-signatures", "passkeys-webauthn"],
    sections: [
      {
        heading: "Three layers that get conflated into one word",
        body: [
          "\"OAuth\" gets used as a catch-all in a way that hides three genuinely separate problems. OAuth2 is an authorization framework — it answers \"can this application act on my behalf, with this specific scope of access,\" and by itself says nothing about who the user actually is. OIDC (OpenID Connect) is an authentication layer built directly on top of OAuth2, adding the piece OAuth2 deliberately left out: proof of identity. SAML is a separate, older standard that solves authentication and single sign-on a structurally different way, using signed XML instead of JWTs.",
        ],
      },
      {
        heading: "OAuth2: delegated authorization, not identity",
        body: [
          "When an app asks to \"access your Google Contacts,\" that's OAuth2: the user grants a scoped, revocable permission, and the app receives an access token proving it holds that permission — typically the same kind of bearer JWT covered in the JWT & API auth module, though OAuth2 itself doesn't require any particular token format. The secure flow for this is the Authorization Code flow, and for any client that can't safely hold a secret (a mobile app, a single-page app), it's extended with PKCE (Proof Key for Code Exchange): the client generates a random secret locally and proves possession of it at the token-exchange step, so an attacker who intercepts the authorization code in transit still can't redeem it without that locally-held secret.",
          "Critically, none of this tells the app who the user is — only what the app is now allowed to do. That gap is exactly what OIDC exists to close.",
        ],
        practice: [
          {
            prompt: "A mobile app implements OAuth2's Authorization Code flow but, as a public client, can't securely store a client secret. Which OAuth2 extension should it use so an intercepted authorization code can't be redeemed by an attacker?",
            hint: "It involves the client generating and later proving possession of a locally-held secret, without ever storing a long-term credential.",
            placeholder: "extension name",
            answer: "PKCE",
            explanation: "PKCE (Proof Key for Code Exchange) has the client generate a random \"code verifier,\" send a hashed \"code challenge\" derived from it when starting the flow, and later present the original verifier when exchanging the authorization code for a token — an attacker who only intercepts the code, without the verifier, can't complete the exchange.",
          },
        ],
      },
      {
        heading: "OIDC: OAuth2 plus a signed proof of identity",
        body: [
          "OIDC adds exactly one new thing on top of OAuth2: the ID token, a JWT — always signed, always following the exact structure covered in the JWT & API auth module — carrying standardized identity claims (sub for the user's stable identifier, iss for who issued it, aud for who it's intended for, exp for expiry). Because it's a normal JWT, everything already covered about verifying signatures, reading (not trusting) the payload, and algorithm-confusion pitfalls applies directly here without needing to be re-explained.",
        ],
        practice: [
          {
            prompt: "An OIDC ID token is issued with iat (issued-at, Unix timestamp) = 1700000000 and a validity window of exactly 3600 seconds (1 hour). What is the exp claim's value?",
            hint: "exp = iat + validity window, in seconds.",
            placeholder: "exp value",
            answer: "1700003600",
            explanation: "1,700,000,000 + 3,600 = 1,700,003,600. This is the same exp claim mechanic covered in the JWT module, applied specifically to an OIDC ID token rather than a generic API bearer token — the claim format doesn't change, only what the token is being used to prove.",
          },
        ],
      },
      {
        heading: "SAML: the XML-based predecessor, still very much in production",
        body: [
          "SAML solves the same core problem as OIDC — proving a user's identity to a service they haven't directly authenticated with — but predates JWTs, and does it with signed XML assertions instead: an Identity Provider (IdP) produces a SAML assertion, cryptographically signed using XML-DSig, and the browser carries it to the Service Provider (SP) via a redirect or an auto-submitting form POST, rather than the bearer-token-in-a-header pattern OAuth2/OIDC use.",
          "SAML hasn't disappeared — it remains the default for a large share of enterprise SSO, particularly for older or vendor-provided enterprise applications that were built against it long before OIDC existed, which is why identity providers like Okta and Azure AD support both protocols side by side rather than one replacing the other outright.",
        ],
        diagram: {
          type: "compare",
          left: {
            title: "OIDC",
            points: [
              "Identity carried in a signed JWT (the ID token)",
              "Built on OAuth2's redirect + token-exchange model",
              "The modern default for consumer apps, mobile, and API-first architectures",
            ],
          },
          right: {
            title: "SAML",
            points: [
              "Identity carried in a signed XML assertion (XML-DSig)",
              "Uses browser redirects or auto-submitting form POSTs, not a token-exchange API call",
              "Still the default for much legacy and vendor-provided enterprise SSO",
            ],
          },
        },
      },
      {
        heading: "Where a legacy system forces the choice",
        body: [
          "In practice the decision is often made for you by what the other side actually understands.",
        ],
        practice: [
          {
            prompt: "A company's legacy HR platform only understands XML-based SSO assertions signed with XML-DSig — it has no support for JSON-based tokens at all. Which protocol should the identity provider use to authenticate users into it: OAuth2, OIDC, or SAML?",
            hint: "Match the protocol to the token format the legacy system actually understands.",
            placeholder: "protocol",
            answer: "SAML",
            explanation: "SAML is the only one of the three built around signed XML assertions rather than JSON/JWT — OAuth2 and OIDC both center on JWTs, which this legacy platform can't parse at all. This is exactly the kind of constraint that keeps SAML in production long after most new integrations default to OIDC.",
          },
        ],
      },
      {
        heading: "Where FIDO and passkeys fit — a different layer entirely",
        body: [
          "It's worth being precise about what FIDO/WebAuthn (covered in the Passkeys module) actually replaces here, because it's easy to conflate with OIDC or SAML: FIDO solves how a user proves their identity to the identity provider in the first place — replacing a password with a signed challenge-response — while OIDC and SAML solve a separate problem, how that already-established identity gets propagated from the IdP to other applications. The two compose rather than compete: a user might log into Okta using a passkey, and Okta then issues an OIDC ID token (or a SAML assertion) to every downstream application that trusts it, without any of those downstream apps ever knowing or caring that a passkey was involved.",
        ],
      },
    ],
  },
];

export function getUseCase(slug: string): UseCase | undefined {
  return useCases.find((u) => u.slug === slug);
}
