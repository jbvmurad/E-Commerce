interface CyberLogoProps {
  size?: number;
  accent?: string;
}

export function CyberLogo({ size = 32, accent = '#00f5ff' }: CyberLogoProps) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor="#ff00ff" />
        </linearGradient>
        <filter id="logo-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Hexagon outer */}
      <path
        d="M20 2 L35 11 L35 29 L20 38 L5 29 L5 11 Z"
        stroke="url(#logo-grad)"
        strokeWidth="1.5"
        fill="none"
        filter="url(#logo-glow)"
      />
      {/* Inner hex */}
      <path
        d="M20 8 L30 14 L30 26 L20 32 L10 26 L10 14 Z"
        fill="url(#logo-grad)"
        opacity="0.12"
      />
      {/* E letter paths - circuit style */}
      <line x1="14" y1="13" x2="26" y2="13" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="13" x2="14" y2="27" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="20" x2="23" y2="20" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="27" x2="26" y2="27" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      {/* Circuit nodes */}
      <circle cx="26" cy="13" r="1.5" fill="#ff00ff" />
      <circle cx="23" cy="20" r="1.5" fill={accent} />
      <circle cx="26" cy="27" r="1.5" fill="#ff00ff" />
    </svg>
  );
}
