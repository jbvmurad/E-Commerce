import { useState } from 'react';
import { Send } from 'lucide-react';
import { DashBadge } from '../../../components/dashboard/DashBadge';
import { DashSearchInput } from '../../../components/dashboard/DashSearchInput';
import { DashPagination } from '../../../components/dashboard/DashPagination';
import { DashModal } from '../../../components/dashboard/DashModal';
import { useToast, ToastContainer } from '../../../components/dashboard/DashToast';
import { FormField, DashInput } from '../../../components/dashboard/FormField';

const SELLER_ACCENT='#00f5ff'; const CYAN='#00f5ff';
const cardStyle = { background:'#050d15', border:'1px solid rgba(0,245,255,0.15)', borderRadius:8 };
const headStyle: React.CSSProperties = { color:SELLER_ACCENT, fontFamily:'Playfair Display, serif', letterSpacing:'0.04em', textShadow:`0 0 12px ${SELLER_ACCENT}50` };
const btnPrimary: React.CSSProperties = { background:'rgba(0,245,255,0.12)', border:`1px solid rgba(0,245,255,0.35)`, color:SELLER_ACCENT, borderRadius:4, padding:'8px 16px', fontSize:13, fontWeight:500, cursor:'pointer' };
const btnGhost: React.CSSProperties  = { background:'transparent', border:'1px solid rgba(0,245,255,0.15)', color:'rgba(224,247,255,0.65)', borderRadius:4, padding:'8px 16px', fontSize:13, cursor:'pointer' };

type Status = 'Beklemede'|'Hazırlanıyor'|'Kargoda'|'Teslim edildi'|'İade edildi';
const statusMap: Record<Status,'yellow'|'orange'|'blue'|'green'|'red'> = {
  'Beklemede':'yellow','Hazırlanıyor':'orange','Kargoda':'blue','Teslim edildi':'green','İade edildi':'red',
};

const initOrders = Array.from({ length: 24 }, (_, i) => {
  const statuses: Status[] = ['Beklemede','Hazırlanıyor','Kargoda','Teslim edildi','İade edildi'];
  return {
    id:`#ORD-${5500-i}`,
    customer:['Ahmet Yılmaz','Fatma Kaya','Mehmet Demir','Zeynep Çelik'][i%4],
    product:['Nike Air Max 270','Sony WH-1000XM5','Samsung S25','iPad Pro'][i%4],
    amount:`₺${((i+1)*1890%40000+500).toLocaleString('tr-TR')}`,
    date:`${11-(i%10)} Haz 2026`,
    status:statuses[i%statuses.length],
  };
});

