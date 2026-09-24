export interface ReadingItem {
  title: string;
  author: string;
  description: string;
  url: string;
}

export const furtherReadingSites: ReadingItem[] = [
  {
    title: "Schneier on Security",
    author: "Bruce Schneier",
    description: "Long-running blog on crypto policy, applied security, and the occasional deep dive into a broken protocol.",
    url: "https://www.schneier.com/",
  },
  {
    title: "A Few Thoughts on Cryptographic Engineering",
    author: "Matthew Green",
    description: "A Johns Hopkins cryptographer writing accessibly about TLS, protocol security, and why real-world crypto keeps breaking.",
    url: "https://blog.cryptographyengineering.com/",
  },
  {
    title: "cr.yp.to",
    author: "Daniel J. Bernstein",
    description: "The designer of ChaCha20 and Curve25519, writing directly about the algorithms covered in this catalog.",
    url: "https://cr.yp.to/",
  },
  {
    title: "IACR ePrint Archive",
    author: "International Association for Cryptologic Research",
    description: "The preprint server where new cryptography research — including attacks on things covered here — appears first.",
    url: "https://eprint.iacr.org/",
  },
  {
    title: "Real World Crypto",
    author: "IACR",
    description: "An annual conference bridging cryptography research and real deployments — talks and proceedings are free.",
    url: "https://rwc.iacr.org/",
  },
  {
    title: "Cryptography I",
    author: "Dan Boneh, Stanford (Coursera)",
    description: "The standard free introductory cryptography course — covers the same primitives this site does, with formal rigor.",
    url: "https://www.coursera.org/learn/crypto",
  },
  {
    title: "MIT OpenCourseWare — Mathematics & EECS",
    author: "MIT",
    description: "Free lecture notes and problem sets from MIT's cryptography and number theory courses.",
    url: "https://ocw.mit.edu/",
  },
  {
    title: "Cryptography Stack Exchange",
    author: "Stack Exchange community",
    description: "A Q&A site where working cryptographers answer specific, technical questions — good for when a module raises more questions than it answers.",
    url: "https://crypto.stackexchange.com/",
  },
  {
    title: "CrypTool",
    author: "CrypTool project",
    description: "Open-source, interactive software for experimenting with classical and modern ciphers and cryptanalysis techniques.",
    url: "https://www.cryptool.org/",
  },
  {
    title: "NIST Cryptographic Standards and Guidelines",
    author: "NIST",
    description: "The official hub for the FIPS and Special Publications this site's References page cites throughout.",
    url: "https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines",
  },
];

export const furtherReadingBooks: ReadingItem[] = [
  {
    title: "Applied Cryptography",
    author: "Bruce Schneier",
    description: "The classic reference on cryptographic protocols, algorithms, and source code — dated in places, foundational everywhere else.",
    url: "https://www.schneier.com/books/applied-cryptography/",
  },
  {
    title: "Serious Cryptography",
    author: "Jean-Philippe Aumasson",
    description: "A practical, modern guide to encryption — symmetric, asymmetric, and the protocols built from them.",
    url: "https://nostarch.com/seriouscrypto",
  },
  {
    title: "Real-World Cryptography",
    author: "David Wong",
    description: "A hands-on guide to the cryptographic primitives and protocols actually deployed today, not just the textbook versions.",
    url: "https://www.manning.com/books/real-world-cryptography",
  },
  {
    title: "Cryptography Engineering",
    author: "Niels Ferguson, Bruce Schneier & Tadayoshi Kohno",
    description: "Design principles and hard-won practical guidance for building cryptographic systems that survive contact with reality.",
    url: "https://www.schneier.com/books/cryptography-engineering/",
  },
  {
    title: "Understanding Cryptography",
    author: "Christof Paar & Jan Pelzl",
    description: "A textbook covering essentially the same algorithm set as this site — AES, RSA, ECC, hashing — with more mathematical depth.",
    url: "https://www.crypto-textbook.com/",
  },
  {
    title: "A Graduate Course in Applied Cryptography",
    author: "Dan Boneh & Victor Shoup",
    description: "Comprehensive, rigorous, and free — covers private-key encryption, public-key encryption, and digital signatures in full.",
    url: "https://toc.cryptobook.us/",
  },
  {
    title: "The Code Book",
    author: "Simon Singh",
    description: "The most accessible history of cryptography available — from the scytale to the Enigma to modern public-key cryptography.",
    url: "https://simonsingh.net/books/the-code-book/",
  },
  {
    title: "The Codebreakers",
    author: "David Kahn",
    description: "The definitive, exhaustive history of cryptography up to its 1967 publication — the book that founded the field of crypto history.",
    url: "https://en.wikipedia.org/wiki/The_Codebreakers",
  },
];
