import { useRef } from 'react';
import { Package, DollarSign, Star, RefreshCw } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar
} from 'recharts';
import { StatCard } from '../../../components/dashboard/StatCard';
import { DashBadge } from '../../../components/dashboard/DashBadge';
import { LeafletMap } from '../../../components/dashboard/LeafletMap';

const CYAN    = '#00f5ff';
const SELLER_ACCENT = '#00f5ff';
const GREEN   = '#4ade80';
const YELLOW  = '#fbbf24';

const monthlyRevenue = [
  { month: 'Oca', gelir: 8200  }, { month: 'Şub', gelir: 7100  }, { month: 'Mar', gelir: 9800  },
  { month: 'Nis', gelir: 11200 }, { month: 'May', gelir: 13400 }, { month: 'Haz', gelir: 18430 },
];

const weeklyData = [
  { day: 'Pzt', adet: 12 }, { day: 'Sal', adet: 19 }, { day: 'Çar', adet: 8 },
  { day: 'Per', adet: 25 }, { day: 'Cum', adet: 31 }, { day: 'Cmt', adet: 18 }, { day: 'Paz', adet: 22 },
];

const radarData = [
  { subject: 'Teslimat',  A: 92 }, { subject: 'Kalite',    A: 88 },
  { subject: 'İletişim',  A: 95 }, { subject: 'Paketleme', A: 79 },
  { subject: 'Fiyat',     A: 84 }, { subject: 'Hız',       A: 90 },
];


type Status = 'Beklemede' | 'Hazırlanıyor' | 'Kargoda' | 'Teslim edildi';
const statusMap: Record<Status,'yellow'|'orange'|'blue'|'green'> = {
  'Beklemede': 'yellow', 'Hazırlanıyor': 'orange', 'Kargoda': 'blue', 'Teslim edildi': 'green',
};

const recentOrders: {id:string;customer:string;product:string;amount:string;status:Status}[] = [
  { id:'#ORD-5521', customer:'Ahmet Yılmaz', product:'Nike Air Max 270',    amount:'₺2.490',  status:'Beklemede' },
  { id:'#ORD-5518', customer:'Zeynep Çelik', product:'Sony WH-1000XM5',    amount:'₺8.999',  status:'Teslim edildi' },
  { id:'#ORD-5520', customer:'Fatma Kaya',   product:'Samsung Galaxy S25', amount:'₺34.999', status:'Hazırlanıyor' },
  { id:'#ORD-5519', customer:'Mehmet Demir', product:'MacBook Air M3',     amount:'₺67.500', status:'Kargoda' },
];

const topProducts = [
  { name: 'Nike Air Max 270',    sold: 84, pct: 100 },
  { name: 'Sony WH-1000XM5',    sold: 61, pct: 73 },
  { name: 'Samsung Galaxy S25', sold: 47, pct: 56 },
  { name: 'MacBook Air M3',     sold: 33, pct: 39 },
  { name: 'iPad Pro 13"',       sold: 22, pct: 26 },
];

const cardStyle = { background: '#050d15', border: `1px solid rgba(0,245,255,0.12)`, borderRadius: 6 };
const headStyle: React.CSSProperties = { color: SELLER_ACCENT, fontFamily: 'Playfair Display, serif', letterSpacing: '0.04em', textShadow: `0 0 12px ${SELLER_ACCENT}50` };
const mutedStyle: React.CSSProperties = { color: 'rgba(224,247,255,0.4)', fontSize: 12 };

const CyberTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#050d15', border: `1px solid rgba(0,245,255,0.3)`, borderRadius: 6, padding: '8px 12px', fontSize: 12, fontFamily: 'DM Sans, sans-serif', boxShadow: '0 0 20px rgba(0,0,0,0.8)' }}>
      <p style={{ color: 'rgba(224,247,255,0.5)', marginBottom: 4 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {p.name === 'gelir' ? `₺${p.value.toLocaleString('tr-TR')}` : p.value}
        </p>
      ))}
    </div>
  );
};

