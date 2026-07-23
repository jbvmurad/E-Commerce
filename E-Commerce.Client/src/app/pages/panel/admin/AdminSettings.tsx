import { useState } from 'react';
import { Settings, Store, Bell, Shield, Palette } from 'lucide-react';
import { FormField, DashInput, DashTextarea, DashSelect } from '../../../components/dashboard/FormField';
import { useToast, ToastContainer } from '../../../components/dashboard/DashToast';

const CYAN = '#00f5ff';
const cardStyle = { background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.15)', borderRadius: 8 };
const headStyle: React.CSSProperties = { color: CYAN, fontFamily: 'Playfair Display, serif', letterSpacing: '0.06em', textShadow: `0 0 20px ${CYAN}` };

const tabs = [
  { id: 'general', label: 'Genel', icon: Store },
  { id: 'notif',   label: 'Bildirim', icon: Bell },
  { id: 'security', label: 'Güvenlik', icon: Shield },
];

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const { toasts, show, remove } = useToast();

  const save = () => show('Ayarlar kaydedildi!', 'success');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }} className="space-y-5">
      <div>
        <h1 style={{ ...headStyle, fontSize: 22 }}>AYARLAR</h1>
        <p style={{ color: 'rgba(224,247,255,0.4)', fontSize: 12 }} className="mt-0.5">Platform yapılandırması</p>
      </div>

      <div className="flex gap-5">
        {/* Sidebar tabs */}
        <div className="w-48 shrink-0 rounded overflow-hidden" style={cardStyle}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm transition-all"
              style={activeTab === t.id ? {
                borderLeft: `2px solid ${CYAN}`, paddingLeft: 14,
                background: 'rgba(0,245,255,0.08)', color: CYAN,
              } : { borderLeft: '2px solid transparent', paddingLeft: 14, color: 'rgba(224,247,255,0.5)' }}>
              <t.icon size={16} style={{ color: activeTab === t.id ? CYAN : 'rgba(224,247,255,0.35)', filter: activeTab === t.id ? `drop-shadow(0 0 4px ${CYAN})` : 'none' }} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 rounded p-6 space-y-5" style={cardStyle}>
          {activeTab === 'general' && (
            <>
              <p style={{ ...headStyle, fontSize: 14 }} className="mb-4">Mağaza Bilgileri</p>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Mağaza Adı" required><DashInput defaultValue="E-Commerce Store" /></FormField>
                <FormField label="İletişim E-posta" required><DashInput type="email" defaultValue="info@store.com" /></FormField>
                <FormField label="Telefon"><DashInput defaultValue="+90 212 555 0100" /></FormField>
                <FormField label="Para Birimi">
                  <DashSelect options={[{value:'TRY',label:'₺ Türk Lirası'},{value:'USD',label:'$ Dolar'},{value:'EUR',label:'€ Euro'}]} defaultValue="TRY" />
                </FormField>
              </div>
              <FormField label="Mağaza Adresi"><DashTextarea defaultValue="Levent, İstanbul, Türkiye" rows={2} /></FormField>
            </>
          )}
          {activeTab === 'notif' && (
            <>
              <p style={{ ...headStyle, fontSize: 14 }} className="mb-4">Bildirim Tercihleri</p>
              {[
                { label: 'Yeni sipariş bildirimi', desc: 'Her yeni sipariş için e-posta al', on: true },
                { label: 'İade talebi', desc: 'Müşteri iade başlatığında bildir', on: true },
                { label: 'Stok uyarısı', desc: 'Ürün stoğu 5\'in altına düştüğünde', on: false },
                { label: 'Günlük özet', desc: 'Her gün saat 09:00\'da özet rapor', on: true },
                { label: 'Kampanya bitişi', desc: 'Kampanya bitmeden 24 saat önce', on: false },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(0,245,255,0.06)' }}>
                  <div>
                    <p style={{ fontSize: 13, color: 'rgba(224,247,255,0.85)' }}>{n.label}</p>
                    <p style={{ fontSize: 11, color: 'rgba(224,247,255,0.4)' }} className="mt-0.5">{n.desc}</p>
                  </div>
                  <button className="relative w-10 h-5 rounded-full transition-all duration-200"
                    style={{ background: n.on ? `${CYAN}40` : 'rgba(255,255,255,0.1)', border: n.on ? `1px solid ${CYAN}60` : '1px solid rgba(255,255,255,0.15)', boxShadow: n.on ? `0 0 8px ${CYAN}40` : 'none' }}>
                    <span className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
                      style={{ left: n.on ? '22px' : '2px', background: n.on ? CYAN : 'rgba(224,247,255,0.4)', boxShadow: n.on ? `0 0 6px ${CYAN}` : 'none' }} />
                  </button>
                </div>
              ))}
            </>
          )}
          {activeTab === 'security' && (
            <>
              <p style={{ ...headStyle, fontSize: 14 }} className="mb-4">Güvenlik Ayarları</p>
              <div className="space-y-4">
                <FormField label="Mevcut Şifre"><DashInput type="password" placeholder="••••••••" /></FormField>
                <FormField label="Yeni Şifre"><DashInput type="password" placeholder="••••••••" /></FormField>
                <FormField label="Şifreyi Onayla"><DashInput type="password" placeholder="••••••••" /></FormField>
                <div className="pt-2" style={{ borderTop: '1px solid rgba(0,245,255,0.08)' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(224,247,255,0.8)' }} className="mb-2">İki Faktörlü Doğrulama</p>
                  <p style={{ fontSize: 12, color: 'rgba(224,247,255,0.45)' }} className="mb-3">Hesabınızı ek güvenlik katmanıyla koruyun.</p>
                  <button className="px-4 py-2 text-sm rounded transition-all"
                    style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.3)', color: CYAN, borderRadius: 4 }}>
                    2FA Aktifleştir
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end pt-4" style={{ borderTop: '1px solid rgba(0,245,255,0.08)' }}>
            <button onClick={save} className="px-5 py-2 text-sm font-medium rounded transition-all"
              style={{ background: 'rgba(0,245,255,0.12)', border: '1px solid rgba(0,245,255,0.4)', color: CYAN, borderRadius: 4 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,245,255,0.2)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,245,255,0.12)'; }}>
              Kaydet
            </button>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}
