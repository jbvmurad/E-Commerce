// Shared cyberpunk panel theme — mirrors main site's CSS variables exactly
export const CYAN    = '#00f5ff';
export const MAGENTA = '#ff00ff';
export const GREEN   = '#4ade80';
export const YELLOW  = '#fbbf24';
export const BG_MAIN = '#020408';
export const BG_CARD = 'rgba(0,245,255,0.04)';
export const BORDER  = 'rgba(0,245,255,0.15)';
export const BORDER_HOVER = 'rgba(0,245,255,0.35)';
export const TEXT    = 'rgba(224,247,255,0.85)';
export const MUTED   = 'rgba(224,247,255,0.45)';

export const cardStyle: React.CSSProperties = {
  background: BG_CARD,
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
};

export const cardHoverStyle: React.CSSProperties = {
  background: BG_CARD,
  border: `1px solid ${BORDER_HOVER}`,
  borderRadius: 8,
  boxShadow: `0 0 24px rgba(0,245,255,0.08)`,
};

export const headStyle: React.CSSProperties = {
  color: CYAN,
  fontFamily: 'Playfair Display, serif',
  letterSpacing: '0.06em',
  textShadow: `0 0 20px ${CYAN}`,
};

export const mutedStyle: React.CSSProperties = {
  color: MUTED,
  fontSize: 12,
  fontFamily: 'DM Sans, sans-serif',
};

export const thStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 600,
  color: 'rgba(224,247,255,0.4)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  padding: '12px 20px',
  textAlign: 'left' as const,
  borderBottom: `1px solid ${BORDER}`,
  background: 'rgba(0,245,255,0.03)',
  fontFamily: 'DM Sans, sans-serif',
};

export const trHover = {
  onMouseEnter: (e: React.MouseEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.background = 'rgba(0,245,255,0.04)';
  },
  onMouseLeave: (e: React.MouseEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.background = 'transparent';
  },
};

export const btnCyan: React.CSSProperties = {
  background: 'rgba(0,245,255,0.08)',
  border: `1px solid ${CYAN}50`,
  color: CYAN,
  borderRadius: 6,
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontFamily: 'DM Sans, sans-serif',
  transition: 'all 0.2s',
};

export const btnMagenta: React.CSSProperties = {
  background: 'rgba(255,0,255,0.08)',
  border: `1px solid ${MAGENTA}50`,
  color: MAGENTA,
  borderRadius: 6,
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontFamily: 'DM Sans, sans-serif',
};

export const btnGhost: React.CSSProperties = {
  background: 'transparent',
  border: `1px solid ${BORDER}`,
  color: 'rgba(224,247,255,0.6)',
  borderRadius: 6,
  padding: '8px 16px',
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: 'DM Sans, sans-serif',
};

export const cyberTooltipStyle: React.CSSProperties = {
  background: BG_CARD,
  border: `1px solid ${BORDER}`,
  borderRadius: 6,
  padding: '8px 12px',
  fontSize: 12,
  fontFamily: 'DM Sans, sans-serif',
  boxShadow: '0 0 20px rgba(0,0,0,0.8)',
};
