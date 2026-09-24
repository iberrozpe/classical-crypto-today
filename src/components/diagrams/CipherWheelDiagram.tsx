const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const SHIFT = 3;

function pointOn(radius: number, index: number, cx: number, cy: number) {
  const angle = (index / 26) * 2 * Math.PI - Math.PI / 2;
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

export default function CipherWheelDiagram() {
  const cx = 200;
  const cy = 200;
  const outerRadius = 175;
  const innerRadius = 130;

  return (
    <div className="not-prose my-6 overflow-x-auto rounded-lg border border-border bg-surface p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
        A Caesar cipher wheel, shift 3 — the outer ring is plaintext, the inner ring is ciphertext
      </p>
      <svg viewBox="0 0 400 400" className="mx-auto h-auto w-full max-w-[360px]" xmlns="http://www.w3.org/2000/svg">
        <circle cx={cx} cy={cy} r={outerRadius + 18} fill="none" stroke="var(--border)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={innerRadius - 18} fill="none" stroke="var(--border)" strokeWidth="1" />

        {ALPHABET.map((letter, i) => {
          // Both rings use the same angular slot i, so letters radially aligned
          // at the same angle are the actual plaintext/ciphertext pair.
          const outer = pointOn(outerRadius, i, cx, cy);
          const inner = pointOn(innerRadius, i, cx, cy);
          const innerLetter = ALPHABET[(i + SHIFT) % 26];
          const highlighted = i === 0;
          return (
            <g key={letter}>
              <text
                x={outer.x}
                y={outer.y + 4}
                textAnchor="middle"
                fontSize="13"
                fontFamily="monospace"
                fontWeight={highlighted ? 700 : 400}
                fill={highlighted ? "var(--accent)" : "currentColor"}
              >
                {letter}
              </text>
              <text
                x={inner.x}
                y={inner.y + 4}
                textAnchor="middle"
                fontSize="12"
                fontFamily="monospace"
                fontWeight={highlighted ? 700 : 400}
                fill={highlighted ? "var(--accent)" : "var(--muted)"}
              >
                {innerLetter}
              </text>
            </g>
          );
        })}

        <line
          x1={pointOn(outerRadius - 20, 0, cx, cy).x}
          y1={pointOn(outerRadius - 20, 0, cx, cy).y}
          x2={pointOn(innerRadius + 16, 0, cx, cy).x}
          y2={pointOn(innerRadius + 16, 0, cx, cy).y}
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        <circle cx={cx} cy={cy} r="3" fill="var(--muted)" />
      </svg>
      <p className="mt-3 text-xs text-muted">
        Rotate the inner ring by 3 and every plaintext letter (outer) lines up, at the same angle,
        with its ciphertext letter (inner): A → D, as highlighted. Rotate it by a different amount
        and you get a different one of the 26 possible shift ciphers — the entire secret is which
        of those 26 rotations was used.
      </p>
    </div>
  );
}
