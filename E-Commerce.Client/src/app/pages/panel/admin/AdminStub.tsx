import { Construction } from 'lucide-react';

const CYAN = '#00f5ff';

export function AdminStub({ title, description = 'Bu sayfa yakında kullanıma açılacaktır.' }: { title: string; description?: string }) {
  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }} className="space-y-5">
      <h1 style={{ color: CYAN, fontFamily: 'Playfair Display, serif', fontSize: 22, letterSpacing: '0.04em', textShadow: `0 0 12px ${CYAN}50` }}>{title.toUpperCase()}</h1>
      <div className="flex flex-col items-center justify-center py-24 rounded"
        style={{ background: '#050d15', border: '1px solid rgba(0,245,255,0.12)', borderRadius: 6 }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
          style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)' }}>
          <Construction size={22} style={{ color: CYAN, filter: `drop-shadow(0 0 6px ${CYAN}80)` }} />
        </div>
        <p className="text-sm font-medium" style={{ color: 'rgba(224,247,255,0.7)' }}>{title}</p>
        <p className="text-xs mt-1" style={{ color: 'rgba(224,247,255,0.35)' }}>{description}</p>
      </div>
    </div>
  );
}
