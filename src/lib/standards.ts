import type { MathBlock, DiagramSpec, PracticeProblem, RoleId } from "@/lib/content";

export interface StandardsSection {
  heading: string;
  body: string[];
  math?: MathBlock[];
  diagram?: DiagramSpec;
  practice?: PracticeProblem[];
  advanced?: boolean;
}

export interface StandardsBody {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  tags: RoleId[];
  relatedModules: string[];
  relatedUseCases?: string[];
  sections: StandardsSection[];
}

export const standardsBodies: StandardsBody[] = [
  {
    slug: "nist",
    title: "NIST: the standards body behind AES, SHA, and post-quantum cryptography",
    summary:
      "Almost every algorithm in this catalog traces back to a NIST publication. Here's what NIST actually is, how it picks a winner, and the full list of what it's standardized.",
    minutes: 22,
    tags: ["developer", "architect", "grc", "researcher", "itops"],
    relatedModules: ["symmetric-key-aes", "hash-functions-and-signatures", "quantum-threat-shor", "key-sizes-and-security-levels"],
    sections: [
      {
        heading: "A US metrology agency that ended up setting global crypto standards",
        body: [
          "NIST — the National Institute of Standards and Technology — is a non-regulatory agency of the US Department of Commerce, originally chartered in 1901 to standardize physical measurement (weights, time, physical constants). Its Computer Security Division took on cryptography because the US federal government needed algorithms every agency could rely on, and someone had to specify exactly which ones and how.",
          "NIST publishes two kinds of documents that matter here. A FIPS (Federal Information Processing Standard) is mandatory for US federal systems and is where the actual algorithms live — AES, SHA-2, SHA-3, the post-quantum algorithms. The SP 800 series (Special Publications) is guidance rather than a hard mandate — how to use those algorithms safely, key management practices, random number generation requirements. Almost nothing here is unique to US government use: because NIST's process and output are free, public, and rigorously reviewed, the rest of the world adopted them as the de facto global baseline too.",
        ],
      },
      {
        heading: "How NIST actually picks a standard: the open competition model",
        body: [
          "NIST doesn't design algorithms in-house and declare them standards. For its three biggest decisions — a replacement for DES, a replacement for SHA-1/SHA-2, and a response to the quantum threat — it ran open, multi-year public competitions instead: anyone could submit a candidate, and the entire cryptographic research community was invited to attack every submission in public.",
          "This matters for a reason beyond fairness: a design nobody could break after years of open cryptanalysis by the world's best cryptographers is a far stronger trust signal than a design reviewed only behind closed doors — exactly the property that made the Dual_EC_DRBG story (covered later on this page) so damaging when it broke that pattern.",
        ],
        diagram: {
          type: "timeline",
          title: "Three competitions, three current standards",
          events: [
            { date: "1997–2000", label: "AES competition", detail: "15 submissions in round one, 5 finalists, Rijndael selected — became FIPS 197 in 2001." },
            { date: "2007–2012", label: "SHA-3 competition", detail: "Keccak selected after NIST wanted a hash function structurally different from SHA-2, in case SHA-2 were ever broken the same way SHA-1 was — became FIPS 202 in 2015." },
            { date: "2016–2024", label: "Post-Quantum Cryptography competition", detail: "69 initial submissions; CRYSTALS-Kyber, CRYSTALS-Dilithium, and SPHINCS+ selected — became FIPS 203, 204, and 205 in August 2024." },
          ],
        },
      },
      {
        heading: "What NIST has actually standardized",
        body: [
          "The full list is long, but almost everything covered in this catalog's Learn modules traces back to one of these.",
        ],
        diagram: {
          type: "structure",
          title: "The FIPS and SP 800 documents behind this site's Learn modules",
          blocks: [
            { label: "FIPS 197 — AES", detail: "The Advanced Encryption Standard itself, published 2001.", href: "https://csrc.nist.gov/pubs/fips/197/final" },
            { label: "FIPS 180-4 — SHS (SHA-2)", detail: "The Secure Hash Standard covering the SHA-2 family.", href: "https://csrc.nist.gov/pubs/fips/180/4/final" },
            { label: "FIPS 202 — SHA-3", detail: "SHA-3/Keccak, selected as a structural hedge alongside SHA-2, not a replacement for it.", href: "https://csrc.nist.gov/pubs/fips/202/final" },
            { label: "FIPS 186-5 — Digital Signature Standard", detail: "Specifies DSA, RSA, and ECDSA signatures.", href: "https://csrc.nist.gov/pubs/fips/186/5/final" },
            { label: "FIPS 203 — ML-KEM", detail: "The post-quantum key-encapsulation mechanism, finalized August 2024.", href: "https://csrc.nist.gov/pubs/fips/203/final" },
            { label: "FIPS 204 — ML-DSA", detail: "The post-quantum signature standard, finalized August 2024.", href: "https://csrc.nist.gov/pubs/fips/204/final" },
            { label: "FIPS 205 — SLH-DSA", detail: "The stateless hash-based post-quantum signature standard, finalized August 2024.", href: "https://csrc.nist.gov/pubs/fips/205/final" },
            { label: "SP 800-38D", detail: "Block cipher modes of operation — this is the document that specifically defines GCM.", href: "https://csrc.nist.gov/pubs/sp/800/38/d/final" },
            { label: "SP 800-56A Rev. 3", detail: "Key establishment using discrete-log cryptography — covers Diffie-Hellman and ECDH.", href: "https://csrc.nist.gov/pubs/sp/800/56/a/r3/final" },
            { label: "SP 800-90A", detail: "Recommendation for random number generation using deterministic random bit generators (DRBGs) — the standard at the center of the Dual_EC_DRBG story below.", href: "https://csrc.nist.gov/pubs/sp/800/90/a/r1/final" },
            { label: "SP 800-57 Part 1 Rev. 5", detail: "Key management guidance, including the key-size/security-level equivalence table this site's Compare page draws from.", href: "https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final" },
          ],
        },
        practice: [
          {
            prompt: "Which FIPS publication defines AES itself?",
            hint: "It's the lowest-numbered FIPS mentioned on this page.",
            placeholder: "FIPS ___",
            answer: "197",
            explanation: "FIPS 197, published in 2001 after the AES competition selected Rijndael. The hash standards (SHA-2, SHA-3) and signature standard (DSS) are separate FIPS documents.",
          },
        ],
      },
      {
        heading: "Why NIST ran three separate open competitions instead of one",
        body: [
          "Each competition responded to a specific, different threat. AES replaced DES because DES's 56-bit key had become exhaustively searchable — a computational weakness, not a design flaw. SHA-3 was selected not because SHA-2 had been broken (it hadn't, and still hasn't), but as a structural hedge: SHA-1's break in the mid-2000s showed an entire hash function family can share a fatal weakness, so NIST wanted a backup built on a fundamentally different internal structure (a sponge construction) ready before it was ever needed. The post-quantum competition responds to Shor's algorithm, covered in its own module — a future quantum computer would break RSA, Diffie-Hellman, and ECC's discrete-log math entirely, not just weaken it.",
        ],
      },
      {
        heading: "When the process broke down: Dual_EC_DRBG",
        body: [
          "NIST's open-competition model is the reason its standards are trusted by default — which is exactly why the one time that trust was seriously damaged is worth understanding in detail. SP 800-90A, the 2006 random-number-generation standard, included an algorithm called Dual_EC_DRBG alongside several others. Independent researchers flagged a strange property as early as 2007: the algorithm's design included constants that, if chosen a certain way, could give whoever chose them a mathematical backdoor into predicting every 'random' output.",
          "The 2013 Snowden disclosures confirmed the suspicion: Dual_EC_DRBG had been championed for standardization with NSA involvement, and the constants in question were plausibly NSA-generated with no public proof they weren't backdoored. NIST withdrew its recommendation within months and later formally removed the algorithm from SP 800-90A. The lasting lesson, still cited in security reviews today, is procedural: a standard is only as trustworthy as the transparency of every constant and design choice inside it — an algorithm that can't be shown to avoid a backdoor should be treated as though it might have one, regardless of who proposed it.",
        ],
        advanced: true,
        practice: [
          {
            prompt: "What specifically made Dual_EC_DRBG different from a normal 'this algorithm turned out to be weak' story?",
            hint: "It wasn't broken by a clever new attack — the concern was about how it was designed in the first place.",
            placeholder: "one sentence",
            answer: "it had a plausible built-in backdoor via unexplained constants",
            explanation: "Unlike an algorithm broken by advancing cryptanalysis, Dual_EC_DRBG's concern was that its published constants could have been deliberately chosen by whoever selected them to allow predicting its output — a suspected backdoor, not a discovered flaw.",
          },
        ],
      },
    ],
  },
  {
    slug: "ietf",
    title: "The IETF: RFCs and the protocols the internet actually runs",
    summary:
      "TLS, JWT, PKIX certificates, SSH — every protocol module on this site cites an RFC. Here's how the IETF actually produces them, and what \"RFC\" does and doesn't guarantee.",
    minutes: 20,
    tags: ["developer", "architect", "itops", "researcher"],
    relatedModules: ["tls-in-practice", "jwt-and-api-auth", "digital-certificates-x509", "ssh-protocol"],
    sections: [
      {
        heading: "Rough consensus and running code",
        body: [
          "The IETF (Internet Engineering Task Force) has no formal membership, no national delegations, and no voting body in the way ISO or a national government does. Anyone can join a mailing list, attend a meeting, or submit a draft. Decisions are made by what its own culture calls \"rough consensus and running code\" — a phrase attributed to early IETF leader David Clark: a standard should reflect general agreement among people who actually showed up to do the work, ideally backed by a working implementation that proves it's practical, not just theoretically sound.",
          "This is a genuinely different model from NIST's government-agency process or ISO's national-body voting, covered elsewhere on this page — and it's a large part of why internet protocols evolved as fast and as openly as they did.",
        ],
      },
      {
        heading: "From Internet-Draft to RFC",
        body: [
          "A specification starts life as an Internet-Draft — a working document, expires automatically after 6 months without an update, and explicitly not yet a standard (citing one as though it were is a common and real mistake in security reviews). A working group refines it through rounds of public review and implementation experience, and once the IESG (Internet Engineering Steering Group) approves it, it's published as an RFC (Request for Comments) — a name that's stayed for historical reasons even though a published RFC is a finished, numbered, permanent document, not an open request for feedback.",
          "RFC numbers are never reused and never renumbered. A newer specification that replaces an older one is published as a brand new RFC that explicitly states it obsoletes the old one — the old number still exists and still describes what it always described, it's just no longer the current standard. RFC 8017 (PKCS#1 v2.2, 2016) obsoleting RFC 3447 (PKCS#1 v2.1, 2003), which itself obsoleted RFC 2437, is a clean real example: three RFC numbers, one continuously evolving specification.",
        ],
        diagram: {
          type: "sequence",
          title: "From idea to standard",
          steps: [
            { label: "Internet-Draft", detail: "A working document, expires after 6 months without an update — explicitly not a standard yet." },
            { label: "Working group review", detail: "Public mailing-list discussion, implementation experience, revised drafts." },
            { label: "IESG approval", detail: "The Internet Engineering Steering Group signs off on publication." },
            { label: "RFC published", detail: "A permanently numbered document. Superseding specs obsolete it by number; the old RFC text never changes." },
          ],
        },
      },
      {
        heading: "The working groups behind the protocols in this catalog",
        body: [
          "Every protocol module on this site sits under a specific IETF working group's output.",
        ],
        diagram: {
          type: "structure",
          title: "Working groups → RFCs → Learn modules",
          blocks: [
            { label: "TLS WG — RFC 8446", detail: "TLS 1.3 and its predecessors — covered in the TLS in Practice module.", href: "https://www.rfc-editor.org/rfc/rfc8446" },
            { label: "LAMPS WG — RFC 5280", detail: "The X.509 PKIX certificate profile and related PKI specs — covered in Digital Certificates & X.509.", href: "https://www.rfc-editor.org/rfc/rfc5280" },
            { label: "OAuth WG — RFC 6749", detail: "OAuth 2.0; the related JOSE working group produces RFC 7519 (JWT) and the surrounding JSON Object Signing and Encryption specs — covered in JWT & API Auth.", href: "https://www.rfc-editor.org/rfc/rfc6749" },
            { label: "(historical) secsh WG — RFC 4253", detail: "Defines the SSH transport protocol — covered in the SSH module.", href: "https://www.rfc-editor.org/rfc/rfc4253" },
          ],
        },
        practice: [
          {
            prompt: "An Internet-Draft was last updated 9 months ago and was never published as an RFC. Is it still a valid reference to cite in a security design document?",
            hint: "Internet-Drafts have an automatic expiration rule.",
            placeholder: "yes or no",
            answer: "no",
            explanation: "Internet-Drafts expire automatically after 6 months without an update. A 9-month-old, never-finalized draft has expired and was never a standard to begin with — citing it as authoritative is a real and surprisingly common mistake.",
          },
        ],
      },
      {
        heading: "What \"RFC\" doesn't automatically mean",
        body: [
          "Not every RFC is a mandatory standard, and treating the label as uniform is another common mistake. The IETF publishes RFCs on a spectrum: Standards Track (the familiar Proposed Standard / Internet Standard progression), Informational (documenting something without prescribing it), Experimental, and BCP (Best Current Practice, operational guidance rather than a protocol spec). RFC 2119 — itself a BCP — is the one that defines what MUST, SHOULD, and MAY actually mean inside every other RFC that uses those capitalized words; it's worth knowing this RFC exists specifically because so much of every other spec's precision depends on it.",
        ],
        advanced: true,
      },
    ],
  },
  {
    slug: "iso-iec",
    title: "ISO/IEC: the paywalled standards behind ISMS certification and algorithm testing",
    summary:
      "A federation of national standards bodies, not a single organization — and the source of both ISO/IEC 27001 certification and the international equivalent of NIST's own algorithm standards.",
    minutes: 20,
    tags: ["grc", "architect", "itops", "developer"],
    relatedModules: ["symmetric-key-aes", "hash-functions-and-signatures", "key-derivation-functions", "side-channel-and-timing-attacks"],
    sections: [
      {
        heading: "A federation of national bodies, not one organization",
        body: [
          "ISO (International Organization for Standardization) and IEC (International Electrotechnical Commission) are separate bodies that jointly run the technical committee responsible for cryptography and IT security: ISO/IEC JTC 1/SC 27. Unlike NIST (one US government agency) or the IETF (open individual participation), ISO/IEC's members are national standards bodies — ANSI for the US, BSI for the UK, DIN for Germany, and so on — each representing their own country's position, with published standards adopted by formal international consensus across those delegations.",
          "The practical difference you'll actually notice: NIST's FIPS and SP 800 documents, and every IETF RFC, are free to read. ISO/IEC standards are sold, typically for real money per document — a genuine friction point for smaller teams trying to reference the exact spec their compliance program requires.",
        ],
      },
      {
        heading: "What ISO/IEC has actually standardized",
        body: [
          "ISO/IEC JTC 1/SC 27 covers both algorithm-level specifications and organizational/process standards — a broader scope than NIST's mostly-algorithmic FIPS series.",
        ],
        diagram: {
          type: "structure",
          title: "The ISO/IEC 27000 and cryptography series",
          blocks: [
            { label: "ISO/IEC 18033 (parts 1–4)", detail: "Encryption algorithms — general model, asymmetric ciphers, block ciphers (including AES), and stream ciphers." },
            { label: "ISO/IEC 9797 (parts 1–3)", detail: "Message Authentication Code (MAC) algorithms." },
            { label: "ISO/IEC 10118 (parts 1–4)", detail: "Hash functions, including the SHA family and others." },
            { label: "ISO/IEC 11770 (parts 1–6)", detail: "Key management — establishment, agreement, and related mechanisms." },
            { label: "ISO/IEC 14888", detail: "Digital signatures with appendix." },
            { label: "ISO/IEC 15408", detail: "The Common Criteria for Information Technology Security Evaluation — the framework behind \"Common Criteria certified\" hardware and software.", href: "https://www.commoncriteriaportal.org/" },
            { label: "ISO/IEC 19790 & 24759", detail: "Security requirements for cryptographic modules, and how to test them — the international counterpart to NIST's FIPS 140-3 module-validation program." },
            { label: "ISO/IEC 27001", detail: "Information Security Management Systems (ISMS) — the standard behind the certification most enterprise security questionnaires actually ask for.", href: "https://www.iso.org/isoiec-27001-information-security.html" },
          ],
        },
        practice: [
          {
            prompt: "A vendor's compliance page says they're \"ISO/IEC 27001 certified.\" Is that a claim about a specific cryptographic algorithm, or about something else?",
            hint: "27001 is the odd one out in the list above — check what category it belongs to.",
            placeholder: "one phrase",
            answer: "an information security management system",
            explanation: "ISO/IEC 27001 certifies an organization's information security management system (ISMS) — policies, risk management, and process controls — not any specific algorithm. It's the standard most enterprise security questionnaires are actually asking about, distinct from algorithm-level standards like 18033.",
          },
        ],
      },
      {
        heading: "Where you've encountered it without buying a copy",
        body: [
          "A vendor's \"ISO/IEC 27001 certified\" badge on a trust-center page, a hardware token or HSM listed as \"Common Criteria EAL4+ certified,\" a cryptographic module validated against ISO/IEC 19790 for a market where FIPS 140-3 isn't the relevant regime — all of this is ISO/IEC's standards infrastructure operating in the background of ordinary vendor due diligence, GRC questionnaires, and procurement requirements, whether or not anyone in the room has read the underlying paid document.",
        ],
      },
      {
        heading: "Why the same algorithm can have two standard numbers",
        body: [
          "AES is both FIPS 197 (NIST) and ISO/IEC 18033-3 — the same algorithm, standardized twice, by two different bodies, for two different regulatory audiences. This isn't duplication for its own sake: a US federal contractor's compliance requirement typically cites FIPS 197 by name, while a company operating primarily under EU or international frameworks may need to cite the ISO/IEC number instead — same math, same security guarantees, different paperwork trail. ISO/IEC frequently adopts NIST's already-public, already-reviewed algorithm work directly rather than re-running the cryptanalysis from scratch, which is also why AES's ISO/IEC standardization came years after its FIPS 197 publication rather than the two processes racing each other.",
        ],
        advanced: true,
      },
    ],
  },
  {
    slug: "oasis",
    title: "OASIS: where the identity and PKI-token standards actually get written",
    summary:
      "SAML, PKCS#11, and KMIP all live here — a member-driven consortium, not a government body, that ended up stewarding some of the most load-bearing identity and key-management specs in production today.",
    minutes: 18,
    tags: ["developer", "architect", "itops"],
    relatedModules: ["digital-certificates-x509"],
    relatedUseCases: ["pkcs11-cryptographic-tokens", "federated-identity-oauth-oidc-saml"],
    sections: [
      {
        heading: "A vendor consortium, not a government body",
        body: [
          "OASIS (the Organization for the Advancement of Structured Information Standards) is a nonprofit consortium founded in the early 1990s, funded and driven by its member organizations — companies, government agencies, and individuals — rather than by national delegations (ISO/IEC's model) or a single government agency (NIST's model). Standards are developed inside member-run Technical Committees (TCs), each scoped to one specification area, and ratified as an \"OASIS Standard\" once the TC reaches consensus.",
          "This structure is what let OASIS take on a role neither NIST nor the IETF was positioned to play: hosting the long-term, multi-vendor governance of specifications that started as one company's format but needed to become everyone's shared interface.",
        ],
      },
      {
        heading: "What OASIS has actually standardized",
        body: [
          "Three specifications from OASIS show up directly in this catalog.",
        ],
        diagram: {
          type: "structure",
          title: "OASIS standards this site actually uses",
          blocks: [
            { label: "SAML 2.0", detail: "Ratified as an OASIS Standard in 2005 — the XML-based federated-identity assertion format covered in the federated identity use case.", href: "https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf" },
            { label: "PKCS#11 (Cryptoki)", detail: "The hardware-token API covered in depth in its own use case — see the next section for how OASIS came to own it.", href: "https://docs.oasis-open.org/pkcs11/pkcs11-base/v3.0/pkcs11-base-v3.0.html" },
            { label: "KMIP (Key Management Interoperability Protocol)", detail: "A network protocol letting an application's key-management requests work identically across HSMs and KMS products from different vendors — see \"Go deeper\" below.", href: "https://www.oasis-open.org/committees/kmip/" },
          ],
        },
      },
      {
        heading: "Why a consortium ended up stewarding a vendor's format",
        body: [
          "PKCS#11's origin is exactly what the name suggests — one of the numbered PKCS specifications originally published by RSA Laboratories, a private company. A single vendor owning the de facto standard API for hardware security tokens was a real long-term risk: any direction RSA Labs took the spec, every other HSM and smart card vendor had to simply accept. In the early 2010s, RSA transferred stewardship of PKCS to OASIS, where the PKCS 11 Technical Committee now governs it by open, multi-vendor consensus instead of one company's roadmap — the same neutral-governance argument that makes the IETF's open process valuable, applied retroactively to a spec that didn't start out that way.",
          "This is worth knowing specifically because it explains something that otherwise looks like an inconsistency: why a \"PKCS\" standard — a name tied to RSA Laboratories — is cited today as an OASIS specification with its own OASIS-hosted version history.",
        ],
        practice: [
          {
            prompt: "PKCS#11 was originally published by which organization, before OASIS took over its stewardship?",
            hint: "The name PKCS itself is the clue — it originally referred to one company's numbered specification series.",
            placeholder: "company name",
            answer: "RSA Laboratories",
            explanation: "RSA Laboratories originally published the PKCS series, including PKCS#11. OASIS took over stewardship in the early 2010s specifically to move it to open, multi-vendor governance.",
          },
        ],
      },
      {
        heading: "KMIP: the standard behind \"why can my KMS talk to that HSM\"",
        body: [
          "PKCS#11 solves one problem: how a single application talks to a single token or HSM it's directly connected to. KMIP solves a different, network-level problem: how a key-management system, its clients, and multiple HSMs or KMS products from different vendors can all speak one protocol to create, locate, and manage the lifecycle of keys across an entire enterprise's infrastructure — not just perform one cryptographic operation on one token. A large organization running HSMs from more than one vendor, needing them to all report into a central key-management layer, is the situation KMIP specifically exists for.",
        ],
        advanced: true,
      },
    ],
  },
];

export function getStandardsBody(slug: string): StandardsBody | undefined {
  return standardsBodies.find((s) => s.slug === slug);
}
