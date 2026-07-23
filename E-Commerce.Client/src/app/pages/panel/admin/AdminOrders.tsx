import { useState } from 'react';
import { MoreVertical, Download, Filter } from 'lucide-react';
import { DashBadge } from '../../../components/dashboard/DashBadge';
import { DashSearchInput } from '../../../components/dashboard/DashSearchInput';
import { DashPagination } from '../../../components/dashboard/DashPagination';
import { DashModal } from '../../../components/dashboard/DashModal';
import { useToast, ToastContainer } from '../../../components/dashboard/DashToast';

const CYAN = '#00f5ff'; const MAGENTA = '#ff00ff';
type Status = 'Beklemede'|'Hazırlanıyor'|'Kargoda'|'Teslim edildi'|'İade edildi';
const statusMap: Record<Status,'yellow'|'orange'|'blue'|'green'|'red'> = {
  'Beklemede':'yellow','Hazırlanıyor':'orange','Kargoda':'blue','Teslim edildi':'green','İade edildi':'red',
};
const cardStyle = { background:'rgba(0,245,255,0.04)', border:'1px solid rgba(0,245,255,0.15)', borderRadius:8 };
const headStyle: React.CSSProperties = { color:CYAN, fontFamily:'Playfair Display, serif', letterSpacing:'0.04em', textShadow:`0 0 12px ${CYAN}50` };
const mutedStyle: React.CSSProperties = { color:'rgba(224,247,255,0.4)', fontSize:12 };

const allOrders = Array.from({ length: 48 }, (_, i) => {
  const statuses: Status[] = ['Beklemede','Hazırlanıyor','Kargoda','Teslim edildi','İade edildi'];
  const customers = ['Ahmet Yılmaz','Fatma Kaya','Mehmet Demir','Zeynep Çelik','Ali Öztürk','Ayşe Şahin'];
  const products = ['Nike Air Max 270','Samsung Galaxy S25','MacBook Air M3','Sony WH-1000XM5','iPad Pro 13"','Apple Watch Ultra 2'];
  return {
    id:`#ORD-${5500-i}`, customer:customers[i%customers.length], product:products[i%products.length],
    amount:`₺${((i+1)*1234%90000+1000).toLocaleString('tr-TR')}`, date:`${11-(i%11)} Haz 2026`, status:statuses[i%statuses.length],
  };
});

