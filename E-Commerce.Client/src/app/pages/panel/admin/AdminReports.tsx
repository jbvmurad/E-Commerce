import { useRef } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';

const CYAN = '#00f5ff'; const MAGENTA = '#ff00ff'; const GREEN = '#4ade80';
const cardStyle = { background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.15)', borderRadius: 8 };
const headStyle: React.CSSProperties = { color: CYAN, fontFamily: 'Playfair Display, serif', letterSpacing: '0.06em', textShadow: `0 0 20px ${CYAN}` };

const monthlyData = [
  { ay: 'Oca', gelir: 42000, siparis: 320, musteri: 180 },
  { ay: 'Şub', gelir: 38500, siparis: 290, musteri: 160 },
  { ay: 'Mar', gelir: 51000, siparis: 410, musteri: 220 },
  { ay: 'Nis', gelir: 47200, siparis: 380, musteri: 198 },
  { ay: 'May', gelir: 63400, siparis: 520, musteri: 280 },
  { ay: 'Haz', gelir: 103600, siparis: 840, musteri: 410 },
];

const categoryRevenue = [
  { name: 'Elektronik', value: 1842000 },
  { name: 'Giyim',      value: 984000  },
  { name: 'Ayakkabı',   value: 742000  },
  { name: 'Ev & Yaşam', value: 612000  },
  { name: 'Kozmetik',   value: 398000  },
  { name: 'Diğer',      value: 284000  },
];

const CyberTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.25)', borderRadius: 6, padding: '8px 12px', fontSize: 12, fontFamily: 'DM Sans, sans-serif' }}>
      <p style={{ color: 'rgba(224,247,255,0.45)', marginBottom: 4 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? (p.name.includes('Gelir') || p.name.includes('value') ? `₺${p.value.toLocaleString('tr-TR')}` : p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

const kpis = [
  { label: 'Toplam Gelir',   value: '₺4.82M', change: '+15.7%', color: GREEN   },
  { label: 'Dönüşüm Oranı', value: '%3.8',   change: '+0.4%',  color: CYAN    },
  { label: 'Ort. Sipariş',   value: '₺1.840', change: '+8.2%',  color: MAGENTA },
  { label: 'Yeni Müşteri',   value: '1,448',  change: '+22.1%', color: GREEN   },
];

function RevenueAreaChart({ uid }: { uid: string }) {
  return (
    <ResponsiveContainer width="100%" height={210}>
      <AreaChart id={`${uid}-rpt-area`} data={monthlyData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id={`${uid}-rpt-cyan`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CYAN} stopOpacity={0.2} />
            <stop offset="95%" stopColor={CYAN} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(0,245,255,0.06)" />
        <XAxis key="x-axis" dataKey="ay" tick={{ fontSize: 11, fill: 'rgba(224,247,255,0.4)' }} axisLine={false} tickLine={false} />
        <YAxis key="y-axis" tick={{ fontSize: 11, fill: 'rgba(224,247,255,0.4)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₺${(v/1000).toFixed(0)}k`} />
        <Tooltip key="tooltip" content={<CyberTip />} />
        <Area key="area-gelir" type="monotone" dataKey="gelir" name="Gelir" stroke={CYAN} strokeWidth={2} fill={`url(#${uid}-rpt-cyan)`} dot={false} activeDot={{ r: 4, fill: CYAN, strokeWidth: 0 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function CategoryBarChart({ uid }: { uid: string }) {
  return (
    <ResponsiveContainer width="100%" height={210}>
      <BarChart id={`${uid}-rpt-bar`} data={categoryRevenue} layout="vertical" margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(0,245,255,0.06)" horizontal={false} />
        <XAxis key="x-axis" type="number" tick={{ fontSize: 10, fill: 'rgba(224,247,255,0.4)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₺${(v/1000).toFixed(0)}k`} />
        <YAxis key="y-axis" type="category" dataKey="name" tick={{ fontSize: 11, fill: 'rgba(224,247,255,0.55)' }} axisLine={false} tickLine={false} width={72} />
        <Tooltip key="tooltip" content={<CyberTip />} />
        <Bar key="bar-value" dataKey="value" name="Gelir" fill={CYAN} radius={[0, 3, 3, 0]} style={{ filter: 'drop-shadow(0 0 4px rgba(0,245,255,0.4))' }} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function TrendLineChart({ uid }: { uid: string }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart id={`${uid}-rpt-line`} data={monthlyData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(0,245,255,0.06)" />
        <XAxis key="x-axis" dataKey="ay" tick={{ fontSize: 11, fill: 'rgba(224,247,255,0.4)' }} axisLine={false} tickLine={false} />
        <YAxis key="y-axis" tick={{ fontSize: 11, fill: 'rgba(224,247,255,0.4)' }} axisLine={false} tickLine={false} />
        <Tooltip key="tooltip" content={<CyberTip />} />
        <Line key="line-siparis" type="monotone" dataKey="siparis" name="Sipariş" stroke={CYAN} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: CYAN, strokeWidth: 0 }} />
        <Line key="line-musteri" type="monotone" dataKey="musteri" name="Yeni Müşteri" stroke={MAGENTA} strokeWidth={2} strokeDasharray="5 3" dot={false} activeDot={{ r: 4, fill: MAGENTA, strokeWidth: 0 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function AdminReports() {
  const uid = useRef(`c${Math.random().toString(36).slice(2)}`).current;
  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }} className="space-y-5">
      <div>
        <h1 style={{ ...headStyle, fontSize: 22 }}>RAPORLAR</h1>
        <p style={{ color: 'rgba(224,247,255,0.4)', fontSize: 12 }} className="mt-0.5">Platform analitik verileri — Haziran 2026</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="p-4 rounded" style={cardStyle}>
            <p style={{ fontSize: 11, color: 'rgba(224,247,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{k.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: k.color, textShadow: `0 0 16px ${k.color}50`, fontFamily: 'Playfair Display, serif' }} className="mt-1">{k.value}</p>
            <p style={{ fontSize: 11, color: '#4ade80', marginTop: 2 }}>{k.change} bu ay</p>
          </div>
        ))}
      </div>

      {/* Revenue area + bar */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5" style={cardStyle}>
          <p style={{ ...headStyle, fontSize: 14 }}>Aylık Gelir</p>
          <p style={{ color: 'rgba(224,247,255,0.4)', fontSize: 11 }} className="mt-0.5 mb-4">Son 6 ay</p>
          <RevenueAreaChart uid={uid} />
        </div>

        <div className="p-5" style={cardStyle}>
          <p style={{ ...headStyle, fontSize: 14 }}>Kategori Geliri</p>
          <p style={{ color: 'rgba(224,247,255,0.4)', fontSize: 11 }} className="mt-0.5 mb-4">Yıllık bazda</p>
          <CategoryBarChart uid={uid} />
        </div>
      </div>

      {/* Sipariş + Müşteri line chart */}
      <div className="p-5" style={cardStyle}>
        <p style={{ ...headStyle, fontSize: 14 }}>Sipariş & Yeni Müşteri Trendi</p>
        <p style={{ color: 'rgba(224,247,255,0.4)', fontSize: 11 }} className="mt-0.5 mb-4">Aylık karşılaştırma</p>
        <TrendLineChart uid={uid} />
        <div className="flex gap-5 mt-2">
          {[{ label: 'Sipariş', color: CYAN }, { label: 'Yeni Müşteri', color: MAGENTA }].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded" style={{ background: l.color, boxShadow: `0 0 4px ${l.color}` }} />
              <span style={{ fontSize: 11, color: 'rgba(224,247,255,0.5)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
