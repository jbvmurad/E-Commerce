import { useState } from 'react';

interface CityData {
  name: string;
  x: number;
  y: number;
  value: number;
  revenue?: string;
}

interface TurkeyMapProps {
  cities?: CityData[];
  accent?: string;
  title?: string;
  subtitle?: string;
  valueLabel?: string;
}

const defaultCities: CityData[] = [
  { name: 'İstanbul',   x: 91,  y: 50,  value: 3840, revenue: '₺1.24M' },
  { name: 'Ankara',     x: 220, y: 105, value: 1420, revenue: '₺498K' },
  { name: 'İzmir',      x: 38,  y: 172, value: 980,  revenue: '₺312K' },
  { name: 'Bursa',      x: 100, y: 88,  value: 640,  revenue: '₺198K' },
  { name: 'Antalya',    x: 152, y: 248, value: 520,  revenue: '₺171K' },
  { name: 'Adana',      x: 298, y: 246, value: 410,  revenue: '₺134K' },
  { name: 'Gaziantep',  x: 362, y: 248, value: 380,  revenue: '₺118K' },
  { name: 'Konya',      x: 208, y: 198, value: 360,  revenue: '₺109K' },
  { name: 'Kayseri',    x: 303, y: 160, value: 290,  revenue: '₺87K' },
  { name: 'Samsun',     x: 328, y: 35,  value: 240,  revenue: '₺72K' },
  { name: 'Trabzon',    x: 436, y: 50,  value: 190,  revenue: '₺56K' },
  { name: 'Diyarbakır', x: 452, y: 198, value: 170,  revenue: '₺49K' },
];

const MAX_RADIUS = 22;
const MIN_RADIUS = 7;

