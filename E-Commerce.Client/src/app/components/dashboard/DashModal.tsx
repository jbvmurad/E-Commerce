import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface DashModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
  accent?: string;
}

export function DashModal({ open, onClose, title, children, footer, width = 'max-w-lg', accent = '#00f5ff' }: DashModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ background: 'rgba(2,4,8,0.8)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div className={`relative w-full ${width} mx-4 max-h-[90vh] flex flex-col`}
        style={{ background: 'rgba(0,245,255,0.04)', border: `1px solid ${accent}35`, borderRadius: 8, boxShadow: `0 0 60px rgba(0,0,0,0.9), 0 0 40px ${accent}08`, backdropFilter: 'blur(20px)', fontFamily: 'DM Sans, sans-serif' }}>
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: `1px solid ${accent}15` }}>
          <h2 className="text-sm font-semibold" style={{ color: accent, textShadow: `0 0 10px ${accent}50`, fontFamily: 'Playfair Display, serif', letterSpacing: '0.04em' }}>{title}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded transition-all"
            style={{ color: 'rgba(224,247,255,0.4)', border: '1px solid rgba(0,245,255,0.1)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = accent; (e.currentTarget as HTMLButtonElement).style.borderColor = `${accent}40`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(224,247,255,0.4)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,245,255,0.1)'; }}>
            <X size={15} />
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="px-5 py-4 flex justify-end gap-2" style={{ borderTop: `1px solid ${accent}15` }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
