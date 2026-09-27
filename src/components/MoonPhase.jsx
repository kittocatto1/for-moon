// A moon at any phase. `lit` goes from 0 (new) to 1 (full), waxing from the right.
export default function MoonPhase({ lit = 1, size = 16, className = "", dark = "rgba(236,232,220,0.12)" }) {
  const r = 10;
  const c = 12;
  const k = Math.min(1, Math.max(0, lit));
  const rx = Math.abs(1 - 2 * k) * r;
  const sweep = k < 0.5 ? 0 : 1;
  const d = `M${c} ${c - r} A${r} ${r} 0 0 1 ${c} ${c + r} A${rx} ${r} 0 0 ${sweep} ${c} ${c - r} Z`;

  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx={c} cy={c} r={r} fill={dark} />
      {k > 0.01 && <path d={d} fill="var(--moon)" />}
    </svg>
  );
}
