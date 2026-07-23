import { useState } from 'react';
import { Store, Bell, Shield } from 'lucide-react';
import { FormField, DashInput, DashTextarea } from '../../../components/dashboard/FormField';
import { useToast, ToastContainer } from '../../../components/dashboard/DashToast';

const SELLER_ACCENT = '#00f5ff';
const cardStyle = { background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.15)', borderRadius: 8 };
const headStyle: React.CSSProperties = { color: SELLER_ACCENT, fontFamily: 'Playfair Display, serif', letterSpacing: '0.06em', textShadow: `0 0 20px ${SELLER_ACCENT}` };

const tabs = [
  { id: 'store', label: 'Mağaza', icon: Store },
  { id: 'notif', label: 'Bildirim', icon: Bell },
  { id: 'security', label: 'Güvenlik', icon: Shield },
];

export function SellerSettings() {
  const [activeTab, setActiveTab] = useState('store');
  const { toasts, show, remove } = useToast();

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }} className="space-y-5">
      <div>
        <h1 style={{ ...headStyle, fontSize: 22 }}>AYARLAR</h1>
        <p style={{ color: 'rgba(224,247,255,0.4)', fontSize: 12 }} className="mt-0.5">Mağaza yapılandırması</p>
      </div>
      <div className="flex gap-5">
        <div className="w-44 shrink-0 rounded overflow-hidden" style={cardStyle}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm transition-all"
              style={activeTab === t.id ? { borderLeft: `2px solid ${SELLER_ACCENT}`, paddingLeft: 14, background: 'rgba(0,245,255,0.08)', color: SELLER_ACCENT } : { borderLeft: '2px solid transparent', paddingLeft: 14, color: 'rgba(224,247,255,0.5)' }}>
              <t.icon size={16} style={{ color: activeTab === t.id ? SELLER_ACCENT : 'rgba(224,247,255,0.35)' }} />
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex-1 rounded p-5 space-y-4" style={cardStyle}>
          {activeTab === 'store' && (
            <>
              <p style={{ ...headStyle, fontSize: 14 }} className="mb-3">Mağaza Bilgileri</p>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Mağaza Adı" required><DashInput defaultValue="Satıcı Mağaza" /></FormField>
                <FormField label="E-posta" required><DashInput type="email" defaultValue="seller@store.com" /></FormField>
                <FormField label="Telefon"><DashInput defaultValue="+90 555 000 0000" /></FormField>
                <FormField label="İl"><DashInput defaultValue="İstanbul" /></FormField>
              </div>
              <FormField label="Mağaza Açıklaması"><DashTextarea defaultValue="Kaliteli ürünler, uygun fiyatlar." rows={2} /></FormField>
            </>
          )}
          {activeTab === 'notif' && (
            <>
              <p style={{ ...headStyle, fontSize: 14 }} className="mb-3">Bildirim Ayarları</p>
              {['Yeni sipariş', 'İade talebi', 'Stok uyarısı', 'Kampanya hatırlatıcı'].map((n, i) => (
                <div key={i} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid rgba(0,245,255,0.06)' }}>
                  <span style={{ fontSize: 13, color: 'rgba(224,247,255,0.75)' }}>{n}</span>
                  <button className="relative w-10 h-5 rounded-full transition-all"
                    style={{ background: i < 2 ? 'rgba(0,245,255,0.3)' : 'rgba(255,255,255,0.1)', border: i < 2 ? '1px solid rgba(0,245,255,0.5)' : '1px solid rgba(255,255,255,0.15)', boxShadow: i < 2 ? '0 0 8px rgba(0,245,255,0.3)' : 'none' }}>
                    <span className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                      style={{ left: i < 2 ? '22px' : '2px', background: i < 2 ? SELLER_ACCENT : 'rgba(224,247,255,0.4)', boxShadow: i < 2 ? `0 0 6px ${SELLER_ACCENT}` : 'none' }} />
                  </button>
                </div>
              ))}
            </>
          )}
          {activeTab === 'security' && (
            <>
              <p style={{ ...headStyle, fontSize: 14 }} className="mb-3">Güvenlik</p>
              <div className="space-y-4">
                <FormField label="Mevcut Şifre"><DashInput type="password" placeholder="••••••••" /></FormField>
                <FormField label="Yeni Şifre"><DashInput type="password" placeholder="••••••••" /></FormField>
                <FormField label="Şifreyi Onayla"><DashInput type="password" placeholder="••••••••" /></FormField>
              </div>
            </>
          )}
          <div className="flex justify-end pt-3" style={{ borderTop: '1px solid rgba(0,245,255,0.08)' }}>
            <button onClick={() => show('Ayarlar kaydedildi!', 'success')}
              className="px-5 py-2 text-sm font-medium rounded"
              style={{ background: 'rgba(0,245,255,0.12)', border: '1px solid rgba(0,245,255,0.4)', color: SELLER_ACCENT, borderRadius: 4 }}>Kaydet</button>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}
