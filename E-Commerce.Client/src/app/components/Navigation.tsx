import { ShoppingCart, User, Menu, X, ChevronDown, Package, Home } from 'lucide-react';
import { CyberLogo } from './CyberLogo';
import { Link, NavLink } from 'react-router';
import { useEffect, useState } from 'react';
import { getStoredLanguage, setStoredLanguage, SupportedLanguage } from '../config/runtime';
import { clearAuthSession, updateAuthSession, useAuthSession } from '../auth/authSession';
import { ApiError } from '../services/apiClient';
import { profileService } from '../services/profileService';
import { mockCart } from '../data/mockData';

const LANGS: { code: SupportedLanguage; flag: string; label: string }[] = [
  { code: 'tr', flag: '🇹🇷', label: 'TR' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'ru', flag: '🇷🇺', label: 'RU' },
  { code: 'az', flag: '🇦🇿', label: 'AZ' },
];

const navLinks = [
  { name: 'Home',     path: '/',         icon: Home,    end: true  },
  { name: 'Products', path: '/products', icon: Package, end: false },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [activeLang, setActiveLang] = useState(() => LANGS.find((lang) => lang.code === getStoredLanguage()) ?? LANGS[0]);
  const [verifiedFullName, setVerifiedFullName] = useState<string | null>(null);
  const session = useAuthSession();
  const cartItemCount = mockCart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    let cancelled = false;

    if (!session) {
      setVerifiedFullName(null);
      return () => {
        cancelled = true;
      };
    }

    setVerifiedFullName(null);

    profileService.getMe()
      .then((profile) => {
        if (cancelled) return;

        const fullName = profile.fullName.trim() || null;
        setVerifiedFullName(fullName);
        updateAuthSession({ fullName });
      })
      .catch((error) => {
        if (cancelled) return;

        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          clearAuthSession();
        }

        setVerifiedFullName(null);
      });

    return () => {
      cancelled = true;
    };
  }, [session?.userId]);

  const changeLanguage = (lang: typeof LANGS[number]) => {
    setActiveLang(lang);
    setStoredLanguage(lang.code);
    setLangOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl"
      style={{ background: 'rgba(2,4,8,0.85)', borderBottom: '1px solid rgba(0,245,255,0.12)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <CyberLogo size={34} accent="#00f5ff" />
            <span className="text-lg font-display" style={{ color: '#00f5ff', textShadow: '0 0 20px #00f5ff, 0 0 40px rgba(0,245,255,0.3)', letterSpacing: '0.12em' }}>
              E-COMMERCE
            </span>
          </Link>

          {/* Desktop Nav — creative tabs */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={`${link.name}-${link.path}`}
                to={link.path}
                end={link.end}
                className="relative group px-4 py-2 flex items-center gap-1.5"
                style={({ isActive }) => ({
                  color: isActive ? '#00f5ff' : 'rgba(224,247,255,0.5)',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'color 0.2s',
                })}
              >
                {({ isActive }) => (
                  <>
                    {/* Active underline bar */}
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300"
                      style={{
                        width: isActive ? '70%' : '0%',
                        background: 'linear-gradient(90deg,transparent,#00f5ff,transparent)',
                        boxShadow: isActive ? '0 0 8px #00f5ff' : 'none',
                      }}
                    />
                    {/* Hover glow bg */}
                    <span
                      className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: 'rgba(0,245,255,0.05)' }}
                    />
                    <link.icon
                      size={14}
                      style={{
                        color: isActive ? '#00f5ff' : 'rgba(224,247,255,0.35)',
                        filter: isActive ? 'drop-shadow(0 0 4px #00f5ff)' : 'none',
                        flexShrink: 0,
                        position: 'relative',
                      }}
                    />
                    <span style={{ position: 'relative', color: isActive ? '#00f5ff' : 'inherit' }}>
                      {link.name}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Lang selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 h-9 px-2.5 rounded transition-all"
                style={{
                  border: `1px solid ${langOpen ? 'rgba(0,245,255,0.4)' : 'rgba(0,245,255,0.15)'}`,
                  background: langOpen ? 'rgba(0,245,255,0.08)' : 'transparent',
                }}
              >
                <span style={{ fontSize: 15, lineHeight: 1 }}>{activeLang.flag}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(224,247,255,0.7)', letterSpacing: '0.05em', fontFamily: 'DM Sans, sans-serif' }}>
                  {activeLang.label}
                </span>
                <ChevronDown
                  size={11}
                  style={{ color: 'rgba(224,247,255,0.4)', transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                />
              </button>

              {langOpen && (
                <div
                  className="absolute right-0 top-full mt-1 py-1 z-50"
                  style={{
                    width: 140,
                    background: 'rgba(2,4,8,0.95)',
                    border: '1px solid rgba(0,245,255,0.25)',
                    borderRadius: 8,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.8), 0 0 20px rgba(0,245,255,0.06)',
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  {LANGS.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 transition-all"
                      style={{
                        background: activeLang.code === lang.code ? 'rgba(0,245,255,0.08)' : 'transparent',
                        borderLeft: activeLang.code === lang.code ? '2px solid #00f5ff' : '2px solid transparent',
                        fontFamily: 'DM Sans, sans-serif',
                      }}
                      onMouseEnter={(e) => {
                        if (activeLang.code !== lang.code)
                          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,245,255,0.05)';
                      }}
                      onMouseLeave={(e) => {
                        if (activeLang.code !== lang.code)
                          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                      }}
                    >
                      <span style={{ fontSize: 18, lineHeight: 1 }}>{lang.flag}</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: activeLang.code === lang.code ? '#00f5ff' : 'rgba(224,247,255,0.7)' }}>
                        {lang.code === 'tr' ? 'Türkçe' : lang.code === 'en' ? 'English' : lang.code === 'ru' ? 'Русский' : 'Azərbaycan'}
                      </span>
                      {activeLang.code === lang.code && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#00f5ff', boxShadow: '0 0 4px #00f5ff' }} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center justify-center w-9 h-9 rounded transition-all duration-200"
              style={{ border: '1px solid rgba(0,245,255,0.15)', color: 'rgba(224,247,255,0.7)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,245,255,0.4)';
                (e.currentTarget as HTMLAnchorElement).style.color = '#00f5ff';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 10px rgba(0,245,255,0.15)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,245,255,0.15)';
                (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(224,247,255,0.7)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
              }}
            >
              <ShoppingCart size={19} strokeWidth={1.75} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-white text-xs w-4.5 h-4.5 flex items-center justify-center rounded-full"
                  style={{ background: '#ff00ff', boxShadow: '0 0 8px #ff00ff', minWidth: 18, height: 18, fontSize: 10, fontWeight: 700, fontFamily: 'DM Sans, sans-serif' }}>
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User */}
            <Link
              to={session ? "/profile" : "/login"}
              className="hidden sm:flex items-center justify-center gap-2 h-9 rounded px-2.5 transition-all duration-200"
              style={{ border: '1px solid rgba(0,245,255,0.15)', color: 'rgba(224,247,255,0.7)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,245,255,0.4)';
                (e.currentTarget as HTMLAnchorElement).style.color = '#00f5ff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,245,255,0.15)';
                (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(224,247,255,0.7)';
              }}
            >
              <User size={19} strokeWidth={1.75} />
              {verifiedFullName && (
                <span className="max-w-[150px] truncate text-xs font-semibold tracking-wide">
                  {verifiedFullName}
                </span>
              )}
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded transition-all"
              style={{ border: '1px solid rgba(0,245,255,0.15)', color: 'rgba(224,247,255,0.7)' }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div style={{ borderTop: '1px solid rgba(0,245,255,0.1)', background: 'rgba(2,4,8,0.97)' }}>
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center gap-3 px-3 py-2.5 rounded transition-colors"
                style={{ color: 'rgba(224,247,255,0.65)', fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon size={16} style={{ color: 'rgba(0,245,255,0.6)' }} />
                {link.name}
              </Link>
            ))}
            <Link
              to={session ? "/profile" : "/login"}
              className="flex items-center gap-3 px-3 py-2.5 rounded transition-colors"
              style={{ color: 'rgba(224,247,255,0.65)', fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={16} style={{ color: 'rgba(0,245,255,0.6)' }} />
              {verifiedFullName ?? (session ? 'Profile' : 'Sign In')}
            </Link>
            <div className="pt-3 border-t" style={{ borderColor: 'rgba(0,245,255,0.08)' }}>
              <div className="flex gap-2 flex-wrap">
                {LANGS.map((lang) => (
                  <button key={lang.code}
                    onClick={() => { changeLanguage(lang); setMobileMenuOpen(false); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded"
                    style={{
                      background: activeLang.code === lang.code ? 'rgba(0,245,255,0.1)' : 'transparent',
                      border: `1px solid ${activeLang.code === lang.code ? 'rgba(0,245,255,0.35)' : 'rgba(0,245,255,0.1)'}`,
                      color: activeLang.code === lang.code ? '#00f5ff' : 'rgba(224,247,255,0.5)',
                      fontSize: 12, fontFamily: 'DM Sans, sans-serif',
                    }}>
                    {lang.flag} {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
