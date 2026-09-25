export type ChallengeCategory =
  | "Warm-up"
  | "Classical Ciphers"
  | "Symmetric-key"
  | "RSA"
  | "Diffie-Hellman & ECC";

export type ChallengeDifficulty = "easy" | "medium" | "hard";

export interface ChallengeDataBlock {
  label: string;
  value: string;
}

export interface Challenge {
  slug: string;
  title: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  points: number;
  summary: string;
  prompt: string[];
  data?: ChallengeDataBlock[];
  hints?: string[];
  flag: string;
  explanation: string[];
  relatedModules?: string[];
}

export const categoryOrder: ChallengeCategory[] = [
  "Warm-up",
  "Classical Ciphers",
  "Symmetric-key",
  "RSA",
  "Diffie-Hellman & ECC",
];

export const challenges: Challenge[] = [
  // ---------------------------------------------------------------------
  // Warm-up
  // ---------------------------------------------------------------------
  {
    slug: "hex-warmup",
    title: "Hexadecimal",
    category: "Warm-up",
    difficulty: "easy",
    points: 10,
    summary: "Decode a hex string directly into the flag — no cipher involved, just an encoding.",
    prompt: [
      "Every flag on this site starts with cct{ and ends with }. This one isn't encrypted at all — it's just encoded as hexadecimal, two hex digits per byte.",
      "Decode the string below back into ASCII text.",
    ],
    data: [{ label: "Encoded", value: "6363747b6833785f31735f6a7535745f62797433737d" }],
    hints: ["Each pair of hex digits is one ASCII character's ordinal value, in base 16."],
    flag: "cct{h3x_1s_ju5t_byt3s}",
    explanation: [
      "Hexadecimal is an encoding, not encryption — reversing it takes no key at all, exactly like the base64url point made in the JWT module. Converting each pair of hex digits back to its ASCII character recovers the flag directly: 63→c, 63→c, 74→t, 7b→{, and so on.",
    ],
  },
  {
    slug: "base64-warmup",
    title: "Base64",
    category: "Warm-up",
    difficulty: "easy",
    points: 10,
    summary: "Another pure encoding — decode base64 back into the flag.",
    prompt: [
      "Base64 packs 3 bytes of binary data into 4 printable characters, which is why you see it everywhere data needs to survive being copy-pasted or embedded in text.",
      "Decode the string below.",
    ],
    data: [{ label: "Encoded", value: "Y2N0e2I0c2U2NF80bGxfdGgzX3RoMW5nc30=" }],
    hints: ["Any standard base64 decoder (or a one-line script) will do — no key is involved."],
    flag: "cct{b4se64_4ll_th3_th1ngs}",
    explanation: [
      "Base64, like hex, is just an encoding — the trailing = is padding, not part of the content. Decoding reverses it directly back to the flag with no cryptographic step involved at all.",
    ],
  },
  {
    slug: "single-byte-xor-warmup",
    title: "Single-byte XOR",
    category: "Warm-up",
    difficulty: "easy",
    points: 15,
    summary: "A message XORed with one repeated byte. There's a shortcut hiding in how every flag on this site starts.",
    prompt: [
      "This one has actually been \"encrypted\" — every byte of the flag was XORed with the same single secret byte.",
      "You don't know the key. But you do know every flag on this site starts with the four characters cct{.",
    ],
    data: [{ label: "Ciphertext (hex)", value: "49495e515943444d1b4f7548535e4f75521a58751b59755d4f1e4157" }],
    hints: [
      "XOR the first ciphertext byte with the ASCII code for 'c' — since XOR is its own inverse, that recovers the key directly.",
    ],
    flag: "cct{sing1e_byte_x0r_1s_we4k}",
    explanation: [
      "Because you know the plaintext's first byte is always 'c' (0x63), XORing it against the first ciphertext byte (0x49) recovers the key instantly: 0x49 ⊕ 0x63 = 0x2a — no brute force over all 256 possible bytes needed. XORing every ciphertext byte with 0x2a recovers the full flag. This is the exact known-plaintext shortcut the symmetric-key module's single-byte XOR section describes, just applied to a whole message instead of one byte.",
    ],
    relatedModules: ["symmetric-key-aes"],
  },

  // ---------------------------------------------------------------------
  // Classical Ciphers
  // ---------------------------------------------------------------------
  {
    slug: "caesar-shift",
    title: "An Old Habit",
    category: "Classical Ciphers",
    difficulty: "easy",
    points: 15,
    summary: "Someone on the team still encrypts things the way Julius Caesar did. Read their message.",
    prompt: [
      "A colleague insists on \"encrypting\" internal notes with the same trick Roman generals used two thousand years ago: shifting every letter forward by a fixed amount.",
      "Recover the original message — and the flag inside it.",
    ],
    data: [{ label: "Ciphertext", value: "ppg{rg_gh_oehgr_abguvat_fgnlf_frperg}" }],
    hints: [
      "There are only 26 possible shifts. You don't need to guess — the flag always starts with cct{, so the correct shift is the one where decoding the first letter gives 'c'.",
    ],
    flag: "cct{et_tu_brute_nothing_stays_secret}",
    explanation: [
      "Every one of the 26 possible shifts can be tried in a moment — the flag's fixed cct{ prefix tells you exactly which shift is correct without any frequency analysis needed: the ciphertext's first letter 'p' must decode to 'c', a shift back of 13 positions (p→c is 13 letters back, or equivalently forward 13, since a shift-13 Caesar cipher — ROT13 — is its own inverse). Al-Kindi's original insight, covered in the history module, is that this kind of exhaustive or statistical search is always tractable against a single fixed shift.",
    ],
    relatedModules: ["history-and-purpose-of-cryptography"],
  },
  {
    slug: "vigenere-key",
    title: "Le Chiffre Indéchiffrable",
    category: "Classical Ciphers",
    difficulty: "medium",
    points: 30,
    summary: "A polyalphabetic cipher that held its reputation for three centuries. It didn't survive the fourth.",
    prompt: [
      "This message was encrypted with a repeating-keyword cipher — the same construction that earned the nickname \"the indecipherable cipher\" long before anyone found a reliable way to break it.",
      "The key is a short, common English word.",
    ],
    data: [{ label: "Ciphertext", value: "tqh{drgwlbw_pxrhg_ev_qvbwtfx_zbrxtvwywfoucs}" }],
    hints: [
      "The flag's known cct{ prefix lines up with the first four key letters — subtracting each known plaintext letter from its ciphertext letter (mod 26) recovers those key letters directly.",
      "Once you have the first few key letters, a short common English word should be recognizable — then decrypt the rest of the message with the full key, repeating it as needed.",
    ],
    flag: "cct{kasiski_beats_le_chiffre_indechiffrable}",
    explanation: [
      "Because the flag always starts with cct{, the first four ciphertext letters t, q, h, (the brace passes through unencrypted) reveal the first three key letters directly: key = ciphertext − plaintext (mod 26) gives t−c=R, q−c=O, h−t=O — spelling ROOT, a real word, confirming the key length and content immediately without needing full Kasiski examination. Decrypting the whole message by repeating ROOT across every letter (and leaving punctuation untouched) recovers the flag. A real-world attacker without a lucky known-plaintext crib would use Kasiski examination instead — finding repeated ciphertext sequences and taking the GCD of their distances — exactly as covered in the history module.",
    ],
    relatedModules: ["history-and-purpose-of-cryptography"],
  },
  {
    slug: "substitution-frequency",
    title: "Count Your Letters",
    category: "Classical Ciphers",
    difficulty: "hard",
    points: 50,
    summary: "A full substitution cipher — no repeating shift, no keyword. Every letter maps to a different letter, consistently.",
    prompt: [
      "This one doesn't use a single shift or a repeating keyword — every letter of the alphabet has been swapped for a different, fixed letter throughout the whole message. There are 26! possible substitutions, so brute force is out.",
      "But the substitution never breaks: the same plaintext letter always becomes the same ciphertext letter. That regularity is exactly what breaks it.",
    ],
    data: [
      {
        label: "Ciphertext",
        value:
          "zit jxoea wkgvf ygb pxdhl gctk zit sqmn rgu viost tctkn esqlloeqs eohitk tctfzxqssn yqssl zg eqktyxs qfqsnlol egxfz zit stzztkl of ziol dtllqut qfr zit dglz yktjxtfz gft qsdglz etkzqofsn lzqfrl ygk t lofet ziqz stzztk rgdofqztl gkrofqkn tfusoli hkglt yqk dgkt ziqf qfn gzitk gfet ngx iqct uxtlltr q iqfryxs gy stzztkl zit ktdqofofu lzkxezxkt gy egddgf ligkz vgkrl soat zit qfr qfr gyztf yqssl ofzg hsqet jxoeasn hqzotfet qfr q htfeos qkt qss ngx ktqssn fttr eez{yktjxtfen_qfqsnlol_ftctk_utzl_gsr}",
      },
    ],
    hints: [
      "Count how often each letter appears in the ciphertext. In any reasonably long piece of English text, E is by far the most common letter — whichever ciphertext letter appears most often almost certainly stands for E.",
      "Short, extremely common words are your friend: a 3-letter word appearing constantly is very likely \"the\", and a lone single-letter word is almost always \"a\" or \"I\".",
    ],
    flag: "cct{frequency_analysis_never_gets_old}",
    explanation: [
      "This is Al-Kindi's technique from around 850 CE, applied at full scale: count every ciphertext letter's frequency, and match the most common one to E — English's most common letter by a wide margin. In this ciphertext, 't' appears far more than any other letter, and decoding with t→e as the anchor point, the rest of the substitution falls into place quickly once a handful of short, common words (the, and, a) are recognized by their pattern and length. This is exactly the history module's frequency-analysis section, run against a full alphabet substitution instead of a single shift — the same idea, just with 26 unknowns instead of one.",
    ],
    relatedModules: ["history-and-purpose-of-cryptography"],
  },

  // ---------------------------------------------------------------------
  // Symmetric-key
  // ---------------------------------------------------------------------
  {
    slug: "repeating-key-xor",
    title: "A Longer Key Isn't Always Enough",
    category: "Symmetric-key",
    difficulty: "medium",
    points: 35,
    summary: "This time the XOR key repeats instead of being a single byte. Does that actually help?",
    prompt: [
      "A junior developer heard single-byte XOR was weak, so they \"fixed\" it by using a short repeating key instead — cycling through several key bytes rather than just one.",
      "The flag's fixed cct{ prefix is exactly as dangerous here as it was against a single byte.",
    ],
    data: [
      {
        label: "Ciphertext (hex)",
        value:
          "28262d21397629692a3168342c1a216a391a6829257206373e26310529762d2e7837062e237137057b2b6a05293c2d6936",
      },
    ],
    hints: [
      "The key is exactly 4 bytes long. XOR the first 4 ciphertext bytes against the known plaintext \"cct{\" to recover the entire key in one step.",
      "Once you have the key, XOR it (repeating as needed) against the whole ciphertext.",
    ],
    flag: "cct{r3p3at1ng_x0r_1sn7_much_b3tt3r_th4n_0n3_byt3}",
    explanation: [
      "A 4-byte repeating key against a known 4-byte prefix (cct{) is recovered completely in one XOR: key[i] = ciphertext[i] ⊕ plaintext[i] for i = 0..3. With the full key in hand, the rest of the message decrypts directly by repeating it across the remaining bytes. A longer, unknown-length key would need more known plaintext (or the Hamming-distance keysize-detection technique Cryptopals is famous for) — but the underlying weakness is identical to single-byte XOR: any known or guessable plaintext fragment leaks key bytes directly, no matter how long the key is.",
    ],
    relatedModules: ["symmetric-key-aes"],
  },
  {
    slug: "two-time-pad",
    title: "Reused Keystream",
    category: "Symmetric-key",
    difficulty: "medium",
    points: 35,
    summary: "Two messages, encrypted under what should have been two different one-time keys.",
    prompt: [
      "An operator accidentally reused the same keystream to encrypt two different messages — the exact mistake a one-time pad (and any stream cipher) can never survive.",
      "You know the first message in full. You don't know the second — except that it's the flag.",
    ],
    data: [
      { label: "Known plaintext (message 1)", value: "the meeting is at midnight in the usual place bring the " },
      {
        label: "Ciphertext 1 (hex)",
        value: "a44dbe2a28e1e9fdb58fe600a9b94f8a4a3bac949c84a3442125e67755270766541826b14886fc7e691c0a06a53b013603937dfb8c41a356",
      },
      {
        label: "Ciphertext 2 (hex)",
        value: "b346af7131f3bcd6a8d0ec459fba5b8f6169a4c99486b37c7822996a53660751540c20bb6293a0017b025851ab66",
      },
    ],
    hints: [
      "XOR ciphertext 1 with ciphertext 2 — the shared keystream cancels out completely, leaving plaintext1 ⊕ plaintext2.",
      "XOR that result with the known plaintext (message 1) to isolate message 2 — the flag.",
    ],
    flag: "cct{tw0_t1me_p4d_re4lly_1s_that_e4sy_t0_br34k}",
    explanation: [
      "C1 ⊕ C2 = (P1 ⊕ K) ⊕ (P2 ⊕ K) = P1 ⊕ P2 — the keystream K cancels out entirely, regardless of what it actually was. XORing that result with the already-known P1 isolates P2 (the flag) directly: (P1 ⊕ P2) ⊕ P1 = P2. This is the exact two-time-pad weakness covered in the stream-ciphers module, at full message scale instead of a single byte — it's also precisely why every nonce-based cipher (AES-GCM, ChaCha20) is so strict about never reusing a nonce under the same key.",
    ],
    relatedModules: ["stream-ciphers-chacha20"],
  },
  {
    slug: "cbc-cookie-forge",
    title: "Forge the Cookie",
    category: "Symmetric-key",
    difficulty: "hard",
    points: 60,
    summary: "A session cookie is encrypted with AES-CBC. You don't have the key. You don't need it.",
    prompt: [
      "A service encrypts session cookies with AES-128-CBC before handing them to the browser. The plaintext structure never changes: userid=9001;admin=false, PKCS#7-padded out to two 16-byte blocks.",
      "You want admin=false to become admin=true! (same length, so no padding shifts). You don't have the key, and you're not going to break AES — you're going to exploit CBC's block-chaining structure instead.",
      "Give your answer as the exact 5 bytes (as hex, no spaces) you'd need to XOR into the right ciphertext block to make that flip happen — that's the flag: cct{those_5_bytes_as_hex}.",
    ],
    data: [
      { label: "Plaintext (for reference — you would not normally know this)", value: "userid=9001;admin=false" },
      { label: "IV (hex)", value: "37eb42a9092951466dffa1e1974d4aa0" },
      {
        label: "Ciphertext (hex, 2 blocks)",
        value: "247bb25db3cf943bb472ae6de44f2532fc54cbb081f6c2aaa92d98b49df94c1f",
      },
    ],
    hints: [
      "In CBC, flipping bits in ciphertext block N changes the corresponding bits of plaintext block N+1 in a fully predictable way (while scrambling block N itself into garbage) — decryption XORs each block's raw AES output with the previous ciphertext block.",
      "Find where \"false\" sits in the plaintext, and which 16-byte block that falls into. The bytes you need to modify live in the block immediately before it.",
      "delta = old_plaintext_byte ⊕ new_plaintext_byte, applied at the matching offset in the previous ciphertext block.",
    ],
    flag: "cct{1213191644}",
    explanation: [
      "\"userid=9001;admin=false\" padded to 32 bytes splits as block 0 = \"userid=9001;admi\" and block 1 = \"n=false\" + padding — so \"false\" sits at offset 2 within block 1, meaning the bytes to flip live in block 0 of the ciphertext (CBC decryption XORs each plaintext block with the previous ciphertext block, not the current one). The delta is byte-by-byte: 'f'⊕'t'=0x12, 'a'⊕'r'=0x13, 'l'⊕'u'=0x19, 's'⊕'e'=0x16, 'e'⊕'!'=0x44 — XORing those five bytes into ciphertext block 0 at offset 2 flips block 1's decrypted plaintext to \"...n=true!\" while turning block 0 into unrecoverable garbage, which is exactly why this attack works on any block after the one you tamper with, but destroys the tampered block itself. This is the CBC bit-flipping section from the symmetric-key module, run as a full multi-byte forge instead of a single flipped byte.",
    ],
    relatedModules: ["symmetric-key-aes"],
  },

  // ---------------------------------------------------------------------
  // RSA
  // ---------------------------------------------------------------------
  {
    slug: "rsa-no-padding",
    title: "Move Fast",
    category: "RSA",
    difficulty: "medium",
    points: 25,
    summary: "A service encrypts short messages with RSA, e=3, and never bothers with padding. What could go wrong?",
    prompt: [
      "A startup's internal tool RSA-encrypts short flags for \"security\", using e = 3 because it's fast, and skips padding because \"it's just internal, who cares.\"",
      "The modulus is large — far larger than the cube of the message. That detail matters more than they think.",
    ],
    data: [
      {
        label: "Ciphertext (M³, as a decimal integer)",
        value:
          "33991036134426362306408271035380682121493070580665211788675360579490223508942835693335262741942843824374460748713009817248036667015315563859193016467479147541162698649036046326117551294737558849538859995285343129835402448927933152386159000451741900313303405330425041536491103934821",
      },
    ],
    hints: [
      "If M³ never exceeded the modulus, no modular reduction ever happened — the \"ciphertext\" is just an ordinary integer cube.",
      "Take the integer cube root, then convert the resulting number back to bytes (big-endian) and decode as ASCII.",
    ],
    flag: "cct{cub3_r00t_att4ck_n0_paddIng_n33ded}",
    explanation: [
      "Because e = 3 and the message was small enough that M³ stayed below the modulus, the modular reduction in C = Mᵉ mod n never actually triggered — the ciphertext given is simply M³ as a plain integer. Taking its exact integer cube root recovers M directly, with no private key, no factoring, and no modular arithmetic involved at all. This is precisely why OAEP padding exists: it pads M out to the full size of the modulus specifically so M³ always exceeds n and the reduction always happens, as covered in the RSA module's cube-root attack section.",
    ],
    relatedModules: ["rsa-public-key"],
  },
  {
    slug: "rsa-e-equals-one",
    title: "The Fastest Cipher",
    category: "RSA",
    difficulty: "easy",
    points: 15,
    summary: "An engineer wanted RSA encryption without the performance cost. They found a way.",
    prompt: [
      "\"RSA is too slow for our use case,\" the commit message says, \"so I set e = 1 — same security, way faster.\" The pull request was approved.",
      "Here's the \"ciphertext\" they're using in production.",
    ],
    data: [{ label: "Ciphertext (decimal integer)", value: "54346890045854400693635193847915839177343981221943352407185784970053957584700833987772292323202591869" }],
    hints: ["What does raising a number to the power of 1 actually do to it?"],
    flag: "cct{e_equ4ls_1_m34ns_n0_encrypt10n_4t_4ll}",
    explanation: [
      "With e = 1, C = M¹ mod n = M mod n — and since M is always chosen smaller than n to begin with, that's just M. The \"ciphertext\" is the plaintext, completely unchanged, converted straight back to bytes and decoded as ASCII: no private key, no math, not even a root extraction. This is the most extreme version of the small-exponent family of RSA mistakes covered in the RSA module — e = 3 without padding at least requires taking a cube root; e = 1 requires nothing at all.",
    ],
    relatedModules: ["rsa-public-key"],
  },
  {
    slug: "rsa-close-primes",
    title: "Too Close for Comfort",
    category: "RSA",
    difficulty: "hard",
    points: 70,
    summary: "A flawed key generator picked two primes that are suspiciously close together. This is scriptable in a few lines.",
    prompt: [
      "An RSA key was generated by a library with a bug: instead of picking two independent random primes, it picked one prime and then searched forward for the very next prime after it. The two primes end up close together — far closer than genuine randomness would ever produce.",
      "You'll want to write a short script for this one (Python with a big-integer square root, or any language with arbitrary-precision integers).",
    ],
    data: [
      { label: "n", value: "1919398208695729625013340256996074550440109025452193674473514632751887476196084741248469724237298976837480604700489316127" },
      { label: "e", value: "65537" },
      { label: "ciphertext", value: "1616228168952747584128258478470283795776380865684892525283626935861568080001076499128804605876219873757791007897534997175" },
    ],
    hints: [
      "Fermat's factorization: since p and q are close, n = a² − b² for a = (p+q)/2 and b = (p−q)/2, and a is only slightly larger than √n.",
      "Starting from a = ⌈√n⌉, increment a and check whether a² − n is a perfect square at each step. Once it is, p = a−b and q = a+b.",
      "With p and q recovered, compute φ(n) = (p−1)(q−1), then d = e⁻¹ mod φ(n), then M = cᵈ mod n — convert the resulting integer back to bytes to read the flag.",
    ],
    flag: "cct{f3rm4t_f4ct0r1z4t10n_cl0s3_pr1m3s}",
    explanation: [
      "The two primes differ by only 226 — astronomically closer than two independently random primes of that size would ever land by chance. Fermat's method exploits exactly this: because p and q are close, √n is a very good starting estimate for a = (p+q)/2, and the search for a perfect-square a²−n succeeds almost immediately rather than requiring anywhere near n's full search space. Once p and q are known, the rest is textbook RSA decryption. This is the RSA module's Fermat factorization section, run against a real (if toy-scale) 400-bit modulus rather than a hand-sized example — genuinely requiring a script, exactly like the real attack does.",
    ],
    relatedModules: ["rsa-public-key"],
  },
  {
    slug: "rsa-small-factors",
    title: "Just Factor It",
    category: "RSA",
    difficulty: "medium",
    points: 40,
    summary: "A modulus small enough that \"real\" RSA security assumptions don't apply at all.",
    prompt: [
      "Forget decrypting anything — just factor this modulus and give its smaller prime factor as the flag.",
    ],
    data: [{ label: "n", value: "5074492487" }],
    hints: [
      "This n is small enough that even naive trial division up to √n finishes in well under a second in any language.",
      "The flag is cct{smaller_factor}, where smaller_factor is the numeric value itself — no extra formatting.",
    ],
    flag: "cct{52021}",
    explanation: [
      "5,074,492,487 = 52,021 × 97,547 — both findable by simply testing every integer up to √n ≈ 71,235 as a potential divisor, which takes a script well under a second. This is the RSA module's core point about key size made concrete: a modulus needs to be large enough that its prime factors are computationally out of reach, and 5 billion is nowhere close to that bar — real RSA moduli are hundreds of digits long specifically so this exact technique takes longer than the age of the universe.",
    ],
    relatedModules: ["rsa-public-key"],
  },

  // ---------------------------------------------------------------------
  // Diffie-Hellman & ECC
  // ---------------------------------------------------------------------
  {
    slug: "dh-discrete-log",
    title: "Intercepted Exchange",
    category: "Diffie-Hellman & ECC",
    difficulty: "medium",
    points: 40,
    summary: "You've intercepted a Diffie-Hellman public value. Recover the private exponent behind it.",
    prompt: [
      "You've captured one side of a Diffie-Hellman exchange: the prime, the generator, and the public value. The private exponent itself was never transmitted — that's the whole point of DH. Recover it anyway.",
      "Brute force from zero will take too long. There's a faster way.",
    ],
    data: [
      { label: "p", value: "1000000007" },
      { label: "g", value: "5" },
      { label: "h (= g^x mod p)", value: "208627527" },
    ],
    hints: [
      "Baby-step giant-step solves this in roughly √p steps instead of up to p steps — about 31,623 operations instead of up to a billion.",
      "The flag is cct{x}, where x is the recovered exponent.",
    ],
    flag: "cct{918273645}",
    explanation: [
      "Baby-step giant-step splits the exponent search into two halves that meet in the middle: precompute a table of gʲ for every j up to m = ⌈√p⌉, then repeatedly multiply h by g⁻ᵐ until a match against that table appears. The exponent recovered this way is x = 918,273,645 — a value naive brute force would take hundreds of millions of steps to reach, but BSGS finds in about 31,623 regardless of how large x actually is within the range. This is the exact algorithm covered in the Diffie-Hellman module's \"breaking small discrete logs\" section, run against a prime large enough that only the efficient algorithm finishes in reasonable time.",
    ],
    relatedModules: ["diffie-hellman-key-exchange"],
  },
  {
    slug: "dh-small-subgroup",
    title: "A Suspicious Generator",
    category: "Diffie-Hellman & ECC",
    difficulty: "medium",
    points: 35,
    summary: "An active attacker swapped the generator before the exchange completed. The shared secret only has two possible values now.",
    prompt: [
      "A man-in-the-middle intercepted a Diffie-Hellman exchange and substituted a malicious generator with order exactly 2, before either side computed a shared secret. Whatever secret resulted, it can only be one of two possible values — regardless of either party's actual private exponent.",
      "The flag below was XORed with that shared secret (reduced to a single byte). Try both candidate keys.",
    ],
    data: [
      { label: "p", value: "1000000007" },
      { label: "g (the substituted generator, = p − 1)", value: "1000000006" },
      { label: "ciphertext (hex)", value: "6565727d756b326a6a59757364617436737659653668603768636b6368727b" },
    ],
    hints: [
      "An element of order 2 raised to any power is either 1 (even exponent) or itself, p−1 (odd exponent) — there is no third option.",
      "Try XORing the ciphertext with key byte 1, then with key byte (p−1) mod 256, and see which one produces a readable flag.",
    ],
    flag: "cct{sm4ll_subgr0up_c0nf1nement}",
    explanation: [
      "With g = p−1 ≡ −1 (mod p), g raised to any power is either 1 (if the exponent is even) or p−1 (if it's odd) — the shared secret is confined to exactly one of those two values no matter how large or random the real private exponents were. Trying key byte 1 produces garbage; trying (p−1) mod 256 = 6 decrypts cleanly to the flag. This is the small-subgroup confinement attack from the Diffie-Hellman module, and it's exactly why real implementations validate that a received public value actually has a large order before using it — not just that it's in the right numeric range.",
    ],
    relatedModules: ["diffie-hellman-key-exchange"],
  },
  {
    slug: "ecc-toy-discrete-log",
    title: "Recover the Signing Key",
    category: "Diffie-Hellman & ECC",
    difficulty: "medium",
    points: 25,
    summary: "A toy elliptic curve, a public key, and the private key that produced it — small enough to brute force by hand.",
    prompt: [
      "A signing scheme uses the curve y² = x³ + 2x + 2 (mod 17), with base point G = (5, 1). The signer's public key Q = kG has leaked. Recover their private key k.",
    ],
    data: [{ label: "Curve", value: "y² = x³ + 2x + 2 (mod 17), G = (5, 1), curve order 19" }, { label: "Q", value: "(9, 1)" }],
    hints: [
      "With only 19 possible scalars (1 through 19), just compute G, 2G, 3G, ... by repeated point addition until one matches Q.",
      "The flag is cct{k}, where k is the private key you recover.",
    ],
    flag: "cct{14}",
    explanation: [
      "Computing successive multiples of G by hand — 2G=(6,3), 3G=(10,6), ..., all the way to 14G=(9,1) — finds the match at k = 14 within 19 possible values, trivial at this toy scale. The identical computation over a real 256-bit curve is the elliptic curve discrete logarithm problem, and the reason it's infeasible there isn't a different algorithm — it's that the search space grows from 19 possibilities to roughly 2²⁵⁶, exactly the point the ECC module's \"brute-forcing a small elliptic curve discrete log\" section makes.",
    ],
    relatedModules: ["elliptic-curve-cryptography"],
  },
];

export function getChallenge(slug: string): Challenge | undefined {
  return challenges.find((c) => c.slug === slug);
}
