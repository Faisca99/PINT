import type { Lang } from "@/lib/i18n";

/**
 * Bandeiras em SVG (PT / EN-UK / ES).
 * Usado em vez de emojis 🇵🇹🇬🇧🇪🇸 porque o Windows não renderiza
 * emojis de bandeira de país.
 */
export function FlagIcon({ code, className = "w-5 h-3.5" }: { code: Lang; className?: string }) {
  const wrap = `inline-block overflow-hidden rounded-[2px] ring-1 ring-black/10 align-middle shrink-0 ${className}`;

  if (code === "pt") {
    return (
      <svg viewBox="0 0 24 16" className={wrap} aria-label="Português" role="img">
        <rect width="24" height="16" fill="#da291c" />
        <rect width="9.6" height="16" fill="#046a38" />
        <circle cx="9.6" cy="8" r="3" fill="#ffe000" stroke="#fff" strokeWidth="0.6" />
        <circle cx="9.6" cy="8" r="1.4" fill="#da291c" />
      </svg>
    );
  }

  if (code === "es") {
    return (
      <svg viewBox="0 0 24 16" className={wrap} aria-label="Español" role="img">
        <rect width="24" height="16" fill="#c60b1e" />
        <rect y="4" width="24" height="8" fill="#ffc400" />
      </svg>
    );
  }

  // en — Union Jack simplificada
  return (
    <svg viewBox="0 0 24 16" className={wrap} aria-label="English" role="img">
      <rect width="24" height="16" fill="#012169" />
      {/* diagonais brancas */}
      <path d="M0 0 L24 16 M24 0 L0 16" stroke="#fff" strokeWidth="3.2" />
      {/* diagonais vermelhas */}
      <path d="M0 0 L24 16 M24 0 L0 16" stroke="#c8102e" strokeWidth="1.4" />
      {/* cruz branca */}
      <rect x="9.5" width="5" height="16" fill="#fff" />
      <rect y="5.5" width="24" height="5" fill="#fff" />
      {/* cruz vermelha */}
      <rect x="10.5" width="3" height="16" fill="#c8102e" />
      <rect y="6.5" width="24" height="3" fill="#c8102e" />
    </svg>
  );
}
