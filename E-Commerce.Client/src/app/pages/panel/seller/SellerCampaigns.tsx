import { useState } from 'react';
import { Plus, Megaphone, Calendar, Tag } from 'lucide-react';
import { DashBadge } from '../../../components/dashboard/DashBadge';
import { useToast, ToastContainer } from '../../../components/dashboard/DashToast';

const SELLER_ACCENT = '#00f5ff'; const CYAN = '#00f5ff';
const cardStyle = { background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.15)', borderRadius: 8 };
const headStyle: React.CSSProperties = { color: SELLER_ACCENT, fontFamily: 'Playfair Display, serif', letterSpacing: '0.06em', textShadow: `0 0 20px ${SELLER_ACCENT}` };

const campaigns = [
  { id:1, name:'Mağaza Açılış İndirimi', discount:'%20', end:'30.06.2026', status:'Aktif', uses: 284, revenue:'₺142K' },
  { id:2, name:'Sadık Müşteri Kuponu',   discount:'%15', end:'31.12.2026', status:'Aktif', uses: 128, revenue:'₺68K'  },
  { id:3, name:'Flash Satış - Cuma',     discount:'%40', end:'13.06.2026', status:'Bitti', uses: 512, revenue:'₺238K' },
];

export function SellerCampaigns() {
  const { toasts, show, remove } = useToast();
  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ ...headStyle, fontSize: 22 }}>KAMPANYALAR</h1>
          <p style={{ color: 'rgba(224,247,255,0.4)', fontSize: 12 }} className="mt-0.5">Mağaza kampanyalarınız</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded"
          style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.35)', color: SELLER_ACCENT, borderRadius: 4 }}>
          <Plus size={15} /> Kampanya Oluştur
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {campaigns.map((c) => (
          <div key={c.id} className="flex items-center gap-5 p-5 rounded" style={cardStyle}>
            <div className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.2)' }}>
              <Megaphone size={20} style={{ color: SELLER_ACCENT, filter: `drop-shadow(0 0 5px ${SELLER_ACCENT}80)` }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold" style={{ color: 'rgba(224,247,255,0.9)' }}>{c.name}</p>
                <DashBadge variant={c.status === 'Aktif' ? 'green' : 'red'}>{c.status}</DashBadge>
              </div>
              <div className="flex items-center gap-4 mt-1.5">
                <span className="text-xs px-2 py-0.5 rounded font-bold"
                  style={{ background: 'rgba(0,245,255,0.1)', color: SELLER_ACCENT, border: '1px solid rgba(0,245,255,0.2)' }}>
                  {c.discount} İNDİRİM
                </span>
                <span style={{ fontSize: 11, color: 'rgba(224,247,255,0.4)' }}>Bitiş: {c.end}</span>
                <span style={{ fontSize: 11, color: 'rgba(224,247,255,0.4)' }}>{c.uses} kullanım</span>
              </div>
            </div>
            <div className="text-right">
              <p style={{ fontSize: 15, fontWeight: 700, color: '#4ade80' }}>{c.revenue}</p>
              <p style={{ fontSize: 11, color: 'rgba(224,247,255,0.4)' }}>kazanılan</p>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}
