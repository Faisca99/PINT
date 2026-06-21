export function SoftinsaLogo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(217, 71%, 38%)" />
          <stop offset="100%" stopColor="hsl(199, 89%, 48%)" />
        </linearGradient>
      </defs>
      {/* Hexágono exterior */}
      <path d="M20 2L35.6 11V29L20 38L4.4 29V11L20 2Z" fill="url(#sg)" />
      {/* Brilho interno */}
      <path d="M20 8L29.9 14V26L20 32L10.1 26V14L20 8Z" fill="white" fillOpacity="0.15" />
      {/* Linha de luz no topo */}
      <path d="M12 14L20 9.5L28 14" stroke="white" strokeOpacity="0.3" strokeWidth="0.8" strokeLinecap="round" />
      {/* Letra S */}
      <text
        x="20"
        y="25"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        S
      </text>
    </svg>
  );
}
