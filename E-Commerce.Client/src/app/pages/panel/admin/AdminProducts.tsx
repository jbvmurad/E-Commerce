import { useState } from 'react';
import { Plus, MoreVertical } from 'lucide-react';
import { DashBadge } from '../../../components/dashboard/DashBadge';
import { DashSearchInput } from '../../../components/dashboard/DashSearchInput';
import { DashPagination } from '../../../components/dashboard/DashPagination';
import { DashModal } from '../../../components/dashboard/DashModal';
import { FormField, DashInput, DashSelect, DashTextarea } from '../../../components/dashboard/FormField';
import { useToast, ToastContainer } from '../../../components/dashboard/DashToast';
import type { ProductStatus } from '../../../data/mockData';

const CYAN='#00f5ff'; const MAGENTA='#ff00ff';
const cardStyle = { background:'rgba(0,245,255,0.04)', border:'1px solid rgba(0,245,255,0.15)', borderRadius:8 };
const headStyle: React.CSSProperties = { color:CYAN, fontFamily:'Playfair Display, serif', letterSpacing:'0.04em', textShadow:`0 0 12px ${CYAN}50` };
const mutedStyle: React.CSSProperties = { color:'rgba(224,247,255,0.4)', fontSize:12 };
const btnPrimary: React.CSSProperties = { background:'rgba(0,245,255,0.12)', border:'1px solid rgba(0,245,255,0.35)', color:CYAN, borderRadius:4, padding:'8px 16px', fontSize:13, fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', gap:6 };
const btnGhost: React.CSSProperties  = { background:'transparent', border:'1px solid rgba(0,245,255,0.15)', color:'rgba(224,247,255,0.65)', borderRadius:4, padding:'8px 16px', fontSize:13, cursor:'pointer' };

const products = Array.from({ length: 36 }, (_, i) => ({
  id: i+1,
  name: ['Nike Air Max 270','Samsung Galaxy S25','MacBook Air M3','Sony WH-1000XM5','iPad Pro 13"','Dyson V15'][i%6],
  category: ['Ayakkabı','Elektronik','Bilgisayar','Ses Sistemleri','Tablet','Ev Aletleri'][i%6],
  price: `₺${((i+1)*2345%80000+500).toLocaleString('tr-TR')}`,
  stock: Math.floor(i*7%200+1),
  status: i%5===4 ? 'Pasif' : 'Aktif',
}));

export function AdminProductsPage() {
  const [search,setSearch]=useState('');
  const [page,setPage]=useState(1);
  const [modal,setModal]=useState(false);
  const [menuOpen,setMenuOpen]=useState<number|null>(null);
  const { toasts,show,remove } = useToast();
  const itemsPerPage=10;
  const filtered=products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));
  const paged=filtered.slice((page-1)*itemsPerPage,page*itemsPerPage);

  return (
    <div style={{ fontFamily:'DM Sans, sans-serif' }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ ...headStyle, fontSize:22 }}>ÜRÜNLER</h1>
          <p style={mutedStyle} className="mt-0.5">{products.length} ürün listelendi</p>
        </div>
        <button style={btnPrimary} onClick={()=>setModal(true)}
          onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(0,245,255,0.2)'}}
          onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(0,245,255,0.12)'}}>
          <Plus size={15}/> Ürün Ekle
        </button>
      </div>

      <div style={cardStyle}>
        <div className="px-5 py-4" style={{ borderBottom:'1px solid rgba(0,245,255,0.06)' }}>
          <DashSearchInput placeholder="Ürün ara..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} width="w-64" accent={CYAN} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(0,245,255,0.06)',background:'rgba(0,245,255,0.02)' }}>
                {['Ürün','Kategori','Fiyat','Stok','Durum',''].map(h=>(
                  <th key={h} className="px-5 py-3 text-left" style={{ fontSize:10,fontWeight:600,color:'rgba(224,247,255,0.4)',letterSpacing:'0.08em',textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map(p=>(
                <tr key={p.id} style={{ borderBottom:'1px solid rgba(0,245,255,0.04)' }}
                  onMouseEnter={e=>(e.currentTarget.style.background='rgba(0,245,255,0.03)')}
                  onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                  <td className="px-5 py-3.5 text-sm font-medium" style={{ color:'rgba(224,247,255,0.85)' }}>{p.name}</td>
                  <td className="px-5 py-3.5 text-sm" style={{ color:'rgba(224,247,255,0.5)' }}>{p.category}</td>
                  <td className="px-5 py-3.5 text-sm font-medium" style={{ color:'#4ade80' }}>{p.price}</td>
                  <td className="px-5 py-3.5 text-sm" style={{ color:'rgba(224,247,255,0.7)' }}>{p.stock}</td>
                  <td className="px-5 py-3.5"><DashBadge variant={p.status==='Aktif'?'green':'red'}>{p.status}</DashBadge></td>
                  <td className="px-5 py-3.5 text-right relative">
                    <button onClick={()=>setMenuOpen(menuOpen===p.id?null:p.id)}
                      className="w-7 h-7 flex items-center justify-center rounded"
                      style={{ color:'rgba(224,247,255,0.35)',border:'1px solid rgba(0,245,255,0.1)' }}>
                      <MoreVertical size={14}/>
                    </button>
                    {menuOpen===p.id&&(
                      <div className="absolute right-5 top-full mt-1 w-32 py-1 z-10"
                        style={{ background:'rgba(0,245,255,0.04)',border:'1px solid rgba(0,245,255,0.25)',borderRadius:8,boxShadow:'0 8px 24px rgba(0,0,0,0.8)' }}>
                        {['Düzenle','Sil'].map(a=>(
                          <button key={a} className="flex w-full px-3 py-1.5 text-xs"
                            style={{ color:a==='Sil'?MAGENTA:'rgba(224,247,255,0.7)' }}
                            onMouseEnter={e=>{e.currentTarget.style.background=a==='Sil'?'rgba(255,0,255,0.08)':'rgba(0,245,255,0.06)';}}
                            onMouseLeave={e=>{e.currentTarget.style.background='transparent';}}
                            onClick={()=>{setMenuOpen(null);show(a==='Sil'?'Ürün silindi.':'Düzenleniyor.','success');}}>{a}</button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4" style={{ borderTop:'1px solid rgba(0,245,255,0.06)' }}>
          <DashPagination currentPage={page} totalItems={filtered.length} itemsPerPage={itemsPerPage} onPageChange={setPage} accent={CYAN} />
        </div>
      </div>

      <DashModal open={modal} onClose={()=>setModal(false)} title="Yeni Ürün Ekle" width="max-w-xl"
        footer={<><button style={btnGhost} onClick={()=>setModal(false)}>Vazgeç</button><button style={btnPrimary} onClick={()=>{setModal(false);show('Ürün eklendi!','success');}}>Ekle</button></>}>
        <div className="space-y-4">
          <FormField label="Ürün Adı" required><DashInput placeholder="Ürün adını girin"/></FormField>
          <FormField label="Kategori" required><DashSelect options={[{value:'',label:'Seçin'},{value:'elektronik',label:'Elektronik'},{value:'giyim',label:'Giyim'}]}/></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Fiyat (₺)" required><DashInput type="number" placeholder="0.00"/></FormField>
            <FormField label="Stok" required><DashInput type="number" placeholder="0"/></FormField>
          </div>
          <FormField label="Açıklama"><DashTextarea placeholder="Ürün açıklaması..."/></FormField>
        </div>
      </DashModal>
      <ToastContainer toasts={toasts} onRemove={remove}/>
    </div>
  );
}