export function SellerDashboardHome() {
  const uid = useRef(`c${Math.random().toString(36).slice(2)}`).current;
  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }} className="space-y-5">
      <div>
        <h1 style={{ ...headStyle, fontSize: 22 }}>MAĞAZA PANELİ</h1>
        <p style={mutedStyle} className="mt-0.5">Satış performansı — Haziran 2026</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Satılan Ürün"    value="1,284"   change={12.5} icon={<Package size={18} />}    accent={SELLER_ACCENT} />
        <StatCard title="Bugünkü Gelir"   value="₺18.430" change={7.3}  icon={<DollarSign size={18} />} accent={CYAN} />
        <StatCard title="Müşteri Puanı"   value="4.8 / 5" change={2.1}  icon={<Star size={18} />}       accent={YELLOW} />
        <StatCard title="İade Oranı"      value="%3.2"    change={-1.4} icon={<RefreshCw size={18} />}  accent={GREEN} />
      </div>

      {/* Revenue + Radar */}
      <div className="grid grid-cols-3 gap-4">
        {/* Monthly revenue area */}
        <div className="col-span-2 p-5" style={cardStyle}>
          <div className="mb-4">
            <p style={{ ...headStyle, fontSize: 14 }}>Aylık Gelir Trendi</p>
            <p style={mutedStyle} className="mt-0.5">Son 6 aylık satış geliri</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart id={`${uid}-s-area`} data={monthlyRevenue} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id={`${uid}-seller-grad`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={SELLER_ACCENT} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={SELLER_ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(0,245,255,0.05)" />
              <XAxis key="x-axis" dataKey="month" tick={{ fontSize: 11, fill: 'rgba(224,247,255,0.4)', fontFamily: 'DM Sans, sans-serif' }} axisLine={false} tickLine={false} />
              <YAxis key="y-axis" tick={{ fontSize: 11, fill: 'rgba(224,247,255,0.4)', fontFamily: 'DM Sans, sans-serif' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₺${(v/1000).toFixed(0)}k`} />
              <Tooltip key="tooltip" content={<CyberTooltip />} />
              <Area key="area-gelir" type="monotone" dataKey="gelir" name="gelir" stroke={SELLER_ACCENT} strokeWidth={2} fill={`url(#${uid}-seller-grad)`} dot={false} activeDot={{ r: 4, fill: SELLER_ACCENT, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Radar / Performance */}
        <div className="p-5" style={cardStyle}>
          <div className="mb-2">
            <p style={{ ...headStyle, fontSize: 14 }}>Performans</p>
            <p style={mutedStyle} className="mt-0.5">Müşteri değerlendirme</p>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <RadarChart id={`${uid}-s-radar`} data={radarData}>
              <PolarGrid key="polar-grid" stroke="rgba(0,245,255,0.1)" />
              <PolarAngleAxis key="polar-angle" dataKey="subject" tick={{ fontSize: 10, fill: 'rgba(224,247,255,0.5)', fontFamily: 'DM Sans, sans-serif' }} />
              <PolarRadiusAxis key="polar-radius" domain={[0,100]} tick={false} axisLine={false} />
              <Radar key="radar-puan" name="Puan" dataKey="A" stroke={SELLER_ACCENT} fill={SELLER_ACCENT} fillOpacity={0.15} strokeWidth={1.5} />
              <Tooltip key="tooltip" contentStyle={{ background: '#050d15', border: '1px solid rgba(0,245,255,0.3)', borderRadius: 6, fontSize: 12, fontFamily: 'DM Sans, sans-serif' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly + Top Products + Map */}
      <div className="grid grid-cols-3 gap-4">
        {/* Weekly bar */}
        <div className="p-5" style={cardStyle}>
          <div className="mb-4">
            <p style={{ ...headStyle, fontSize: 14 }}>Haftalık Satış</p>
            <p style={mutedStyle} className="mt-0.5">Günlük satış adedi</p>
          </div>
          <ResponsiveContainer width="100%" height={165}>
            <BarChart id={`${uid}-s-bar`} data={weeklyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(0,245,255,0.05)" vertical={false} />
              <XAxis key="x-axis" dataKey="day" tick={{ fontSize: 11, fill: 'rgba(224,247,255,0.4)', fontFamily: 'DM Sans, sans-serif' }} axisLine={false} tickLine={false} />
              <YAxis key="y-axis" tick={{ fontSize: 11, fill: 'rgba(224,247,255,0.4)', fontFamily: 'DM Sans, sans-serif' }} axisLine={false} tickLine={false} />
              <Tooltip key="tooltip" content={<CyberTooltip />} />
              <Bar key="bar-adet" dataKey="adet" name="Satış" fill={SELLER_ACCENT} radius={[3,3,0,0]} style={{ filter: 'drop-shadow(0 0 4px rgba(0,245,255,0.4))' }} />
            </BarChart>
          </ResponsiveContainer>

          {/* Top products list */}
          <div className="mt-4 space-y-2.5" style={{ borderTop: '1px solid rgba(0,245,255,0.08)', paddingTop: 14 }}>
            <p style={{ fontSize: 11, color: 'rgba(224,247,255,0.4)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>En Çok Satanlar</p>
            {topProducts.map((p) => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs truncate max-w-[130px]" style={{ color: 'rgba(224,247,255,0.65)' }}>{p.name}</span>
                  <span className="text-xs font-semibold" style={{ color: SELLER_ACCENT }}>{p.sold}</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(0,245,255,0.1)' }}>
                  <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: `linear-gradient(90deg,${SELLER_ACCENT},${CYAN})`, boxShadow: `0 0 6px ${SELLER_ACCENT}60` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* World Map - 2 cols */}
        <div className="col-span-2">
          <LeafletMap
            accent={SELLER_ACCENT}
            title="Global Müşteri Dağılımı"
            subtitle="Ülkeye tıkla — yakınlaştır, sürükle — gez"
          />
        </div>
      </div>

      {/* Recent Orders */}
      <div style={cardStyle}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(0,245,255,0.08)' }}>
          <p style={{ ...headStyle, fontSize: 14 }}>Son Siparişler</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,245,255,0.06)', background: 'rgba(0,245,255,0.02)' }}>
              {['Sipariş No', 'Müşteri', 'Ürün', 'Tutar', 'Durum'].map((h) => (
                <th key={h} className="px-5 py-3 text-left" style={{ fontSize: 10, fontWeight: 600, color: 'rgba(224,247,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid rgba(0,245,255,0.04)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,245,255,0.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <td className="px-5 py-3.5 text-sm font-medium" style={{ color: SELLER_ACCENT }}>{o.id}</td>
                <td className="px-5 py-3.5 text-sm" style={{ color: 'rgba(224,247,255,0.75)' }}>{o.customer}</td>
                <td className="px-5 py-3.5 text-sm" style={{ color: 'rgba(224,247,255,0.55)' }}>{o.product}</td>
                <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: GREEN }}>{o.amount}</td>
                <td className="px-5 py-3.5"><DashBadge variant={statusMap[o.status]}>{o.status}</DashBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
