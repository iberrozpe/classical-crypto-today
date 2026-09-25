import type { QuizQuestion } from "@/lib/quiz";

export interface StandardsQuiz {
  bodySlug: string;
  questions: QuizQuestion[];
}

export const standardsQuizzes: StandardsQuiz[] = [
  {
    bodySlug: "nist",
    questions: [
      {
        question: "What is a FIPS document, in relation to an SP 800 document?",
        options: [
          "FIPS is mandatory for US federal systems and specifies algorithms; SP 800 is guidance on how to use them",
          "They're two names for the same thing",
          "SP 800 is mandatory; FIPS is optional guidance",
          "FIPS covers hardware only; SP 800 covers software only",
        ],
        correctIndex: 0,
        explanation: "A FIPS (Federal Information Processing Standard) is mandatory for US federal systems and is where algorithms like AES and SHA live. SP 800 documents are guidance — how to use those algorithms and manage keys safely.",
      },
      {
        question: "Why did NIST run open, multi-year public competitions for AES, SHA-3, and the post-quantum standards instead of designing them internally?",
        options: [
          "It was legally required to",
          "A design that survives years of public attack by the world's cryptography community is a far stronger trust signal than one reviewed only behind closed doors",
          "It was cheaper than hiring cryptographers",
          "No other standards body had ever tried a competition before",
        ],
        correctIndex: 1,
        explanation: "The open competition model lets the entire research community attack every candidate publicly for years — exactly the kind of scrutiny that closed-door design can't replicate, and part of why the resulting standards are trusted globally, not just within the US government.",
      },
      {
        question: "Which FIPS document defines AES?",
        options: ["FIPS 140-3", "FIPS 186-5", "FIPS 197", "FIPS 202"],
        correctIndex: 2,
        explanation: "FIPS 197, published in 2001 after the AES competition selected Rijndael.",
      },
      {
        question: "Why did NIST standardize SHA-3, given that SHA-2 was never actually broken?",
        options: [
          "SHA-2 was too slow",
          "As a structural hedge — a backup hash function built on a fundamentally different internal design, ready in case SHA-2 were ever broken the way SHA-1 was",
          "SHA-3 was required by a new law",
          "SHA-2 had a licensing problem",
        ],
        correctIndex: 1,
        explanation: "SHA-3 (Keccak) uses a sponge construction, structurally different from SHA-2's design — a deliberate hedge so a future break in SHA-2's family wouldn't leave NIST without an already-standardized, structurally independent alternative.",
      },
      {
        question: "What threat do FIPS 203, 204, and 205 (finalized in 2024) respond to?",
        options: [
          "Side-channel timing attacks",
          "Weak random number generation",
          "A future quantum computer running Shor's algorithm, which would break RSA, Diffie-Hellman, and ECC's underlying math",
          "Password reuse across services",
        ],
        correctIndex: 2,
        explanation: "These are NIST's post-quantum standards (ML-KEM, ML-DSA, SLH-DSA) — a response to Shor's algorithm, which would efficiently solve the factoring and discrete-log problems that RSA, Diffie-Hellman, and ECC all depend on.",
      },
      {
        question: "What made the Dual_EC_DRBG situation different from an algorithm simply being broken by a new cryptanalytic technique?",
        options: [
          "It was too slow for practical use",
          "The concern was a plausible built-in backdoor via unexplained constants in the algorithm's own design, not a flaw discovered through later analysis",
          "It only affected one specific hardware vendor",
          "It was never actually published as a standard",
        ],
        correctIndex: 1,
        explanation: "Dual_EC_DRBG's published constants could plausibly have been chosen by whoever selected them to allow predicting its output — a suspected backdoor built into the design itself, confirmed as credible by the 2013 Snowden disclosures.",
      },
      {
        question: "What did NIST do once the Dual_EC_DRBG concerns were confirmed?",
        options: [
          "Nothing changed",
          "Withdrew its recommendation and later formally removed the algorithm from SP 800-90A",
          "Replaced it with a faster but equally opaque algorithm",
          "Sued the researchers who found the issue",
        ],
        correctIndex: 1,
        explanation: "NIST withdrew its recommendation within months of the 2013 disclosures and later formally removed Dual_EC_DRBG from the SP 800-90A standard.",
      },
      {
        question: "Which document defines AES-GCM as a block cipher mode of operation?",
        options: ["FIPS 197", "SP 800-38D", "SP 800-90A", "FIPS 186-5"],
        correctIndex: 1,
        explanation: "SP 800-38D specifically defines GCM within NIST's broader SP 800-38 series covering block cipher modes of operation.",
      },
      {
        question: "How many candidates were submitted in round one of the AES competition, and how many became finalists?",
        options: ["5 submitted, 2 finalists", "15 submitted, 5 finalists", "30 submitted, 10 finalists", "3 submitted, 3 finalists"],
        correctIndex: 1,
        explanation: "15 candidates were submitted in round one; five (MARS, RC6, Rijndael, Serpent, Twofish) became finalists, with Rijndael ultimately selected.",
      },
      {
        question: "What does SP 800-57 provide that this site's Compare page draws directly from?",
        options: [
          "A list of banned algorithms",
          "The key-size/security-level equivalence table",
          "A certification exam",
          "A list of approved vendors",
        ],
        correctIndex: 1,
        explanation: "SP 800-57 is NIST's key management guidance, including the equivalence table mapping key sizes across algorithms (e.g. RSA vs. ECC) to comparable security levels.",
      },
    ],
  },
  {
    bodySlug: "ietf",
    questions: [
      {
        question: "What does \"rough consensus and running code\" mean in IETF culture?",
        options: [
          "A formal vote among national delegations",
          "General agreement among people who did the work, ideally backed by a working implementation, rather than a formal vote",
          "Whatever the IESG chair personally decides",
          "A majority vote of all IETF members",
        ],
        correctIndex: 1,
        explanation: "The IETF has no formal voting membership. Decisions reflect rough consensus among active participants, ideally validated by a real, working implementation — not a ballot.",
      },
      {
        question: "How long can an Internet-Draft go without an update before it expires?",
        options: ["6 months", "2 years", "It never expires", "30 days"],
        correctIndex: 0,
        explanation: "Internet-Drafts expire automatically after 6 months without an update — and are explicitly not standards, whether or not they've expired.",
      },
      {
        question: "What does it mean when a new RFC \"obsoletes\" an older one?",
        options: [
          "The old RFC number is deleted and reused",
          "The old RFC's text is edited in place",
          "A new RFC is published that supersedes the old one; the old RFC's number and text remain unchanged, just no longer current",
          "The old RFC becomes an Internet-Draft again",
        ],
        correctIndex: 2,
        explanation: "RFC numbers are permanent and never reused. A newer spec obsoletes an older one by explicitly saying so; the old document's text never changes, it simply stops being the current standard.",
      },
      {
        question: "RFC 8017 (PKCS#1 v2.2) obsoletes which earlier RFC?",
        options: ["RFC 9846", "RFC 3447", "RFC 6749", "RFC 5280"],
        correctIndex: 1,
        explanation: "RFC 8017 (2016) obsoletes RFC 3447 (PKCS#1 v2.1, 2003), which itself obsoleted RFC 2437 — three RFC numbers tracking one continuously evolving specification.",
      },
      {
        question: "Which IETF working group produced RFC 9846, the TLS 1.3 specification?",
        options: ["LAMPS WG", "OAuth WG", "TLS WG", "JOSE WG"],
        correctIndex: 2,
        explanation: "The TLS working group is responsible for RFC 9846 and its predecessors, covered in the TLS in Practice module.",
      },
      {
        question: "Which RFC defines the X.509 certificate profile used across TLS and PKI?",
        options: ["RFC 6749", "RFC 5280", "RFC 7519", "RFC 4253"],
        correctIndex: 1,
        explanation: "RFC 5280, from the LAMPS working group, is the PKIX certificate and CRL profile covered in the Digital Certificates & X.509 module.",
      },
      {
        question: "What does RFC 2119 define?",
        options: [
          "The TLS handshake",
          "The X.509 certificate format",
          "What MUST, SHOULD, and MAY mean inside other RFCs that use those capitalized words",
          "The JWT token format",
        ],
        correctIndex: 2,
        explanation: "RFC 2119, itself a Best Current Practice (BCP) document, defines the precise meaning of MUST/SHOULD/MAY and similar keywords used throughout the rest of the RFC series.",
      },
      {
        question: "Is every published RFC a mandatory Internet standard?",
        options: [
          "Yes, publication as an RFC always means mandatory",
          "No — RFCs span Standards Track, Informational, Experimental, and BCP categories, each with different weight",
          "Only if approved by ISO",
          "Only Experimental RFCs are mandatory",
        ],
        correctIndex: 1,
        explanation: "RFCs are published across several categories with different meanings — Standards Track, Informational, Experimental, and Best Current Practice (BCP) — not all of which prescribe mandatory behavior.",
      },
      {
        question: "Who approves an Internet-Draft for publication as an RFC?",
        options: ["ISO/IEC JTC 1", "The IESG (Internet Engineering Steering Group)", "NIST", "The original draft's author, unilaterally"],
        correctIndex: 1,
        explanation: "The IESG signs off on publication after working group review and revision are complete.",
      },
      {
        question: "Which RFC defines OAuth 2.0?",
        options: ["RFC 6749", "RFC 7519", "RFC 9846", "RFC 4253"],
        correctIndex: 0,
        explanation: "RFC 6749 is the OAuth 2.0 Authorization Framework, from the OAuth working group — RFC 7519 is JWT, a related but separate specification.",
      },
    ],
  },
  {
    bodySlug: "iso-iec",
    questions: [
      {
        question: "How does ISO/IEC's membership structure differ from NIST's or the IETF's?",
        options: [
          "ISO/IEC has no members at all",
          "ISO/IEC's members are national standards bodies, each representing their own country, unlike NIST (one government agency) or the IETF (open individual participation)",
          "ISO/IEC only allows corporate members",
          "There's no real difference",
        ],
        correctIndex: 1,
        explanation: "ISO/IEC standards are developed by consensus among national standards bodies like ANSI (US), BSI (UK), and DIN (Germany) — a federation model distinct from a single agency or open individual participation.",
      },
      {
        question: "What's the practical difference most people notice between ISO/IEC standards and NIST/IETF documents?",
        options: [
          "ISO/IEC standards are typically sold for a fee; NIST and IETF documents are free",
          "ISO/IEC standards are shorter",
          "NIST documents require a paid license too",
          "There's no practical difference",
        ],
        correctIndex: 0,
        explanation: "ISO/IEC standards are typically sold per document, unlike NIST's FIPS/SP 800 series and IETF RFCs, which are freely published — a real friction point for teams needing the exact cited spec.",
      },
      {
        question: "Which ISO/IEC technical committee covers cryptography and IT security?",
        options: ["JTC 1/SC 27", "TC 176", "SC 7", "TC 68"],
        correctIndex: 0,
        explanation: "ISO/IEC JTC 1/SC 27 is the joint ISO/IEC subcommittee responsible for security techniques, including cryptographic algorithm standards.",
      },
      {
        question: "What does ISO/IEC 18033 cover?",
        options: ["Digital signatures", "Encryption algorithms — general model, asymmetric, block, and stream ciphers", "ISMS certification", "Hash functions"],
        correctIndex: 1,
        explanation: "ISO/IEC 18033 (parts 1–4) covers encryption algorithms, including AES as part 3's block cipher coverage.",
      },
      {
        question: "What is ISO/IEC 27001 a standard for?",
        options: [
          "A specific hash function",
          "An Information Security Management System (ISMS) — policies, risk management, and process controls",
          "A block cipher mode of operation",
          "A digital signature algorithm",
        ],
        correctIndex: 1,
        explanation: "27001 certifies an organization's ISMS — the standard behind most \"ISO 27001 certified\" badges on vendor trust-center pages, distinct from any single algorithm.",
      },
      {
        question: "What is the international counterpart to NIST's FIPS 140-3 cryptographic module validation program?",
        options: ["ISO/IEC 27001", "ISO/IEC 19790 and 24759", "ISO/IEC 18033", "ISO/IEC 9797"],
        correctIndex: 1,
        explanation: "ISO/IEC 19790 specifies security requirements for cryptographic modules, with 24759 covering how to test them — the international equivalent of the FIPS 140-3 program.",
      },
      {
        question: "What does ISO/IEC 15408 (Common Criteria) provide?",
        options: [
          "A framework for evaluating IT security products, the basis for \"Common Criteria certified\" hardware and software",
          "A hash function specification",
          "A block cipher standard",
          "A password policy standard",
        ],
        correctIndex: 0,
        explanation: "ISO/IEC 15408 is the Common Criteria for Information Technology Security Evaluation, the framework behind Common Criteria certification (e.g. \"EAL4+\") seen on HSMs and smart cards.",
      },
      {
        question: "AES is standardized as both FIPS 197 and which ISO/IEC number?",
        options: ["ISO/IEC 27001", "ISO/IEC 18033-3", "ISO/IEC 15408", "ISO/IEC 9797-1"],
        correctIndex: 1,
        explanation: "AES appears as ISO/IEC 18033-3 (block ciphers) — the same algorithm as FIPS 197, standardized separately for a different regulatory audience.",
      },
      {
        question: "Why does the same algorithm sometimes get standardized by both NIST and ISO/IEC?",
        options: [
          "The two bodies compete and refuse to cooperate",
          "ISO/IEC frequently adopts NIST's already-public, already-reviewed work for international/regulatory contexts that specifically require an ISO/IEC citation",
          "It's a clerical accident",
          "NIST requires it by law",
        ],
        correctIndex: 1,
        explanation: "Rather than duplicating cryptanalysis, ISO/IEC often formally adopts NIST's already-reviewed algorithms, giving them an internationally recognized number for regulatory contexts outside the US.",
      },
      {
        question: "What does ISO/IEC 9797 cover?",
        options: ["Message Authentication Code (MAC) algorithms", "Digital certificates", "Random number generation", "TLS handshakes"],
        correctIndex: 0,
        explanation: "ISO/IEC 9797 (parts 1–3) covers MAC algorithms — the international counterpart to the MAC guidance found in NIST's SP 800 series.",
      },
    ],
  },
  {
    bodySlug: "oasis",
    questions: [
      {
        question: "How is OASIS structured, compared to NIST or ISO/IEC?",
        options: [
          "A single government agency",
          "A federation of national bodies",
          "A member-driven nonprofit consortium, with standards developed in member-run Technical Committees",
          "An informal open mailing list with no organization at all",
        ],
        correctIndex: 2,
        explanation: "OASIS is funded and driven by its member organizations — companies, agencies, individuals — through Technical Committees, rather than national delegations (ISO/IEC) or a single agency (NIST).",
      },
      {
        question: "Which federated-identity specification did OASIS ratify in 2005?",
        options: ["OAuth 2.0", "OpenID Connect", "SAML 2.0", "WebAuthn"],
        correctIndex: 2,
        explanation: "SAML 2.0 was ratified as an OASIS Standard in 2005 — the XML-based assertion format covered in the federated identity use case.",
      },
      {
        question: "Which organization originally published PKCS#11 before OASIS took over its stewardship?",
        options: ["NIST", "IETF", "ISO/IEC", "RSA Laboratories"],
        correctIndex: 3,
        explanation: "RSA Laboratories originally published the PKCS series. OASIS took over stewardship in the early 2010s to move it to open, multi-vendor governance.",
      },
      {
        question: "Why did moving PKCS#11 from RSA Laboratories to OASIS matter?",
        options: [
          "It made the spec cheaper to license",
          "It removed the risk of a single company controlling the roadmap of the de facto standard hardware-token API",
          "It changed the underlying cryptography",
          "It had no real effect"
        ],
        correctIndex: 1,
        explanation: "A single vendor controlling the standard API every HSM and smart card vendor depended on was a long-term governance risk. OASIS's multi-vendor Technical Committee structure removed that single point of control.",
      },
      {
        question: "What problem does KMIP solve that PKCS#11 doesn't?",
        options: [
          "KMIP defines a digital signature algorithm",
          "KMIP is a network protocol for managing key lifecycle across multiple vendors' HSMs/KMS products, not just one application talking to one local token",
          "KMIP replaces TLS",
          "KMIP is identical to PKCS#11, just renamed",
        ],
        correctIndex: 1,
        explanation: "PKCS#11 governs one application's local API calls to one token. KMIP is a network-level protocol letting a key-management layer talk consistently to multiple HSM/KMS products from different vendors across an organization.",
      },
      {
        question: "What TC (Technical Committee) structure does OASIS use to develop a standard?",
        options: [
          "A single company writes the spec and OASIS rubber-stamps it",
          "Each specification area has its own member-run Technical Committee that reaches consensus before ratification",
          "A random lottery of members",
          "The original vendor retains sole authority",
        ],
        correctIndex: 1,
        explanation: "Each OASIS specification is developed inside a scoped Technical Committee of member participants, ratified as an OASIS Standard once that TC reaches consensus.",
      },
      {
        question: "Which use case on this site covers PKCS#11 in depth?",
        options: [
          "The federated identity use case",
          "The PKCS#11 use case",
          "The PKI in production use case",
          "The KMS envelope encryption use case",
        ],
        correctIndex: 1,
        explanation: "PKCS#11: the standard behind every HSM and smart card is its own dedicated use case, covering the session/object model and the wrap-then-decrypt attack class.",
      },
      {
        question: "Is OASIS a government body?",
        options: ["Yes, part of the US federal government", "No — it's a nonprofit consortium funded by its member organizations", "Yes, part of the United Nations", "No, it's a for-profit company"],
        correctIndex: 1,
        explanation: "OASIS is a nonprofit consortium, not a government body — its standards are developed and funded by member organizations rather than a national government.",
      },
      {
        question: "What kind of organizations can join an OASIS Technical Committee?",
        options: [
          "Only national governments",
          "Only the original spec author",
          "Companies, government agencies, and individuals",
          "Nobody — membership is closed",
        ],
        correctIndex: 2,
        explanation: "OASIS membership spans companies, government agencies, and individuals, all able to participate in Technical Committee work.",
      },
      {
        question: "Which of these is an OASIS specification covered on this site?",
        options: ["RFC 9846 (TLS 1.3)", "FIPS 197 (AES)", "SAML 2.0", "ISO/IEC 27001"],
        correctIndex: 2,
        explanation: "SAML 2.0 is an OASIS Standard. RFC 9846 is IETF, FIPS 197 is NIST, and ISO/IEC 27001 is ISO/IEC — one from each of the four bodies covered on this page.",
      },
    ],
  },
];

export function getStandardsQuiz(slug: string): StandardsQuiz | undefined {
  return standardsQuizzes.find((q) => q.bodySlug === slug);
}
