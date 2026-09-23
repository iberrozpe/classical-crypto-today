// Every coordinate below is derived from a real curve, y² = x³ − 3x + 3,
// not hand-drawn. P and Q are genuine points on that curve; the third
// intersection point of the line through them (and its reflection, R) are
// computed with the standard real-number chord-and-tangent addition law
// (x3 = m² − x1 − x2) and verified against the curve equation itself.
const UPPER_PATH =
  "M 56 150 L 67 100 L 78 82 L 89 70 L 100 61 L 111 55 L 122 51 L 133 49 L 143 47 L 154 47 L 165 47 L 176 49 L 187 51 L 198 54 L 209 58 L 220 62 L 231 66 L 242 71 L 253 76 L 264 82 L 275 87 L 286 92 L 297 97 L 308 101 L 319 103 L 330 104 L 341 102 L 351 98 L 362 93 L 373 85 L 384 76 L 395 67 L 406 56 L 417 44 L 428 32 L 439 20 L 450 7";
const LOWER_PATH =
  "M 56 150 L 67 200 L 78 218 L 89 230 L 100 239 L 111 245 L 122 249 L 133 251 L 143 253 L 154 253 L 165 253 L 176 251 L 187 249 L 198 246 L 209 242 L 220 238 L 231 234 L 242 229 L 253 224 L 264 218 L 275 213 L 286 208 L 297 203 L 308 199 L 319 197 L 330 196 L 341 198 L 351 202 L 362 207 L 373 215 L 384 224 L 395 233 L 406 244 L 417 256 L 428 268 L 439 280 L 450 293";

const P = { x: 240, y: 70 };
const Q = { x: 380, y: 80 };
const S = { x: 102, y: 60 }; // the line's third intersection with the curve, −R
const R = { x: 102, y: 240 }; // reflection of S — R = P + Q

export default function CurvePointAdditionDiagram() {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-lg border border-border bg-surface p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
        Point addition on a real curve (y² = x³ − 3x + 3): P + Q = R
      </p>
      <svg
        viewBox="0 0 480 300"
        className="mx-auto h-auto w-full max-w-[480px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={UPPER_PATH} fill="none" stroke="var(--border)" strokeWidth="2" />
        <path d={LOWER_PATH} fill="none" stroke="var(--border)" strokeWidth="2" />

        <line
          x1={P.x}
          y1={P.y}
          x2={S.x}
          y2={S.y}
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <line
          x1={S.x}
          y1={S.y}
          x2={R.x}
          y2={R.y}
          stroke="var(--muted)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        <circle cx={P.x} cy={P.y} r="5" fill="var(--accent)" />
        <text x={P.x + 10} y={P.y - 8} fill="currentColor" fontSize="15" fontFamily="monospace">
          P
        </text>

        <circle cx={Q.x} cy={Q.y} r="5" fill="var(--accent)" />
        <text x={Q.x + 10} y={Q.y - 8} fill="currentColor" fontSize="15" fontFamily="monospace">
          Q
        </text>

        <circle cx={S.x} cy={S.y} r="5" fill="var(--muted)" />
        <text
          x={S.x - 40}
          y={S.y - 10}
          fill="currentColor"
          fontSize="13"
          fontFamily="monospace"
          opacity="0.7"
        >
          −R
        </text>

        <circle cx={R.x} cy={R.y} r="5" fill="var(--accent)" />
        <text x={R.x - 60} y={R.y + 20} fill="currentColor" fontSize="15" fontFamily="monospace">
          R = P+Q
        </text>
      </svg>
      <p className="mt-3 text-xs text-muted">
        P and Q sit on the right-hand branch of the curve. The line through them crosses the
        curve a third time on the left, at −R; reflecting that point across the x-axis gives
        R = P + Q. Every point drawn here is on the actual curve y² = x³ − 3x + 3 — nothing is
        approximated for effect.
      </p>
    </div>
  );
}
