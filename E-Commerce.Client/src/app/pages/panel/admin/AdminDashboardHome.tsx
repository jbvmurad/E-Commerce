import { useRef } from 'react';
import { ShoppingCart, Clock, RefreshCw, DollarSign, MoreVertical } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import { useState } from 'react';
import { StatCard } from '../../../components/dashboard/StatCard';
import { DashBadge } from '../../../components/dashboard/DashBadge';
import { DashPagination } from '../../../components/dashboard/DashPagination';
import { LeafletMap } from '../../../components/dashboard/LeafletMap';
import {
  CYAN, MAGENTA, GREEN, YELLOW, cardStyle, headStyle, mutedStyle, thStyle, trHover, btnCyan, cyberTooltipStyle,
} from '../../../components/dashboard/panelTheme';

const revenueData = [
  { month: 'Oca', gelir: 42000, siparis: 320 }, { month: 'Şub', gelir: 38500, siparis: 290 },
  { month: 'Mar', gelir: 51000, siparis: 410 }, { month: 'Nis', gelir: 47200, siparis: 380 },
  { month: 'May', gelir: 63400, siparis: 520 }, { month: 'Haz', gelir: 58900, siparis: 480 },
  { month: 'Tem', gelir: 71200, siparis: 590 }, { month: 'Ağu', gelir: 69800, siparis: 570 },
  { month: 'Eyl', gelir: 78300, siparis: 640 }, { month: 'Eki', gelir: 82100, siparis: 670 },
  { month: 'Kas', gelir: 91400, siparis: 740 }, { month: 'Ara', gelir: 103600, siparis: 840 },
];

const categoryData = [
  { name: 'Elektronik', value: 38, color: CYAN    },
  { name: 'Giyim',      value: 24, color: MAGENTA },
  { name: 'Ayakkabı',   value: 16, color: GREEN   },
  { name: 'Ev & Yaşam', value: 14, color: YELLOW  },
  { name: 'Diğer',      value: 8,  color: '#00d4e8' },
];

const weeklyOrders = [
  { day: 'Pzt', tamamlandi: 48, bekliyor: 12 }, { day: 'Sal', tamamlandi: 62, bekliyor: 18 },
  { day: 'Çar', tamamlandi: 39, bekliyor: 8  }, { day: 'Per', tamamlandi: 71, bekliyor: 22 },
  { day: 'Cum', tamamlandi: 84, bekliyor: 31 }, { day: 'Cmt', tamamlandi: 53, bekliyor: 14 },
  { day: 'Paz', tamamlandi: 44, bekliyor: 9  },
];

type Status = 'Beklemede'|'Hazırlanıyor'|'Kargoda'|'Teslim edildi'|'İade edildi';
const statusMap: Record<Status,'yellow'|'orange'|'blue'|'green'|'red'> = {
  'Beklemede':'yellow','Hazırlanıyor':'orange','Kargoda':'blue','Teslim edildi':'green','İade edildi':'red',
};

const orders: { id:string; customer:string; product:string; amount:string; date:string; status:Status }[] = [
  { id:'#ORD-5521', customer:'Ahmet Yılmaz',  product:'Nike Air Max 270',     amount:'₺2.490',  date:'11 Haz 2026', status:'Beklemede' },
  { id:'#ORD-5520', customer:'Fatma Kaya',     product:'Samsung Galaxy S25',   amount:'₺34.999', date:'11 Haz 2026', status:'Hazırlanıyor' },
  { id:'#ORD-5519', customer:'Mehmet Demir',   product:'MacBook Air M3',       amount:'₺67.500', date:'10 Haz 2026', status:'Kargoda' },
  { id:'#ORD-5518', customer:'Zeynep Çelik',   product:'Sony WH-1000XM5',     amount:'₺8.999',  date:'10 Haz 2026', status:'Teslim edildi' },
  { id:'#ORD-5517', customer:'Ali Öztürk',     product:'iPad Pro 13"',         amount:'₺42.000', date:'09 Haz 2026', status:'İade edildi' },
  { id:'#ORD-5516', customer:'Ayşe Şahin',     product:'Dyson V15 Detect',    amount:'₺22.490', date:'09 Haz 2026', status:'Teslim edildi' },
  { id:'#ORD-5515', customer:'Burak Arslan',    product:'Apple Watch Ultra 2', amount:'₺31.999', date:'08 Haz 2026', status:'Kargoda' },
  { id:'#ORD-5514', customer:'Selin Güner',     product:'LG OLED C4 65"',     amount:'₺89.999', date:'08 Haz 2026', status:'Beklemede' },
];

const CyberTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={cyberTooltipStyle}>
      <p style={{ color: 'rgba(224,247,255,0.45)', marginBottom: 4, fontSize: 11 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color, fontSize: 12 }}>
          {p.name}: {p.name.includes('Gelir') || p.name === 'gelir' ? `₺${p.value.toLocaleString('tr-TR')}` : p.value}
        </p>
      ))}
    </div>
  );
};

function RevenueAreaChart({ uid }: { uid: string }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart id={`${uid}-area`} data={revenueData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id={`${uid}-rev-cyan`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={CYAN}    stopOpacity={0.2} />
            <stop offset="95%" stopColor={CYAN}    stopOpacity={0} />
          </linearGradient>
          <linearGradient id={`${uid}-rev-magenta`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={MAGENTA} stopOpacity={0.2} />
            <stop offset="95%" stopColor={MAGENTA} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(0,245,255,0.06)" />
        <XAxis key="x-axis" dataKey="month" tick={{ fontSize: 11, fill: 'rgba(224,247,255,0.4)', fontFamily: 'DM Sans, sans-serif' }} axisLine={false} tickLine={false} />
        <YAxis key="y-left"  yAxisId="left"  tick={{ fontSize: 11, fill: 'rgba(224,247,255,0.4)', fontFamily: 'DM Sans, sans-serif' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₺${(v/1000).toFixed(0)}k`} />
        <YAxis key="y-right" yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: 'rgba(224,247,255,0.4)', fontFamily: 'DM Sans, sans-serif' }} axisLine={false} tickLine={false} />
        <Tooltip key="tooltip" content={<CyberTooltip />} />
        <Area key="area-gelir"   yAxisId="left"  type="monotone" dataKey="gelir"   name="Gelir"   stroke={CYAN}    strokeWidth={2}   fill={`url(#${uid}-rev-cyan)`}    dot={false} activeDot={{ r: 4, fill: CYAN,    strokeWidth: 0 }} />
        <Area key="area-siparis" yAxisId="right" type="monotone" dataKey="siparis" name="Sipariş" stroke={MAGENTA} strokeWidth={1.5} fill={`url(#${uid}-rev-magenta)`} dot={false} activeDot={{ r: 3, fill: MAGENTA, strokeWidth: 0 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function CategoryPieChart({ uid }: { uid: string }) {
  return (
    <>
      <ResponsiveContainer width="100%" height={155}>
        <PieChart id={`${uid}-pie`}>
          <Pie data={categoryData} cx="50%" cy="50%" innerRadius={42} outerRadius={65} dataKey="value" strokeWidth={0}>
            {categoryData.map((e) => (
              <Cell key={`cat-${e.name}`} fill={e.color} style={{ filter: `drop-shadow(0 0 4px ${e.color}80)` }} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ ...cyberTooltipStyle }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-2">
        {categoryData.map((c) => (
          <div key={c.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: c.color, boxShadow: `0 0 4px ${c.color}` }} />
              <span style={{ fontSize: 12, color: 'rgba(224,247,255,0.6)', fontFamily: 'DM Sans, sans-serif' }}>{c.name}</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: c.color, fontFamily: 'DM Sans, sans-serif' }}>%{c.value}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function WeeklyBarChart({ uid }: { uid: string }) {
  return (
    <>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart id={`${uid}-bar`} data={weeklyOrders} margin={{ top: 4, right: 4, left: -15, bottom: 0 }} barGap={3}>
          <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(0,245,255,0.06)" vertical={false} />
          <XAxis key="x-axis" dataKey="day" tick={{ fontSize: 11, fill: 'rgba(224,247,255,0.4)', fontFamily: 'DM Sans, sans-serif' }} axisLine={false} tickLine={false} />
          <YAxis key="y-axis" tick={{ fontSize: 11, fill: 'rgba(224,247,255,0.4)', fontFamily: 'DM Sans, sans-serif' }} axisLine={false} tickLine={false} />
          <Tooltip key="tooltip" content={<CyberTooltip />} />
          <Bar key="bar-tamamlandi" dataKey="tamamlandi" name="Tamamlandı" fill={CYAN}    radius={[3,3,0,0]} style={{ filter: 'drop-shadow(0 0 4px rgba(0,245,255,0.5))' }} />
          <Bar key="bar-bekliyor"   dataKey="bekliyor"   name="Bekliyor"   fill={MAGENTA} radius={[3,3,0,0]} style={{ filter: 'drop-shadow(0 0 4px rgba(255,0,255,0.5))' }} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-5 mt-2">
        {[{label:'Tamamlandı',color:CYAN},{label:'Bekliyor',color:MAGENTA}].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ background: l.color, boxShadow: `0 0 5px ${l.color}` }} />
            <span style={{ fontSize: 11, color: 'rgba(224,247,255,0.5)', fontFamily: 'DM Sans, sans-serif' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export function AdminDashboardHome() {
  const uid = useRef(`c${Math.random().toString(36).slice(2)}`).current;
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const itemsPerPage = 6;
  const paged = orders.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }} className="space-y-5">
      {/* Page title */}
      <div>
        <h1 style={{ ...headStyle, fontSize: 22 }}>DASHBOARD</h1>
        <p style={mutedStyle} className="mt-0.5">Platform genel bakış — Haziran 2026</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Toplam Sipariş"   value="12,483" change={8.2}   icon={<ShoppingCart size={18} />} accent={CYAN}    />
        <StatCard title="Bekleyen Sipariş" value="247"    change={-3.1}  icon={<Clock size={18} />}        accent={YELLOW}  />
        <StatCard title="İade Sayısı"      value="89"     change={-12.4} icon={<RefreshCw size={18} />}    accent={MAGENTA} />
        <StatCard title="Toplam Gelir"     value="₺4.82M" change={15.7}  icon={<DollarSign size={18} />}   accent={GREEN}   />
      </div>

      {/* Revenue + Pie */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 p-5" style={cardStyle}>
          <p style={{ ...headStyle, fontSize: 14 }}>Aylık Gelir & Sipariş</p>
          <p style={mutedStyle} className="mt-0.5 mb-4">2026 yılı kümülatif verileri</p>
          <RevenueAreaChart uid={uid} />
        </div>

        <div className="p-5" style={cardStyle}>
          <p style={{ ...headStyle, fontSize: 14 }}>Kategori Dağılımı</p>
          <p style={mutedStyle} className="mt-0.5 mb-3">Satış yüzdesi</p>
          <CategoryPieChart uid={uid} />
        </div>
      </div>

      {/* Weekly Bar + World Map */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5" style={cardStyle}>
          <p style={{ ...headStyle, fontSize: 14 }}>Haftalık Sipariş</p>
          <p style={mutedStyle} className="mt-0.5 mb-4">Tamamlanan vs Bekleyen</p>
          <WeeklyBarChart uid={uid} />
        </div>
        <LeafletMap accent={CYAN} title="Global Sipariş Dağılımı" subtitle="Ülkeye tıkla — yakınlaştır, sürükle — gez" />
      </div>

      {/* Orders Table */}
      <div style={cardStyle}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid rgba(0,245,255,0.15)` }}>
          <p style={{ ...headStyle, fontSize: 14 }}>Son Siparişler</p>
          <span style={{ ...mutedStyle }}>{orders.length} sipariş</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>{['Sipariş No','Müşteri','Ürün','Tutar','Tarih','Durum',''].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {paged.map((order) => (
                <tr key={order.id} style={{ borderBottom: `1px solid rgba(0,245,255,0.06)` }} {...trHover}>
                  <td className="px-5 py-3.5 text-sm font-medium" style={{ color: CYAN }}>{order.id}</td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: 'rgba(224,247,255,0.8)' }}>{order.customer}</td>
                  <td className="px-5 py-3.5 text-sm max-w-[180px] truncate" style={{ color: 'rgba(224,247,255,0.55)' }}>{order.product}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: GREEN }}>{order.amount}</td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: 'rgba(224,247,255,0.4)' }}>{order.date}</td>
                  <td className="px-5 py-3.5"><DashBadge variant={statusMap[order.status]}>{order.status}</DashBadge></td>
                  <td className="px-5 py-3.5 text-right relative">
                    <button onClick={() => setMenuOpen(menuOpen === order.id ? null : order.id)}
                      className="w-7 h-7 flex items-center justify-center rounded"
                      style={{ color: 'rgba(224,247,255,0.35)', border: '1px solid rgba(0,245,255,0.15)' }}>
                      <MoreVertical size={14} />
                    </button>
                    {menuOpen === order.id && (
                      <div className="absolute right-5 top-full mt-1 w-36 py-1 z-10"
                        style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.25)', borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.8), 0 0 20px rgba(0,245,255,0.05)' }}>
                        {['Detay Gör','Düzenle','İptal Et'].map((a) => (
                          <button key={a} className="flex w-full px-3 py-2 text-xs transition-colors"
                            style={{ color: a === 'İptal Et' ? MAGENTA : 'rgba(224,247,255,0.7)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = a === 'İptal Et' ? 'rgba(255,0,255,0.08)' : 'rgba(0,245,255,0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                            onClick={() => setMenuOpen(null)}>{a}</button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4" style={{ borderTop: `1px solid rgba(0,245,255,0.1)` }}>
          <DashPagination currentPage={page} totalItems={orders.length} itemsPerPage={itemsPerPage} onPageChange={setPage} accent={CYAN} />
        </div>
      </div>
    </div>
  );
}
