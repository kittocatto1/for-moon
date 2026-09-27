import { useId } from "react";

// A soft, slightly tilted crescent with a faint glow.
export default function Crescent({ size = 120, glow = true, className = "" }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id={`g${id}`} cx="35%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#f6f3ea" />
          <stop offset="100%" stopColor="#cfccc2" />
        </radialGradient>
        <radialGradient id={`h${id}`}>
          <stop offset="0%" stopColor="rgba(236,232,220,0.16)" />
          <stop offset="100%" stopColor="rgba(236,232,220,0)" />
        </radialGradient>
        <mask id={`m${id}`}>
          <rect width="100" height="100" fill="white" />
          <circle cx="62" cy="40" r="34" fill="black" />
        </mask>
      </defs>
      {glow && <circle cx="46" cy="52" r="70" fill={`url(#h${id})`} />}
      <g transform="rotate(-18 50 50)">
        <circle cx="46" cy="52" r="38" fill={`url(#g${id})`} mask={`url(#m${id})`} />
      </g>
    </svg>
  );
}
