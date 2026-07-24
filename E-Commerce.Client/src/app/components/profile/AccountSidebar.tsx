import { LogOut, Package, Upload, User } from 'lucide-react';
import { Link } from 'react-router';

type AccountSection = 'orders' | 'profile';

interface AccountSidebarProps {
  activeSection: AccountSection;
  fullName: string;
  email?: string | null;
  imageUrl?: string | null;
  onImageChange?: (file: File | null) => void;
  onLogout: () => void;
}

function getInitials(fullName: string) {
  return fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'US';
}

const passiveLinkClass = 'flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-[rgba(0,245,255,0.1)] hover:text-[#00f5ff] border border-transparent hover:border-[rgba(0,245,255,0.3)] transition-all duration-300';
const activeLinkClass = 'flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#00f5ff] to-[#00b4c8] text-[#020408] border-l-4 border-[#00f5ff]';

export function AccountSidebar({
  activeSection,
  fullName,
  email,
  imageUrl,
  onImageChange,
  onLogout,
}: AccountSidebarProps) {
  const displayName = fullName.trim() || email?.split('@')[0] || 'User';
  const initials = getInitials(displayName);

  return (
    <aside className="account-sidebar lg:col-span-1 lg:self-start">
      <div className="account-sidebar__panel bg-[rgba(0,245,255,0.04)] p-6 border border-[rgba(0,245,255,0.15)] shadow-[var(--shadow-card)]">
        <div className="flex flex-col items-center mb-6 pb-6 border-b border-[var(--border)]">
          <div className="relative mb-3">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={displayName}
                className="w-20 h-20 rounded-full object-cover border border-[rgba(0,245,255,0.35)]"
              />
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold text-[#020408] bg-gradient-to-br from-[#00f5ff] to-[#0080aa]">
                {initials}
              </div>
            )}

            {onImageChange && (
              <label className="absolute bottom-0 right-0 p-1.5 bg-[#00f5ff] text-[#020408] rounded-full cursor-pointer hover:shadow-[0_0_15px_rgba(0,245,255,.7)] transition-shadow" aria-label="Upload profile image">
                <Upload size={14} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => onImageChange(event.target.files?.[0] ?? null)}
                />
              </label>
            )}
          </div>

          <h3 className="text-lg text-[#00f5ff] text-center break-words max-w-full">{displayName}</h3>
          {email && <p className="text-sm text-muted-foreground text-center break-all">{email}</p>}
        </div>

        <nav className="space-y-2">
          <Link to="/orders" className={activeSection === 'orders' ? activeLinkClass : passiveLinkClass}>
            <Package size={18} />
            My Orders
          </Link>
          <Link to="/profile" className={activeSection === 'profile' ? activeLinkClass : passiveLinkClass}>
            <User size={18} />
            Profile
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all duration-300 w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
}
