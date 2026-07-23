import { useState } from 'react';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { DashBadge } from '../../../components/dashboard/DashBadge';
import { DashSearchInput } from '../../../components/dashboard/DashSearchInput';
import { DashModal } from '../../../components/dashboard/DashModal';
import { FormField, DashInput, DashSelect, DashTextarea } from '../../../components/dashboard/FormField';
import { FileUpload } from '../../../components/dashboard/FileUpload';
import { useToast, ToastContainer } from '../../../components/dashboard/DashToast';
import { EmptyState } from '../../../components/dashboard/EmptyState';

const SELLER_ACCENT='#00f5ff'; const CYAN='#00f5ff'; const GREEN='#4ade80';
const cardStyle = { background:'#050d15', border:'1px solid rgba(0,245,255,0.15)', borderRadius:8 };
const headStyle: React.CSSProperties = { color:SELLER_ACCENT, fontFamily:'Playfair Display, serif', letterSpacing:'0.04em', textShadow:`0 0 12px ${SELLER_ACCENT}50` };
const btnPrimary: React.CSSProperties = { background:'rgba(0,245,255,0.12)',border:'1px solid rgba(0,245,255,0.35)',color:SELLER_ACCENT,borderRadius:4,padding:'8px 16px',fontSize:13,fontWeight:500,cursor:'pointer',display:'flex',alignItems:'center',gap:6 };
const btnGhost: React.CSSProperties  = { background:'transparent',border:'1px solid rgba(0,245,255,0.15)',color:'rgba(224,247,255,0.65)',borderRadius:4,padding:'8px 16px',fontSize:13,cursor:'pointer' };

const mockImgs = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop',
];

const initProducts = [
  { id:1, name:'Nike Air Max 270',    category:'Ayakkabı',  price:2490,  stock:48, status:'Aktif',   img:mockImgs[0] },
  { id:2, name:'Sony WH-1000XM5',     category:'Elektronik',price:8999,  stock:12, status:'Aktif',   img:mockImgs[1] },
  { id:3, name:'Casio G-Shock',       category:'Saat',      price:3750,  stock:5,  status:'Aktif',   img:mockImgs[2] },
  { id:4, name:'Running Pro Sneaker', category:'Ayakkabı',  price:1890,  stock:0,  status:'Tükendi', img:mockImgs[3] },
  { id:5, name:'Parfüm Set',          category:'Kozmetik',  price:1250,  stock:31, status:'Aktif',   img:mockImgs[4] },
  { id:6, name:'Akıllı Saat X2',      category:'Elektronik',price:4999,  stock:7,  status:'Pasif',   img:mockImgs[5] },
];

