import { Navigate, Outlet } from 'react-router';
import { AdminSidebar } from './AdminSidebar';
import { DashHeader } from './DashHeader';
import { CyberBackground } from '../CyberBackground';
import { useAuthSession } from '../../auth/authSession';

export function AdminDashboardLayout() {
  const session = useAuthSession();
  const roles = session?.roles.map((role) => role.toLowerCase()) ?? [];

  if (!session) return <Navigate to="/login" replace />;
  if (!roles.includes('admin')) {
    return <Navigate to={roles.includes('seller') ? '/panel/seller' : '/'} replace />;
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: 'DM Sans, sans-serif', background: 'transparent' }}>
      <CyberBackground />
      <AdminSidebar />
      <DashHeader accent="#00f5ff" roleLabel="Admin" />
      <main className="ml-60 pt-[60px] min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
