import {
  LayoutDashboard, ShoppingCart, Package, Megaphone, BarChart2, Sparkles
} from 'lucide-react';
import { NavLink } from 'react-router';
import { CyberLogo } from '../CyberLogo';
import { useAuthSession } from '../../auth/authSession';

const navItems = [
  { label: 'Dashboard',    icon: LayoutDashboard, path: '/panel/seller' },
  { label: 'Siparişlerim', icon: ShoppingCart,    path: '/panel/seller/orders' },
  { label: 'Ürünlerim',    icon: Package,         path: '/panel/seller/products' },
  { label: 'Kampanyalar',  icon: Megaphone,       path: '/panel/seller/campaigns' },
  { label: 'Raporlar',     icon: BarChart2,       path: '/panel/seller/reports' },
  { label: 'AI Assistant', icon: Sparkles,        path: '/panel/seller/ai-assistant' },
];

export function SellerSidebar() {
  const session = useAuthSession();
  const displayName = session?.fullName || 'Satıcı Mağaza';
  const displayEmail = session?.email || 'seller@store.com';
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'SL';

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col z-30"
      style={{ background: 'rgba(0,245,255,0.04)', borderRight: '1px solid rgba(0,245,255,0.15)', fontFamily: 'DM Sans, sans-serif', backdropFilter: 'blur(20px)' }}>
      <div className="h-[60px] flex items-center px-5"
        style={{ borderBottom: '1px solid rgba(0,245,255,0.1)' }}>
        <div className="flex items-center gap-2.5">
          <CyberLogo size={28} accent="#00f5ff" />
          <span style={{ color: '#00f5ff', fontWeight: 700, fontSize: 14, letterSpacing: '0.1em', textShadow: '0 0 10px rgba(0,245,255,0.6)', fontFamily: 'Playfair Display, serif' }}>
            SELLER
          </span>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-0.5">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} end={item.path === '/panel/seller'}
            style={({ isActive }) => isActive ? {
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 10px', borderRadius: 4,
              background: 'rgba(0,245,255,0.1)', color: '#00f5ff',
              borderLeft: '2px solid #00f5ff', boxShadow: 'inset 0 0 20px rgba(0,245,255,0.05)',
              fontSize: 14, fontWeight: 500, textDecoration: 'none',
            } : {
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 10px', borderRadius: 4,
              color: 'rgba(224,247,255,0.45)', borderLeft: '2px solid transparent',
              fontSize: 14, fontWeight: 500, textDecoration: 'none',
            }}
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} strokeWidth={1.75}
                  style={{ color: isActive ? '#00f5ff' : 'rgba(224,247,255,0.35)', filter: isActive ? 'drop-shadow(0 0 4px #00f5ff)' : 'none', flexShrink: 0 }} />
                <span style={{ color: isActive ? '#00f5ff' : 'rgba(224,247,255,0.5)' }}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4" style={{ borderTop: '1px solid rgba(0,245,255,0.08)', paddingTop: 12 }}>
        <div className="flex items-center gap-3 px-3 py-2 rounded"
          style={{ background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.1)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg,#00f5ff,#0080aa)', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: 'rgba(224,247,255,0.85)' }}>{displayName}</p>
            <p className="text-xs truncate" style={{ color: 'rgba(224,247,255,0.35)' }}>{displayEmail}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