export function SellerProducts() {
  const [products,setProducts]=useState(initProducts);
  const [search,setSearch]=useState('');
  const [addModal,setAddModal]=useState(false);
  const [stockModal,setStockModal]=useState<number|null>(null);
  const [deleteModal,setDeleteModal]=useState<number|null>(null);
  const [newStock,setNewStock]=useState('');
  const { toasts,show,remove } = useToast();

  const filtered=products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ fontFamily:'DM Sans, sans-serif' }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ ...headStyle, fontSize:22 }}>ÜRÜNLERİM</h1>
          <p style={{ color:'rgba(224,247,255,0.4)',fontSize:12 }} className="mt-0.5">{products.length} ürün</p>
        </div>
        <button style={btnPrimary} onClick={()=>setAddModal(true)}
          onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(0,245,255,0.2)'}}
          onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(0,245,255,0.12)'}}>
          <Plus size={15}/> Ürün Ekle
        </button>
      </div>

      <DashSearchInput placeholder="Ürün ara..." value={search} onChange={e=>setSearch(e.target.value)} width="w-72" accent={SELLER_ACCENT}/>

      {filtered.length===0 ? (
        <EmptyState title="Ürün bulunamadı" description="Arama kriterlerine uygun ürün yok."/>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(product=>(
            <div key={product.id} className="flex flex-col overflow-hidden rounded transition-all duration-300"
              style={cardStyle}
              onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.border='1px solid rgba(0,245,255,0.3)';(e.currentTarget as HTMLDivElement).style.boxShadow='0 0 20px rgba(0,245,255,0.08)';}}
              onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.border='1px solid rgba(0,245,255,0.12)';(e.currentTarget as HTMLDivElement).style.boxShadow='none';}}>
              <div className="aspect-[4/3] overflow-hidden" style={{ background:'rgba(0,245,255,0.04)' }}>
                <img src={product.img} alt={product.name} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"/>
              </div>
              <div className="p-4 flex flex-col gap-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold leading-snug" style={{ color:'rgba(224,247,255,0.9)' }}>{product.name}</h3>
                  <DashBadge variant={product.status==='Aktif'?'green':product.status==='Tükendi'?'red':'yellow'}>{product.status}</DashBadge>
                </div>
                <p className="text-xs" style={{ color:'rgba(224,247,255,0.4)' }}>{product.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold" style={{ color:SELLER_ACCENT, textShadow:`0 0 10px ${SELLER_ACCENT}50` }}>₺{product.price.toLocaleString('tr-TR')}</span>
                  <span className="text-xs" style={{ color:'rgba(224,247,255,0.4)' }}>
                    Stok: <span style={{ color:product.stock===0?'#ff5555':GREEN, fontWeight:600 }}>{product.stock}</span>
                  </span>
                </div>
                <div className="flex gap-2 mt-1">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded transition-all"
                    style={{ color:CYAN,border:`1px solid rgba(0,245,255,0.2)`,background:'rgba(0,245,255,0.06)',borderRadius:4 }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(0,245,255,0.12)'}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(0,245,255,0.06)'}}>
                    <Pencil size={11}/> Düzenle
                  </button>
                  <button onClick={()=>{setStockModal(product.id);setNewStock(String(product.stock));}}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded transition-all"
                    style={{ color:'rgba(224,247,255,0.6)',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.04)',borderRadius:4 }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(255,255,255,0.08)'}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(255,255,255,0.04)'}}>
                    <RefreshCw size={11}/> Stok
                  </button>
                  <button onClick={()=>setDeleteModal(product.id)}
                    className="px-2 py-1.5 text-xs rounded transition-all"
                    style={{ color:SELLER_ACCENT,border:'1px solid rgba(0,245,255,0.15)',background:'rgba(0,245,255,0.05)',borderRadius:4 }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(0,245,255,0.12)'}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(0,245,255,0.05)'}}>
                    <Trash2 size={11}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      <DashModal open={addModal} onClose={()=>setAddModal(false)} title="Yeni Ürün Ekle" width="max-w-2xl" accent={SELLER_ACCENT}
        footer={<><button style={btnGhost} onClick={()=>setAddModal(false)}>Vazgeç</button><button style={btnPrimary} onClick={()=>{setAddModal(false);show('Ürün eklendi!','success');}}>Ekle</button></>}>
        <div className="flex gap-6">
          <div className="w-52 shrink-0">
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color:'rgba(224,247,255,0.5)',letterSpacing:'0.07em' }}>Görsel</p>
            <FileUpload maxFiles={4}/>
          </div>
          <div className="flex-1 space-y-4">
            <FormField label="Ürün Adı" required><DashInput placeholder="Ürün adını girin"/></FormField>
            <FormField label="Kategori" required><DashSelect options={[{value:'',label:'Kategori seçin'},{value:'elektronik',label:'Elektronik'},{value:'giyim',label:'Giyim'},{value:'ayakkabi',label:'Ayakkabı'}]}/></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Fiyat (₺)" required><DashInput type="number" placeholder="0.00"/></FormField>
              <FormField label="Stok" required><DashInput type="number" placeholder="0"/></FormField>
            </div>
            <FormField label="Açıklama"><DashTextarea placeholder="Ürün açıklaması..." rows={3}/></FormField>
            <FormField label="Varyantlar"><DashInput placeholder="Örn: Kırmızı/42, Mavi/43"/></FormField>
          </div>
        </div>
      </DashModal>

      {/* Stock Modal */}
      <DashModal open={!!stockModal} onClose={()=>setStockModal(null)} title="Stok Güncelle" accent={SELLER_ACCENT}
        footer={<><button style={btnGhost} onClick={()=>setStockModal(null)}>Vazgeç</button><button style={btnPrimary} onClick={()=>{if(!newStock)return;setProducts(prev=>prev.map(p=>p.id===stockModal?{...p,stock:Number(newStock),status:Number(newStock)>0?'Aktif':'Tükendi'}:p));setStockModal(null);setNewStock('');show('Stok güncellendi!','success');}}>Güncelle</button></>}>
        <FormField label="Yeni Stok Miktarı" required><DashInput type="number" value={newStock} onChange={e=>setNewStock(e.target.value)} placeholder="0"/></FormField>
      </DashModal>

      {/* Delete Modal */}
      <DashModal open={!!deleteModal} onClose={()=>setDeleteModal(null)} title="Ürünü Sil" accent={SELLER_ACCENT}
        footer={<><button style={btnGhost} onClick={()=>setDeleteModal(null)}>Vazgeç</button><button style={{ ...btnPrimary,background:'rgba(0,245,255,0.15)',border:'1px solid rgba(0,245,255,0.4)' }} onClick={()=>{setProducts(prev=>prev.filter(p=>p.id!==deleteModal));setDeleteModal(null);show('Ürün silindi.','success');}}>Sil</button></>}>
        <p className="text-sm" style={{ color:'rgba(224,247,255,0.7)' }}>Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
      </DashModal>

      <ToastContainer toasts={toasts} onRemove={remove}/>
    </div>
  );
}
