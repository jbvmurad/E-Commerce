interface DashBadgeProps {
  variant: 'yellow' | 'orange' | 'blue' | 'green' | 'red';
  children: React.ReactNode;
}

const styles: Record<DashBadgeProps['variant'], { color: string; bg: string; border: string; glow: string }> = {
  yellow: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)', glow: 'rgba(251,191,36,0.15)' },
  orange: { color: '#fb923c', bg: 'rgba(251,146,60,0.1)',  border: 'rgba(251,146,60,0.25)', glow: 'rgba(251,146,60,0.15)' },
  blue:   { color: '#00f5ff', bg: 'rgba(0,245,255,0.08)',  border: 'rgba(0,245,255,0.25)',  glow: 'rgba(0,245,255,0.15)'  },
  green:  { color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.25)', glow: 'rgba(74,222,128,0.15)' },
  red:    { color: '#ff00ff', bg: 'rgba(255,0,255,0.08)',  border: 'rgba(255,0,255,0.25)',  glow: 'rgba(255,0,255,0.15)'  },
};

export function DashBadge({ variant, children }: DashBadgeProps) {
  const s = styles[variant];
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded"
      style={{
        color: s.color, background: s.bg,
        border: `1px solid ${s.border}`,
        boxShadow: `0 0 8px ${s.glow}`,
        fontFamily: 'DM Sans, sans-serif',
        borderRadius: 4,
      }}>
      {children}
    </span>
  );
}
