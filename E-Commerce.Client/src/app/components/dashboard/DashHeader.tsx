import { Bell, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { DashSearchInput } from './DashSearchInput';
import { getStoredLanguage, setStoredLanguage, SupportedLanguage } from '../../config/runtime';
import { useAuthSession } from '../../auth/authSession';
import { authService } from '../../services/authService';

interface DashHeaderProps {
  searchPlaceholder?: string;
  accent?: string;
  roleLabel?: string;
}

const LANGS: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'az', label: 'Azərbaycan', flag: '🇦🇿' },
];

export function DashHeader({ searchPlaceholder = 'Sipariş, müşteri, ürün ara...', accent = '#00f5ff', roleLabel }: DashHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [activeLang, setActiveLang] = useState(() => LANGS.find((lang) => lang.code === getStoredLanguage()) ?? LANGS[0]);
  const navigate = useNavigate();
  const session = useAuthSession();
  const displayRole = roleLabel ?? session?.roles[0] ?? 'User';
  const displayName = session?.fullName ?? displayRole;
  const initials = displayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  const changeLanguage = (language: typeof LANGS[number]) => {
    setActiveLang(language);
    setStoredLanguage(language.code);
    setLangOpen(false);
  };

  const logout = async () => {
    setProfileOpen(false);
    try {
      await authService.logout();
    } finally {
      navigate('/login');
    }
  };

  return (
    <header className="fixed top-0 left-60 right-0 h-[60px] flex items-center justify-between px-6 z-20"
      style={{ background: 'rgba(2,4,8,0.9)', borderBottom: `1px solid ${accent}25`, fontFamily: 'DM Sans, sans-serif', backdropFilter: 'blur(20px)' }}>
      <DashSearchInput placeholder={searchPlaceholder} width="w-80" accent={accent} />

      <div className="flex items-center gap-2">
        <div className="relative">
          <button onClick={() => { setLangOpen(!langOpen); setProfileOpen(false); }} className="flex items-center gap-1.5 h-9 px-2.5 rounded transition-all"
            style={{ border: `1px solid ${langOpen ? accent + '40' : accent + '15'}`, background: langOpen ? `${accent}0d` : 'transparent', color: 'rgba(224,247,255,0.7)' }}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>{activeLang.flag}</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(224,247,255,0.75)' }}>{activeLang.code.toUpperCase()}</span>
            <ChevronDown size={12} style={{ color: 'rgba(224,247,255,0.4)', transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {langOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 py-1 z-50"
              style={{ background: 'rgba(2,4,8,.96)', border: `1px solid ${accent}30`, borderRadius: 8, boxShadow: `0 8px 30px rgba(0,0,0,0.8), 0 0 20px ${accent}08`, backdropFilter: 'blur(12px)' }}>
              {LANGS.map((language) => (
                <button key={language.code} onClick={() => changeLanguage(language)} className="flex items-center gap-3 w-full px-3 py-2.5 transition-all"
                  style={{ background: activeLang.code === language.code ? `${accent}10` : 'transparent', borderLeft: activeLang.code === language.code ? `2px solid ${accent}` : '2px solid transparent' }}>
                  <span style={{ fontSize: 18 }}>{language.flag}</span>
                  <div className="text-left"><p style={{ fontSize: 12, color: activeLang.code === language.code ? accent : 'rgba(224,247,255,0.8)' }}>{language.label}</p><p style={{ fontSize: 10, color: 'rgba(224,247,255,0.35)' }}>{language.code.toUpperCase()}</p></div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="relative w-9 h-9 flex items-center justify-center rounded transition-colors" style={{ color: 'rgba(224,247,255,0.5)', border: `1px solid ${accent}10` }}>
          <Bell size={19} strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: accent, boxShadow: `0 0 6px ${accent}` }} />
        </button>

        <div className="relative">
          <button onClick={() => { setProfileOpen(!profileOpen); setLangOpen(false); }} className="flex items-center gap-2 px-3 py-1.5 rounded transition-all"
            style={{ border: `1px solid ${profileOpen ? accent + '50' : accent + '15'}`, background: profileOpen ? `${accent}0d` : 'transparent' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: `linear-gradient(135deg,${accent},${accent}80)`, color: '#020408' }}>{initials || 'US'}</div>
            <span className="text-sm font-medium" style={{ color: 'rgba(224,247,255,0.8)' }}>{displayRole}</span>
            <ChevronDown size={14} style={{ color: 'rgba(224,247,255,0.4)', transform: profileOpen ? 'rotate(180deg)' : 'none' }} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 py-1 z-50" style={{ background: 'rgba(2,4,8,.96)', border: `1px solid ${accent}30`, borderRadius: 6, boxShadow: `0 8px 24px rgba(0,0,0,0.8)` }}>
              <button onClick={() => { setProfileOpen(false); navigate('/profile'); }} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm" style={{ color: 'rgba(224,247,255,0.7)' }}><User size={15} />Profilim</button>
              <button onClick={() => { setProfileOpen(false); navigate('/profile'); }} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm" style={{ color: 'rgba(224,247,255,0.7)' }}><Settings size={15} />Ayarlar</button>
              <div style={{ borderTop: `1px solid ${accent}15`, margin: '4px 0' }} />
              <button onClick={() => void logout()} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm" style={{ color: '#ff6b6b' }}><LogOut size={15} />Çıkış Yap</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
