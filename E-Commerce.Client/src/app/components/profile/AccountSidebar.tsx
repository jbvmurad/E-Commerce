import { ChevronRight, LayoutDashboard, LogOut, Package, Upload, User } from 'lucide-react';
import { Link } from 'react-router';
import type { ReactNode } from 'react';
import { useAuthSession } from '../../auth/authSession';

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

interface AccountLinkProps {
  to: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
}

function AccountLink({ to, label, icon, active = false }: AccountLinkProps) {
  return (
    <Link
      to={to}
      className={`account-command__item${active ? ' account-command__item--active' : ''}`}
      aria-current={active ? 'page' : undefined}
    >
      <span className="account-command__icon">{icon}</span>
      <span className="account-command__label">{label}</span>
      <ChevronRight className="account-command__arrow" size={16} aria-hidden="true" />
    </Link>
  );
}

export function AccountSidebar({
  activeSection,
  fullName,
  email,
  imageUrl,
  onImageChange,
  onLogout,
}: AccountSidebarProps) {
  const session = useAuthSession();
  const displayName = fullName.trim() || email?.split('@')[0] || 'User';
  const initials = getInitials(displayName);
  const normalizedRoles = session?.roles.map((role) => role.trim().toLowerCase()) ?? [];
  const dashboardPath = normalizedRoles.includes('admin')
    ? '/panel/admin'
    : normalizedRoles.includes('seller')
      ? '/panel/seller'
      : null;

  return (
    <aside className="account-sidebar lg:col-span-1 lg:self-start">
      <div className="account-command">
        <div className="account-command__edge" aria-hidden="true" />

        <div className="account-command__identity">
          <div className="account-command__avatar-wrap">
            <div className="account-command__avatar-ring" aria-hidden="true" />
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={displayName}
                className="account-command__avatar account-command__avatar--image"
              />
            ) : (
              <div className="account-command__avatar account-command__avatar--initials">
                {initials}
              </div>
            )}

            {onImageChange && (
              <label className="account-command__upload" aria-label="Upload profile image">
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

          <div className="account-command__identity-copy">
            <h3>{displayName}</h3>
            {email && <p>{email}</p>}
          </div>
        </div>

        <nav className="account-command__menu">
          {dashboardPath && (
            <AccountLink
              to={dashboardPath}
              label="Dashboard"
              icon={<LayoutDashboard size={18} />}
            />
          )}

          <AccountLink
            to="/orders"
            label="My Orders"
            icon={<Package size={18} />}
            active={activeSection === 'orders'}
          />

          <AccountLink
            to="/profile"
            label="Profile"
            icon={<User size={18} />}
            active={activeSection === 'profile'}
          />
        </nav>

        <button type="button" onClick={onLogout} className="account-command__logout">
          <span className="account-command__logout-icon"><LogOut size={18} /></span>
          <span>Logout</span>
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
