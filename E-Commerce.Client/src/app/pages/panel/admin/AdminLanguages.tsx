import { useState } from 'react';
import { Globe, Check, Star, Plus, Trash2 } from 'lucide-react';
import { useToast, ToastContainer } from '../../../components/dashboard/DashToast';

const CYAN = '#00f5ff';
const cardStyle = { background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.15)', borderRadius: 8 };
const headStyle: React.CSSProperties = { color: CYAN, fontFamily: 'Playfair Display, serif', letterSpacing: '0.06em', textShadow: `0 0 20px ${CYAN}` };

const LANGS = [
  { code: 'tr', name: 'Türkçe',    native: 'Türkçe',    flag: '🇹🇷', default: true,  active: true  },
  { code: 'en', name: 'İngilizce', native: 'English',   flag: '🇬🇧', default: false, active: true  },
  { code: 'ru', name: 'Rusça',     native: 'Русский',   flag: '🇷🇺', default: false, active: true  },
  { code: 'az', name: 'Azerbaycanca', native: 'Azərbaycan', flag: '🇦🇿', default: false, active: true },
];

type Lang = typeof LANGS[number];

export function AdminLanguages() {
  const [langs, setLangs] = useState<Lang[]>(LANGS);
  const { toasts, show, remove } = useToast();

  const toggleActive = (code: string) => {
    setLangs((prev) =>
      prev.map((l) => l.code === code && !l.default ? { ...l, active: !l.active } : l)
    );
    show('Dil ayarları güncellendi.', 'success');
  };

  const setDefault = (code: string) => {
    setLangs((prev) =>
      prev.map((l) => ({ ...l, default: l.code === code, active: l.code === code ? true : l.active }))
    );
    show('Varsayılan dil değiştirildi.', 'success');
  };

  const removeLang = (code: string) => {
    if (langs.find((l) => l.code === code)?.default) return;
    setLangs((prev) => prev.filter((l) => l.code !== code));
    show('Dil kaldırıldı.', 'success');
  };

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ ...headStyle, fontSize: 22 }}>DİLLER</h1>
          <p style={{ color: 'rgba(224,247,255,0.4)', fontSize: 12 }} className="mt-0.5">
            Site dillerini yönetin
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition-all"
          style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.35)', color: CYAN, borderRadius: 4 }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,245,255,0.15)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,245,255,0.08)'; }}>
          <Plus size={15} /> Dil Ekle
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-center gap-3 px-4 py-3 rounded"
        style={{ background: 'rgba(0,245,255,0.06)', border: '1px solid rgba(0,245,255,0.2)', borderRadius: 6 }}>
        <Globe size={16} style={{ color: CYAN, flexShrink: 0 }} />
        <p style={{ color: 'rgba(224,247,255,0.7)', fontSize: 13 }}>
          Varsayılan dil kaldırılamaz ve devre dışı bırakılamaz. Aktif diller sitede görünür.
        </p>
      </div>

      {/* Language cards */}
      <div className="grid grid-cols-2 gap-4">
        {langs.map((lang) => (
          <div key={lang.code}
            className="flex items-center gap-4 p-5 rounded transition-all duration-200"
            style={{
              ...cardStyle,
              opacity: lang.active ? 1 : 0.5,
              border: lang.default ? `1px solid ${CYAN}50` : '1px solid rgba(0,245,255,0.15)',
              boxShadow: lang.default ? `0 0 20px rgba(0,245,255,0.08)` : 'none',
            }}>
            {/* Flag */}
            <div className="text-4xl flex-shrink-0 select-none" style={{ lineHeight: 1 }}>
              {lang.flag}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold" style={{ color: 'rgba(224,247,255,0.9)' }}>
                  {lang.name}
                </span>
                {lang.default && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 text-xs rounded font-medium"
                    style={{ background: 'rgba(0,245,255,0.12)', color: CYAN, border: '1px solid rgba(0,245,255,0.25)' }}>
                    <Star size={10} /> Varsayılan
                  </span>
                )}
                {!lang.active && (
                  <span className="px-1.5 py-0.5 text-xs rounded"
                    style={{ background: 'rgba(255,85,85,0.1)', color: '#ff5555', border: '1px solid rgba(255,85,85,0.2)' }}>
                    Pasif
                  </span>
                )}
              </div>
              <p style={{ color: 'rgba(224,247,255,0.45)', fontSize: 12 }} className="mt-0.5">
                {lang.native} · {lang.code.toUpperCase()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Toggle */}
              <button onClick={() => toggleActive(lang.code)}
                disabled={lang.default}
                className="relative w-10 h-5 rounded-full transition-all duration-200"
                style={{
                  background: lang.active ? `${CYAN}40` : 'rgba(255,255,255,0.1)',
                  border: lang.active ? `1px solid ${CYAN}60` : '1px solid rgba(255,255,255,0.15)',
                  cursor: lang.default ? 'not-allowed' : 'pointer',
                  boxShadow: lang.active ? `0 0 8px ${CYAN}40` : 'none',
                }}>
                <span className="absolute top-0.5 transition-all duration-200 w-4 h-4 rounded-full"
                  style={{
                    left: lang.active ? '22px' : '2px',
                    background: lang.active ? CYAN : 'rgba(224,247,255,0.4)',
                    boxShadow: lang.active ? `0 0 6px ${CYAN}` : 'none',
                  }} />
              </button>

              {/* Set default */}
              {!lang.default && lang.active && (
                <button onClick={() => setDefault(lang.code)}
                  className="px-2 py-1 text-xs rounded transition-all"
                  style={{ color: 'rgba(224,247,255,0.5)', border: '1px solid rgba(0,245,255,0.12)', background: 'transparent' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = CYAN; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,245,255,0.35)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(224,247,255,0.5)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,245,255,0.12)'; }}>
                  Varsayılan Yap
                </button>
              )}

              {/* Remove */}
              {!lang.default && (
                <button onClick={() => removeLang(lang.code)}
                  className="w-7 h-7 flex items-center justify-center rounded transition-all"
                  style={{ color: '#ff5555', border: '1px solid rgba(255,85,85,0.15)', background: 'transparent' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,85,85,0.08)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Translation coverage */}
      <div style={cardStyle} className="p-5">
        <p style={{ ...headStyle, fontSize: 14 }} className="mb-4">Çeviri Kapsamı</p>
        <div className="space-y-3">
          {langs.filter((l) => l.active).map((lang) => {
            const pct = lang.code === 'tr' ? 100 : lang.code === 'en' ? 94 : lang.code === 'ru' ? 78 : 65;
            return (
              <div key={lang.code}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 16 }}>{lang.flag}</span>
                    <span style={{ fontSize: 13, color: 'rgba(224,247,255,0.75)' }}>{lang.name}</span>
                  </div>
                  <span style={{ fontSize: 12, color: pct === 100 ? '#4ade80' : CYAN, fontWeight: 600 }}>%{pct}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,245,255,0.08)' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: pct === 100
                        ? 'linear-gradient(90deg,#4ade80,#00f5ff)'
                        : `linear-gradient(90deg,${CYAN},rgba(0,245,255,0.5))`,
                      boxShadow: `0 0 6px ${pct === 100 ? '#4ade8080' : CYAN + '60'}`,
                    }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}
