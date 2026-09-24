import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted">
        <p>
          Classical Crypto Today — an educational reference for the cryptography running the
          internet right now (RSA, ECC, AES, TLS) and why it&apos;s being replaced.
        </p>
        <p className="mt-2">
          Every Playground tool runs on your browser&apos;s own Web Crypto API — nothing simulated,
          nothing sent to a server.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <Link href="/about" className="underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-accent">
            About
          </Link>
          <Link href="/references" className="underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-accent">
            References
          </Link>
          <Link href="/changelog" className="underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-accent">
            Changelog
          </Link>
          <a
            href="https://github.com/iberrozpe/classical-crypto-today"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-accent"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
