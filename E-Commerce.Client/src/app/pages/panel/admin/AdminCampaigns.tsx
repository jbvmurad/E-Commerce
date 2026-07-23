import { useState } from 'react';
import { Plus, Megaphone, Calendar, Tag, MoreVertical } from 'lucide-react';
import { DashBadge } from '../../../components/dashboard/DashBadge';
import { useToast, ToastContainer } from '../../../components/dashboard/DashToast';

const CYAN = '#00f5ff'; const MAGENTA = '#ff00ff';
const cardStyle = { background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.15)', borderRadius: 8 };
const headStyle: React.CSSProperties = { color: CYAN, fontFamily: 'Playfair Display, serif', letterSpacing: '0.06em', textShadow: `0 0 20px ${CYAN}` };

const campaigns = [
  { id:1, name:'Yaz İndirimi 2026',   discount:'%30', category:'Tüm Ürünler', start:'01.06.2026', end:'30.06.2026', status:'Aktif',    uses:1248, revenue:'₺842K' },
  { id:2, name:'Elektronik Günleri',  discount:'%20', category:'Elektronik',   start:'10.06.2026', end:'20.06.2026', status:'Aktif',    uses: 684, revenue:'₺1.2M' },
  { id:3, name:'Üye Özel İndirim',    discount:'%15', category:'Tüm Ürünler', start:'01.05.2026', end:'31.12.2026', status:'Aktif',    uses:3420, revenue:'₺2.8M' },
  { id:4, name:'Hoş Geldin Kuponu',   discount:'%10', category:'İlk Sipariş', start:'01.01.2026', end:'31.12.2026', status:'Aktif',    uses: 892, revenue:'₺312K' },
  { id:5, name:'Bahar Kampanyası',    discount:'%25', category:'Giyim',        start:'01.03.2026', end:'31.05.2026', status:'Bitti',    uses:2140, revenue:'₺984K' },
  { id:6, name:'Flash Satış',         discount:'%50', category:'Seçili Ürünler', start:'15.06.2026', end:'15.06.2026', status:'Planlı', uses:   0, revenue:'—' },
];

export function AdminCampaigns() {
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const { toasts, show, remove } = useToast();

  const statusVariant = (s: string) => s === 'Aktif' ? 'green' : s === 'Planlı' ? 'blue' : 'red';

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ ...headStyle, fontSize: 22 }}>KAMPANYALAR</h1>
          <p style={{ color: 'rgba(224,247,255,0.4)', fontSize: 12 }} className="mt-0.5">{campaigns.filter(c => c.status === 'Aktif').length} aktif kampanya</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition-all"
          style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.35)', color: CYAN, borderRadius: 4 }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,245,255,0.15)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,245,255,0.08)'; }}>
          <Plus size={15} /> Kampanya Oluştur
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {campaigns.map((c) => (
          <div key={c.id} className="p-5 rounded transition-all duration-200"
            style={cardStyle}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(0,245,255,0.3)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 20px rgba(0,245,255,0.06)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(0,245,255,0.15)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                  style={{ background: `${CYAN}10`, border: `1px solid ${CYAN}20` }}>
                  <Megaphone size={18} style={{ color: CYAN, filter: `drop-shadow(0 0 4px ${CYAN}80)` }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'rgba(224,247,255,0.9)' }}>{c.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <DashBadge variant={statusVariant(c.status) as any}>{c.status}</DashBadge>
                  </div>
                </div>
              </div>
              <div className="relative">
                <button onClick={() => setMenuOpen(menuOpen === c.id ? null : c.id)}
                  className="w-7 h-7 flex items-center justify-center rounded"
                  style={{ color: 'rgba(224,247,255,0.35)', border: '1px solid rgba(0,245,255,0.1)' }}>
                  <MoreVertical size={14} />
                </button>
                {menuOpen === c.id && (
                  <div className="absolute right-0 top-full mt-1 w-32 py-1 z-10"
                    style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.25)', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.8)' }}>
                    {['Düzenle', 'Durdur', 'Sil'].map((a) => (
                      <button key={a} className="flex w-full px-3 py-1.5 text-xs transition-colors"
                        style={{ color: a === 'Sil' ? MAGENTA : 'rgba(224,247,255,0.7)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = a === 'Sil' ? 'rgba(255,0,255,0.08)' : 'rgba(0,245,255,0.06)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        onClick={() => { setMenuOpen(null); show(`${a} uygulandı.`, 'success'); }}>{a}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="flex items-center gap-2">
                <Tag size={13} style={{ color: CYAN, opacity: 0.7 }} />
                <span style={{ fontSize: 12, color: 'rgba(224,247,255,0.55)' }}>{c.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ background: 'rgba(0,245,255,0.1)', color: CYAN, border: '1px solid rgba(0,245,255,0.2)' }}>
                  {c.discount} İNDİRİM
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={12} style={{ color: 'rgba(224,247,255,0.35)' }} />
                <span style={{ fontSize: 11, color: 'rgba(224,247,255,0.45)' }}>{c.start} — {c.end}</span>
              </div>
              <div className="text-right">
                <span style={{ fontSize: 13, fontWeight: 600, color: '#4ade80' }}>{c.revenue}</span>
                <span style={{ fontSize: 11, color: 'rgba(224,247,255,0.4)', marginLeft: 4 }}>{c.uses} kullanım</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}
