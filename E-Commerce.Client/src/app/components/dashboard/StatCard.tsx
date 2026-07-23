import { TrendingUp, TrendingDown } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: ReactNode;
  accent?: string;
}

export function StatCard({ title, value, change, icon, accent = '#00f5ff' }: StatCardProps) {
  const isPos = change >= 0;
  return (
    <div className="flex flex-col gap-4 p-5 rounded transition-all duration-300"
      style={{
        background: 'rgba(0,245,255,0.04)',
        border: `1px solid ${accent}25`,
        fontFamily: 'DM Sans, sans-serif',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.border = `1px solid ${accent}35`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 24px ${accent}12`; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.border = `1px solid ${accent}15`; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(224,247,255,0.45)', letterSpacing: '0.08em' }}>{title}</p>
        <div className="w-9 h-9 rounded flex items-center justify-center"
          style={{ background: `${accent}12`, border: `1px solid ${accent}20`, color: accent, filter: `drop-shadow(0 0 6px ${accent}50)` }}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: accent, textShadow: `0 0 20px ${accent}50`, fontFamily: 'Playfair Display, serif' }}>{value}</p>
        <div className={`mt-1.5 flex items-center gap-1 text-xs font-medium`}
          style={{ color: isPos ? '#4ade80' : '#ff5555' }}>
          {isPos ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span>{isPos ? '+' : ''}{change}% geçen aya göre</span>
        </div>
      </div>
    </div>
  );
}