export function AdminOrders() {
  const [search,setSearch] = useState('');
  const [page,setPage] = useState(1);
  const [menuOpen,setMenuOpen] = useState<string|null>(null);
  const [deleteModal,setDeleteModal] = useState<string|null>(null);
  const { toasts,show,remove } = useToast();
  const itemsPerPage = 10;
  const filtered = allOrders.filter(o => o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()));
  const paged = filtered.slice((page-1)*itemsPerPage, page*itemsPerPage);

  return (
    <div style={{ fontFamily:'DM Sans, sans-serif' }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ ...headStyle, fontSize:22 }}>SİPARİŞLER</h1>
          <p style={mutedStyle} className="mt-0.5">Tüm platform siparişleri</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition-all"
          style={{ background:'rgba(0,245,255,0.08)', border:'1px solid rgba(0,245,255,0.25)', color:CYAN, borderRadius:4 }}
          onMouseEnter={(e)=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(0,245,255,0.15)'}}
          onMouseLeave={(e)=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(0,245,255,0.08)'}}>
          <Download size={15}/> Dışa Aktar
        </button>
      </div>

      <div style={cardStyle}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom:'1px solid rgba(0,245,255,0.06)' }}>
          <DashSearchInput placeholder="Sipariş no, müşteri ara..." value={search} onChange={(e)=>{setSearch(e.target.value);setPage(1);}} width="w-72" accent={CYAN} />
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-all"
            style={{ color:'rgba(224,247,255,0.6)', border:'1px solid rgba(0,245,255,0.15)', background:'transparent', borderRadius:4 }}>
            <Filter size={14}/> Filtrele
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(0,245,255,0.06)', background:'rgba(0,245,255,0.02)' }}>
                {['Sipariş No','Müşteri','Ürün','Tutar','Tarih','Durum',''].map(h=>(
                  <th key={h} className="px-5 py-3 text-left" style={{ fontSize:10,fontWeight:600,color:'rgba(224,247,255,0.4)',letterSpacing:'0.08em',textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map(order=>(
                <tr key={order.id} style={{ borderBottom:'1px solid rgba(0,245,255,0.04)' }}
                  onMouseEnter={e=>(e.currentTarget.style.background='rgba(0,245,255,0.03)')}
                  onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                  <td className="px-5 py-3.5 text-sm font-medium" style={{ color:CYAN }}>{order.id}</td>
                  <td className="px-5 py-3.5 text-sm" style={{ color:'rgba(224,247,255,0.75)' }}>{order.customer}</td>
                  <td className="px-5 py-3.5 text-sm max-w-[180px] truncate" style={{ color:'rgba(224,247,255,0.55)' }}>{order.product}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold" style={{ color:'#4ade80' }}>{order.amount}</td>
                  <td className="px-5 py-3.5 text-sm" style={{ color:'rgba(224,247,255,0.4)' }}>{order.date}</td>
                  <td className="px-5 py-3.5"><DashBadge variant={statusMap[order.status]}>{order.status}</DashBadge></td>
                  <td className="px-5 py-3.5 text-right relative">
                    <button onClick={()=>setMenuOpen(menuOpen===order.id?null:order.id)}
                      className="w-7 h-7 flex items-center justify-center rounded"
                      style={{ color:'rgba(224,247,255,0.35)',border:'1px solid rgba(0,245,255,0.1)' }}>
                      <MoreVertical size={14}/>
                    </button>
                    {menuOpen===order.id&&(
                      <div className="absolute right-5 top-full mt-1 w-36 py-1 z-10"
                        style={{ background:'rgba(0,245,255,0.04)',border:'1px solid rgba(0,245,255,0.25)',borderRadius:8,boxShadow:'0 8px 24px rgba(0,0,0,0.8)' }}>
                        {['Detay Gör','Düzenle','İptal Et'].map(a=>(
                          <button key={a} className="flex w-full px-3 py-1.5 text-xs transition-colors"
                            style={{ color:a==='İptal Et'?MAGENTA:'rgba(224,247,255,0.7)' }}
                            onMouseEnter={e=>{e.currentTarget.style.background=a==='İptal Et'?'rgba(255,0,255,0.08)':'rgba(0,245,255,0.06)';}}
                            onMouseLeave={e=>{e.currentTarget.style.background='transparent';}}
                            onClick={()=>{setMenuOpen(null);if(a==='İptal Et')setDeleteModal(order.id);}}>{a}</button>
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

      <DashModal open={!!deleteModal} onClose={()=>setDeleteModal(null)} title="Siparişi İptal Et" accent={MAGENTA}
        footer={<>
          <button className="px-4 py-2 text-sm rounded" style={{ color:'rgba(224,247,255,0.7)',border:'1px solid rgba(0,245,255,0.15)',background:'transparent',borderRadius:4 }} onClick={()=>setDeleteModal(null)}>Vazgeç</button>
          <button className="px-4 py-2 text-sm font-medium rounded" style={{ background:'rgba(255,0,255,0.15)',border:'1px solid rgba(255,0,255,0.4)',color:MAGENTA,borderRadius:4 }} onClick={()=>{setDeleteModal(null);show('Sipariş iptal edildi.','success');}}>İptal Et</button>
        </>}>
        <p className="text-sm" style={{ color:'rgba(224,247,255,0.7)' }}><strong style={{ color:CYAN }}>{deleteModal}</strong> numaralı sipariş iptal edilecek. Bu işlem geri alınamaz.</p>
      </DashModal>
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}
