export function ProductGlyph({ kind }: { kind: "command" | "box" | "integrations" }) {
  if (kind === "command") {
    return (
      <svg viewBox="0 0 120 72" className="h-16 w-full" aria-hidden>
        <rect x="8" y="18" width="40" height="28" rx="4" fill="none" stroke="rgba(34,211,238,0.7)" />
        <rect x="72" y="10" width="40" height="28" rx="4" fill="none" stroke="rgba(255,255,255,0.35)" />
        <rect x="48" y="38" width="40" height="28" rx="4" fill="none" stroke="rgba(34,211,238,0.8)" />
        <path
          d="M48 32 H72 M68 24 H88 M68 52 H88"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="1.4"
        />
      </svg>
    );
  }
  if (kind === "box") {
    return (
      <svg viewBox="0 0 120 72" className="h-16 w-full" aria-hidden>
        <path
          d="M60 8 L104 28 L60 48 L16 28 Z"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.3"
        />
        <path d="M16 28 V52 L60 72 V48" fill="none" stroke="rgba(255,255,255,0.28)" />
        <path d="M104 28 V52 L60 72" fill="none" stroke="rgba(255,255,255,0.28)" />
        <path
          d="M38 38 L60 48 L82 38"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="1.6"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 72" className="h-16 w-full" aria-hidden>
      <circle cx="24" cy="36" r="6" fill="none" stroke="rgba(34,211,238,0.75)" />
      <circle cx="60" cy="18" r="6" fill="none" stroke="rgba(255,255,255,0.4)" />
      <circle cx="96" cy="36" r="6" fill="none" stroke="rgba(255,255,255,0.4)" />
      <circle cx="60" cy="54" r="6" fill="none" stroke="rgba(34,211,238,0.9)" />
      <path
        d="M30 36 H54 M66 18 L90 36 M66 54 L90 36 M30 36 L54 54"
        fill="none"
        stroke="#22d3ee"
        strokeWidth="1.3"
      />
    </svg>
  );
}