export function TurkeyMap({ cities = defaultCities, accent = '#00f5ff', title = 'Şehir Bazlı Sipariş Dağılımı', subtitle = 'Türkiye geneli aktif sipariş yoğunluğu', valueLabel = 'sipariş' }: TurkeyMapProps) {
  const [hovered, setHovered] = useState<CityData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const maxVal = Math.max(...cities.map((c) => c.value));

  const getRadius = (val: number) => MIN_RADIUS + ((val / maxVal) * (MAX_RADIUS - MIN_RADIUS));

  // Turkey simplified outline path (normalized to 600x280 SVG viewport)
  const turkeyPath = `
    M 58,82 L 62,70 L 72,55 L 84,42 L 96,35 L 112,28 L 130,24 L 148,18 L 168,12
    L 192,8  L 218,6  L 248,6  L 280,8  L 308,10 L 332,8  L 352,10 L 374,14
    L 396,18 L 416,24 L 438,32 L 452,42 L 462,56 L 468,72 L 472,90
    L 478,108 L 484,128 L 490,148 L 492,168 L 490,188 L 484,204 L 476,218
    L 464,228 L 450,236 L 432,244 L 414,252 L 396,258 L 374,260 L 352,260
    L 328,256 L 304,250 L 280,248 L 268,250 L 252,256 L 236,260 L 218,260
    L 198,256 L 178,248 L 158,242 L 142,250 L 126,258 L 108,260 L 92,258
    L 74,248 L 58,234 L 46,218 L 36,200 L 28,180 L 22,160 L 20,140
    L 20,120 L 26,102 L 36,90 L 48,84 L 58,82 Z
  `;

  return (
    <div className="rounded p-5 flex flex-col gap-4"
      style={{ background: '#050d15', border: `1px solid ${accent}15`, fontFamily: 'DM Sans, sans-serif' }}>
      <div>
        <p className="text-sm font-semibold" style={{ color: accent, textShadow: `0 0 10px ${accent}50`, fontFamily: 'Playfair Display, serif', letterSpacing: '0.04em' }}>{title}</p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(224,247,255,0.4)' }}>{subtitle}</p>
      </div>

      <div className="relative" style={{ position: 'relative' }}>
        <svg viewBox="0 0 520 280" width="100%" style={{ display: 'block' }}>
          <defs>
            {/* Grid pattern */}
            <pattern id={`grid-${accent.replace('#','')}`} width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke={`${accent}08`} strokeWidth="0.5" />
            </pattern>
            {/* Glow filter */}
            <filter id="city-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="city-glow-strong" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Radial gradient for hovered city */}
            <radialGradient id="pulse-grad">
              <stop offset="0%" stopColor={accent} stopOpacity="0.3" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background */}
          <rect width="520" height="280" fill="#020408" rx="4" />
          <rect width="520" height="280" fill={`url(#grid-${accent.replace('#','')})`} rx="4" />

          {/* Turkey outline */}
          <path d={turkeyPath} fill={`${accent}06`} stroke={`${accent}20`} strokeWidth="1.5" />
          <path d={turkeyPath} fill="none" stroke={`${accent}08`} strokeWidth="4" />

          {/* Connection lines between major cities (subtle) */}
          {[
            [0, 1], [0, 2], [0, 3], [1, 4], [1, 7], [1, 8], [7, 4], [8, 9], [9, 10], [8, 11], [4, 5], [5, 6],
          ].map(([a, b], i) => (
            <line key={i}
              x1={cities[a]?.x} y1={cities[a]?.y}
              x2={cities[b]?.x} y2={cities[b]?.y}
              stroke={`${accent}12`} strokeWidth="0.8" strokeDasharray="3,4"
            />
          ))}

          {/* City dots */}
          {cities.map((city) => {
            const r = getRadius(city.value);
            const isHov = hovered?.name === city.name;
            const intensity = city.value / maxVal;
            const color = intensity > 0.6 ? '#ff00ff' : intensity > 0.3 ? accent : `${accent}bb`;

            return (
              <g key={city.name}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  setHovered(city);
                  const rect = (e.currentTarget.closest('svg') as SVGSVGElement).getBoundingClientRect();
                  setTooltipPos({ x: city.x, y: city.y });
                }}
                onMouseLeave={() => setHovered(null)}>
                {/* Outer pulse ring */}
                <circle cx={city.x} cy={city.y} r={r + 8}
                  fill={isHov ? `${color}18` : 'transparent'}
                  stroke={isHov ? `${color}40` : 'transparent'}
                  strokeWidth="1" />
                {/* Glow layer */}
                <circle cx={city.x} cy={city.y} r={r + 3}
                  fill={`${color}15`}
                  filter="url(#city-glow)" />
                {/* Main dot */}
                <circle cx={city.x} cy={city.y} r={r}
                  fill={`${color}25`}
                  stroke={color}
                  strokeWidth={isHov ? 1.5 : 1}
                  style={{ filter: isHov ? `drop-shadow(0 0 ${r}px ${color})` : `drop-shadow(0 0 ${r/2}px ${color}80)` }}
                />
                {/* Inner core */}
                <circle cx={city.x} cy={city.y} r={Math.max(2, r * 0.35)}
                  fill={color}
                  style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
              </g>
            );
          })}

          {/* Labels for large cities */}
          {cities.filter((c) => c.value > 300).map((city) => (
            <text key={`lbl-${city.name}`}
              x={city.x}
              y={city.y - getRadius(city.value) - 6}
              textAnchor="middle"
              fontSize="9"
              fill={`${accent}90`}
              style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, pointerEvents: 'none' }}>
              {city.name}
            </text>
          ))}

          {/* Tooltip */}
          {hovered && (() => {
            const tx = Math.min(hovered.x + 12, 400);
            const ty = Math.max(hovered.y - 60, 10);
            return (
              <g>
                <rect x={tx} y={ty} width="110" height="52" rx="4"
                  fill="#050d15" stroke={`${accent}40`} strokeWidth="1" />
                <text x={tx + 8} y={ty + 16} fontSize="10" fontWeight="700" fill={accent}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}>{hovered.name}</text>
                <text x={tx + 8} y={ty + 30} fontSize="9" fill="rgba(224,247,255,0.7)"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {hovered.value.toLocaleString('tr-TR')} {valueLabel}
                </text>
                {hovered.revenue && (
                  <text x={tx + 8} y={ty + 44} fontSize="9" fill="#4ade80"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}>{hovered.revenue}</text>
                )}
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {[{ label: 'Düşük', color: `${accent}bb` }, { label: 'Orta', color: accent }, { label: 'Yüksek', color: '#ff00ff' }].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color, boxShadow: `0 0 6px ${l.color}` }} />
              <span className="text-xs" style={{ color: 'rgba(224,247,255,0.45)' }}>{l.label}</span>
            </div>
          ))}
        </div>
        <span className="text-xs" style={{ color: 'rgba(224,247,255,0.3)' }}>Üzerine gelin — detay</span>
      </div>
    </div>
  );
}
