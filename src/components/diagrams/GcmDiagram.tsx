function Box({ x, y, w, h, label, dashed }: { x: number; y: number; w: number; h: number; label: string; dashed?: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="7"
        fill="var(--background)"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fill="currentColor" fontSize="11" fontFamily="monospace">
        {label}
      </text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--accent)" strokeWidth="1.5" markerEnd="url(#gcm-arrow)" />
  );
}

function Op({ cx, cy, symbol }: { cx: number; cy: number; symbol: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="15" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.5" />
      <text x={cx} y={cy + 5} textAnchor="middle" fill="var(--accent)" fontSize="15" fontWeight="700">
        {symbol}
      </text>
    </g>
  );
}

export default function GcmDiagram() {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-lg border border-border bg-surface p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
        GCM: counter-mode encryption + GHASH authentication
      </p>
      <svg viewBox="0 0 480 260" className="mx-auto h-auto w-full max-w-[480px]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="gcm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
          </marker>
        </defs>

        <text x="10" y="18" fill="var(--muted)" fontSize="10" fontFamily="monospace" letterSpacing="0.05em">
          ENCRYPTION
        </text>
        <Box x={20} y={28} w={80} h={38} label="J0 + 1" />
        <Arrow x1={100} y1={47} x2={132} y2={47} />
        <Box x={134} y={28} w={80} h={38} label="AES_K" />
        <Arrow x1={214} y1={47} x2={246} y2={47} />
        <Op cx={261} cy={47} symbol="⊕" />
        <Arrow x1={276} y1={47} x2={308} y2={47} />
        <Box x={310} y={28} w={100} h={38} label="Ciphertext" />

        <line x1={261} y1={10} x2={261} y2={32} stroke="var(--muted)" strokeWidth="1.5" markerEnd="url(#gcm-arrow)" />
        <text x={261} y="8" textAnchor="middle" fill="var(--muted)" fontSize="10" fontFamily="monospace">
          Plaintext
        </text>

        <line x1={360} y1={66} x2={360} y2={112} stroke="var(--accent)" strokeWidth="1.5" markerEnd="url(#gcm-arrow)" />

        <text x="10" y="104" fill="var(--muted)" fontSize="10" fontFamily="monospace" letterSpacing="0.05em">
          AUTHENTICATION
        </text>
        <Box x={280} y={114} w={100} h={38} label="Ciphertext" />
        <Arrow x1={280} y1={133} x2={248} y2={133} />
        <Box x={168} y={114} w={78} h={38} label="× H (GHASH)" />
        <Arrow x1={168} y1={133} x2={136} y2={133} />
        <Op cx={121} cy={133} symbol="⊕" />
        <Arrow x1={106} y1={133} x2={74} y2={133} />
        <Box x={20} y={186} w={100} h={38} label="AES_K(J0)" dashed />
        <line x1={70} y1={186} x2={121} y2={148} stroke="var(--muted)" strokeWidth="1.5" markerEnd="url(#gcm-arrow)" />

        <text x={121} y="163" textAnchor="middle" fill="currentColor" fontSize="12" fontFamily="monospace" fontWeight="700">
          Tag
        </text>
      </svg>
      <p className="mt-3 text-xs text-muted">
        Shown for a single plaintext block; longer messages chain more ciphertext blocks through
        the same GHASH multiplication before the final XOR that produces the tag.
      </p>
    </div>
  );
}
