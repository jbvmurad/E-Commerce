import { Search } from 'lucide-react';
import { InputHTMLAttributes } from 'react';

interface DashSearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  width?: string;
  accent?: string;
}

export function DashSearchInput({ width = 'w-72', className = '', accent = '#00f5ff', ...props }: DashSearchInputProps) {
  return (
    <div className={`relative ${width}`}>
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: `${accent}60` }} />
      <input
        type="text"
        className={`w-full h-9 pl-9 pr-3 text-sm rounded transition-all outline-none ${className}`}
        style={{
          background: 'rgba(0,245,255,0.04)',
          border: `1px solid ${accent}20`,
          color: 'rgba(224,247,255,0.85)',
          fontFamily: 'DM Sans, sans-serif',
          borderRadius: 4,
        }}
        onFocus={(e) => {
          e.target.style.border = `1px solid ${accent}50`;
          e.target.style.boxShadow = `0 0 0 2px ${accent}10`;
        }}
        onBlur={(e) => {
          e.target.style.border = `1px solid ${accent}20`;
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      />
    </div>
  );
}
