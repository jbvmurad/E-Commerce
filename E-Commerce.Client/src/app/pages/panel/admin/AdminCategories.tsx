import { useState } from 'react';
import { Plus, MoreVertical, Tag } from 'lucide-react';
import { DashBadge } from '../../../components/dashboard/DashBadge';
import { DashModal } from '../../../components/dashboard/DashModal';
import { FormField, DashInput } from '../../../components/dashboard/FormField';
import { useToast, ToastContainer } from '../../../components/dashboard/DashToast';

const CYAN = '#00f5ff';
const cardStyle = { background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.15)', borderRadius: 8 };
const headStyle: React.CSSProperties = { color: CYAN, fontFamily: 'Playfair Display, serif', letterSpacing: '0.06em', textShadow: `0 0 20px ${CYAN}` };

const initCats = [
  { id: 1, name: 'Elektronik',    icon: '💻', count: 284, status: 'Aktif'  },
  { id: 2, name: 'Giyim',         icon: '👕', count: 198, status: 'Aktif'  },
  { id: 3, name: 'Ayakkabı',      icon: '👟', count: 156, status: 'Aktif'  },
  { id: 4, name: 'Ev & Yaşam',    icon: '🏠', count: 134, status: 'Aktif'  },
  { id: 5, name: 'Kozmetik',      icon: '💄', count:  89, status: 'Aktif'  },
  { id: 6, name: 'Kitap',         icon: '📚', count:  76, status: 'Aktif'  },
  { id: 7, name: 'Spor',          icon: '⚽', count:  64, status: 'Aktif'  },
  { id: 8, name: 'Oyuncak',       icon: '🧸', count:  42, status: 'Pasif'  },
  { id: 9, name: 'Otomotiv',      icon: '🚗', count:  31, status: 'Aktif'  },
  { id:10, name: 'Bahçe',         icon: '🌱', count:  28, status: 'Pasif'  },
];

export function AdminCategories() {
  const [cats, setCats] = useState(initCats);
  const [modal, setModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const { toasts, show, remove } = useToast();

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ ...headStyle, fontSize: 22 }}>KATEGORİLER</h1>
          <p style={{ color: 'rgba(224,247,255,0.4)', fontSize: 12 }} className="mt-0.5">{cats.length} kategori</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition-all"
          style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.35)', color: CYAN, borderRadius: 4 }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,245,255,0.15)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,245,255,0.08)'; }}>
          <Plus size={15} /> Kategori Ekle
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {cats.map((cat) => (
          <div key={cat.id} className="flex items-center gap-4 px-4 py-3 rounded transition-all duration-200"
            style={cardStyle}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(0,245,255,0.3)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(0,245,255,0.15)'; }}>
            <div className="w-10 h-10 rounded flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.15)' }}>
              {cat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: 'rgba(224,247,255,0.85)' }}>{cat.name}</p>
              <p style={{ color: 'rgba(224,247,255,0.4)', fontSize: 11 }} className="mt-0.5">{cat.count} ürün</p>
            </div>
            <DashBadge variant={cat.status === 'Aktif' ? 'green' : 'red'}>{cat.status}</DashBadge>
            <div className="relative">
              <button onClick={() => setMenuOpen(menuOpen === cat.id ? null : cat.id)}
                className="w-7 h-7 flex items-center justify-center rounded"
                style={{ color: 'rgba(224,247,255,0.35)', border: '1px solid rgba(0,245,255,0.1)' }}>
                <MoreVertical size={14} />
              </button>
              {menuOpen === cat.id && (
                <div className="absolute right-0 top-full mt-1 w-32 py-1 z-10"
                  style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.25)', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.8)' }}>
                  {['Düzenle', cat.status === 'Aktif' ? 'Pasifleştir' : 'Aktifleştir', 'Sil'].map((a) => (
                    <button key={a} className="flex w-full px-3 py-1.5 text-xs transition-colors"
                      style={{ color: a === 'Sil' ? '#ff00ff' : 'rgba(224,247,255,0.7)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = a === 'Sil' ? 'rgba(255,0,255,0.08)' : 'rgba(0,245,255,0.06)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      onClick={() => { setMenuOpen(null); show(`${a} işlemi uygulandı.`, 'success'); }}>{a}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <DashModal open={modal} onClose={() => setModal(false)} title="Yeni Kategori"
        footer={<>
          <button style={{ background: 'transparent', border: '1px solid rgba(0,245,255,0.15)', color: 'rgba(224,247,255,0.6)', borderRadius: 4, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }} onClick={() => setModal(false)}>Vazgeç</button>
          <button style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.35)', color: CYAN, borderRadius: 4, padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
            onClick={() => { if (newName) { setCats((p) => [...p, { id: Date.now(), name: newName, icon: '📦', count: 0, status: 'Aktif' }]); setNewName(''); setModal(false); show('Kategori eklendi!', 'success'); } }}>Ekle</button>
        </>}>
        <FormField label="Kategori Adı" required>
          <DashInput placeholder="Kategori adını girin" value={newName} onChange={(e) => setNewName(e.target.value)} />
        </FormField>
      </DashModal>
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}