export function SellerOrders() {
  const [orders,setOrders]=useState(initOrders);
  const [search,setSearch]=useState('');
  const [page,setPage]=useState(1);
  const [shipModal,setShipModal]=useState<string|null>(null);
  const [trackingNo,setTrackingNo]=useState('');
  const { toasts,show,remove } = useToast();
  const itemsPerPage=10;
  const filtered=orders.filter(o=>o.id.toLowerCase().includes(search.toLowerCase())||o.customer.toLowerCase().includes(search.toLowerCase()));
  const paged=filtered.slice((page-1)*itemsPerPage,page*itemsPerPage);

  const ship=()=>{
    setOrders(prev=>prev.map(o=>o.id===shipModal?{...o,status:'Kargoda' as Status}:o));
    setShipModal(null); setTrackingNo('');
    show('Sipariş kargoya verildi!','success');
  };

  return (
    <div style={{ fontFamily:'DM Sans, sans-serif' }} className="space-y-5">
      <div>
        <h1 style={{ ...headStyle, fontSize:22 }}>SİPARİŞLERİM</h1>
        <p style={{ color:'rgba(224,247,255,0.4)',fontSize:12 }} className="mt-0.5">Siparişlerinizi yönetin ve takip edin</p>
      </div>

      <div style={cardStyle}>
        <div className="px-5 py-4" style={{ borderBottom:'1px solid rgba(0,245,255,0.06)' }}>
          <DashSearchInput placeholder="Sipariş no veya müşteri ara..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} width="w-72" accent={SELLER_ACCENT}/>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(0,245,255,0.06)',background:'rgba(0,245,255,0.02)' }}>
                {['Sipariş No','Müşteri','Ürün','Tutar','Tarih','Durum','İşlem'].map(h=>(
                  <th key={h} className="px-5 py-3 text-left" style={{ fontSize:10,fontWeight:600,color:'rgba(224,247,255,0.4)',letterSpacing:'0.08em',textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map(order=>(
                <tr key={order.id} style={{ borderBottom:'1px solid rgba(0,245,255,0.04)' }}
                  onMouseEnter={e=>(e.currentTarget.style.background='rgba(0,245,255,0.03)')}
                  onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                  <td className="px-5 py-3.5 text-sm font-medium" style={{ color:SELLER_ACCENT }}>{order.id}</td>
                  <td className="px-5 py-3.5 text-sm" style={{ color:'rgba(224,247,255,0.75)' }}>{order.customer}</td>
                  <td className="px-5 py-3.5 text-sm max-w-[160px] truncate" style={{ color:'rgba(224,247,255,0.55)' }}>{order.product}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold" style={{ color:'#4ade80' }}>{order.amount}</td>
                  <td className="px-5 py-3.5 text-sm" style={{ color:'rgba(224,247,255,0.4)' }}>{order.date}</td>
                  <td className="px-5 py-3.5"><DashBadge variant={statusMap[order.status]}>{order.status}</DashBadge></td>
                  <td className="px-5 py-3.5">
                    {order.status==='Hazırlanıyor'?(
                      <button onClick={()=>setShipModal(order.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all"
                        style={{ background:'rgba(0,245,255,0.12)',border:'1px solid rgba(0,245,255,0.3)',color:SELLER_ACCENT,borderRadius:4 }}
                        onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(0,245,255,0.2)'}}
                        onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(0,245,255,0.12)'}}>
                        <Send size={12}/> Kargoya Ver
                      </button>
                    ):(
                      <span style={{ color:'rgba(224,247,255,0.25)',fontSize:13 }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4" style={{ borderTop:'1px solid rgba(0,245,255,0.06)' }}>
          <DashPagination currentPage={page} totalItems={filtered.length} itemsPerPage={itemsPerPage} onPageChange={setPage} accent={SELLER_ACCENT}/>
        </div>
      </div>

      <DashModal open={!!shipModal} onClose={()=>setShipModal(null)} title="Kargoya Ver" accent={SELLER_ACCENT}
        footer={<><button style={btnGhost} onClick={()=>setShipModal(null)}>Vazgeç</button><button style={btnPrimary} onClick={ship}>Gönder</button></>}>
        <div className="space-y-4">
          <p className="text-sm" style={{ color:'rgba(224,247,255,0.7)' }}><strong style={{ color:SELLER_ACCENT }}>{shipModal}</strong> kargoya verilecek.</p>
          <FormField label="Kargo Takip No"><DashInput placeholder="TK123456789" value={trackingNo} onChange={e=>setTrackingNo(e.target.value)}/></FormField>
          <FormField label="Kargo Firması">
            <select className="w-full" style={{ height:36,padding:'0 12px',fontSize:13,background:'rgba(0,245,255,0.04)',border:'1px solid rgba(0,245,255,0.15)',borderRadius:4,color:'rgba(224,247,255,0.85)',fontFamily:'DM Sans, sans-serif',outline:'none' }}>
              {['Aras Kargo','Yurtiçi Kargo','MNG Kargo','PTT Kargo'].map(c=><option key={c} style={{ background:'#050d15' }}>{c}</option>)}
            </select>
          </FormField>
        </div>
      </DashModal>
      <ToastContainer toasts={toasts} onRemove={remove}/>
    </div>
  );
}
