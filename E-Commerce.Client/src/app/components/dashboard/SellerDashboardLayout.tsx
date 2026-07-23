import { Navigate, Outlet } from 'react-router';
import { SellerSidebar } from './SellerSidebar';
import { DashHeader } from './DashHeader';
import { CyberBackground } from '../CyberBackground';
import { useAuthSession } from '../../auth/authSession';

export function SellerDashboardLayout() {
  const session = useAuthSession();
  const roles = session?.roles.map((role) => role.toLowerCase()) ?? [];

  if (!session) return <Navigate to="/login" replace />;
  if (!roles.includes('seller')) {
    return <Navigate to={roles.includes('admin') ? '/panel/admin' : '/'} replace />;
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: 'DM Sans, sans-serif', background: 'transparent' }}>
      <CyberBackground />
      <SellerSidebar />
      <DashHeader searchPlaceholder="Search orders, products..." accent="#00f5ff" roleLabel="Seller" />
      <main className="ml-60 pt-[60px] min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
