import { useRef } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SELLER_ACCENT = '#00f5ff'; const CYAN = '#00f5ff'; const GREEN = '#4ade80';
const cardStyle = { background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.15)', borderRadius: 8 };
const headStyle: React.CSSProperties = { color: SELLER_ACCENT, fontFamily: 'Playfair Display, serif', letterSpacing: '0.06em', textShadow: `0 0 20px ${SELLER_ACCENT}` };

const monthly = [
  { ay: 'Oca', gelir: 8200  }, { ay: 'Şub', gelir: 7100  }, { ay: 'Mar', gelir: 9800  },
  { ay: 'Nis', gelir: 11200 }, { ay: 'May', gelir: 13400 }, { ay: 'Haz', gelir: 18430 },
];
const topProducts = [
  { name: 'Nike Air Max',  satis: 84 },
  { name: 'Sony WH-1000',  satis: 61 },
  { name: 'Galaxy S25',    satis: 47 },
  { name: 'MacBook M3',    satis: 33 },
];

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.3)', borderRadius: 6, padding: '8px 12px', fontSize: 12, fontFamily: 'DM Sans, sans-serif' }}>
      <p style={{ color: 'rgba(224,247,255,0.45)' }}>{label}</p>
      {payload.map((p: any, i: number) => <p key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' && p.name === 'gelir' ? `₺${p.value.toLocaleString('tr-TR')}` : p.value}</p>)}
    </div>
  );
};

export function SellerReports() {
  const uid = useRef(`c${Math.random().toString(36).slice(2)}`).current;
  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }} className="space-y-5">
      <div>
        <h1 style={{ ...headStyle, fontSize: 22 }}>RAPORLAR</h1>
        <p style={{ color: 'rgba(224,247,255,0.4)', fontSize: 12 }} className="mt-0.5">Mağaza performans analizi</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[{l:'Toplam Gelir',v:'₺68.430',c:GREEN},{l:'Satılan Ürün',v:'1.284',c:SELLER_ACCENT},{l:'Ort. Puan',v:'4.8/5',c:CYAN}].map((k) => (
          <div key={k.l} className="p-4 rounded" style={cardStyle}>
            <p style={{ fontSize: 11, color: 'rgba(224,247,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{k.l}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: k.c, textShadow: `0 0 14px ${k.c}50`, fontFamily: 'Playfair Display, serif' }} className="mt-1">{k.v}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5" style={cardStyle}>
          <p style={{ ...headStyle, fontSize: 14 }}>Aylık Gelir</p>
          <ResponsiveContainer key={`${uid}-sr-area`} width="100%" height={200}>
            <AreaChart id={`${uid}-sr-area`} data={monthly} margin={{ top: 8, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id={`${uid}-seller-rpt`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={SELLER_ACCENT} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={SELLER_ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(0,245,255,0.06)" />
              <XAxis key="x-axis" dataKey="ay" tick={{ fontSize: 11, fill: 'rgba(224,247,255,0.4)' }} axisLine={false} tickLine={false} />
              <YAxis key="y-axis" tick={{ fontSize: 11, fill: 'rgba(224,247,255,0.4)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₺${(v/1000).toFixed(0)}k`} />
              <Tooltip key="tooltip" content={<Tip />} />
              <Area key="area-gelir" type="monotone" dataKey="gelir" name="gelir" stroke={SELLER_ACCENT} strokeWidth={2} fill={`url(#${uid}-seller-rpt)`} dot={false} activeDot={{ r: 4, fill: SELLER_ACCENT, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="p-5" style={cardStyle}>
          <p style={{ ...headStyle, fontSize: 14 }}>Ürün Satışları</p>
          <ResponsiveContainer key={`${uid}-sr-bar`} width="100%" height={200}>
            <BarChart id={`${uid}-sr-bar`} data={topProducts} margin={{ top: 8, right: 4, left: -10, bottom: 0 }}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(0,245,255,0.06)" vertical={false} />
              <XAxis key="x-axis" dataKey="name" tick={{ fontSize: 10, fill: 'rgba(224,247,255,0.4)' }} axisLine={false} tickLine={false} />
              <YAxis key="y-axis" tick={{ fontSize: 11, fill: 'rgba(224,247,255,0.4)' }} axisLine={false} tickLine={false} />
              <Tooltip key="tooltip" content={<Tip />} />
              <Bar key="bar-satis" dataKey="satis" name="Satış" fill={SELLER_ACCENT} radius={[3,3,0,0]} style={{ filter: 'drop-shadow(0 0 4px rgba(0,245,255,0.4))' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
