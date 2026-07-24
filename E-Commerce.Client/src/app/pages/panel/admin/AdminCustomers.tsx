import { useEffect, useMemo, useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { DashBadge } from '../../../components/dashboard/DashBadge';
import { DashSearchInput } from '../../../components/dashboard/DashSearchInput';
import { DashPagination } from '../../../components/dashboard/DashPagination';
import { ToastContainer, useToast } from '../../../components/dashboard/DashToast';
import { adminService } from '../../../services/adminService';
import { ApiError } from '../../../services/apiClient';
import { UserResponse } from '../../../types/api';
import { translateText } from '../../../i18n';

const CYAN = '#00f5ff';
const cardStyle = { background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.15)', borderRadius: 8 };
const headStyle: React.CSSProperties = { color: CYAN, fontFamily: 'Playfair Display, serif', letterSpacing: '0.04em', textShadow: `0 0 12px ${CYAN}50` };

export function AdminCustomers() {
  const [customers, setCustomers] = useState<UserResponse[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toasts, show, remove } = useToast();
  const itemsPerPage = 10;

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setCustomers(await adminService.getUsers());
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Kullanıcılar alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLocaleLowerCase('tr-TR');
    return customers.filter((customer) =>
      customer.fullName.toLocaleLowerCase('tr-TR').includes(query)
      || (customer.email ?? '').toLocaleLowerCase('tr-TR').includes(query),
    );
  }, [customers, search]);

  const paged = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const deleteCustomer = async (customer: UserResponse) => {
    if (!window.confirm(translateText('{{name}} kullanıcısı silinsin mi?', { name: customer.fullName }))) return;
    try {
      const response = await adminService.deleteUser(customer.id);
      show(response.message, 'success');
      await load();
    } catch (requestError) {
      show(requestError instanceof ApiError ? requestError.message : 'Kullanıcı silinemedi.', 'error');
    }
  };

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }} className="space-y-5">
      <div>
        <h1 style={{ ...headStyle, fontSize: 22 }}>MÜŞTERİLER</h1>
        <p style={{ color: 'rgba(224,247,255,0.4)', fontSize: 12 }} className="mt-0.5">Security API: {customers.length} kullanıcı</p>
      </div>

      {error && <p className="text-sm text-red-400 border border-red-500/25 bg-red-500/5 p-3">{error}</p>}

      <div style={cardStyle}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(0,245,255,0.06)' }}>
          <DashSearchInput placeholder="İsim veya e-posta ara..." value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} width="w-72" accent={CYAN} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,245,255,0.06)', background: 'rgba(0,245,255,0.02)' }}>
                {['Müşteri', 'E-posta', 'Kullanıcı Adı', 'Telefon', 'E-posta Durumu', ''].map((header) => (
                  <th key={header} className="px-5 py-3 text-left" style={{ fontSize: 10, fontWeight: 600, color: 'rgba(224,247,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center"><Loader2 className="animate-spin inline text-[#00f5ff]" size={24} /></td></tr>
              ) : paged.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-[rgba(224,247,255,.45)]">Kullanıcı bulunamadı.</td></tr>
              ) : paged.map((customer) => (
                <tr key={customer.id} style={{ borderBottom: '1px solid rgba(0,245,255,0.04)' }}
                  onMouseEnter={(event) => (event.currentTarget.style.background = 'rgba(0,245,255,0.03)')}
                  onMouseLeave={(event) => (event.currentTarget.style.background = 'transparent')}>
                  <td className="px-5 py-3.5 font-medium" style={{ color: 'rgba(224,247,255,0.85)' }}>{customer.fullName}</td>
                  <td className="px-5 py-3.5" style={{ color: 'rgba(224,247,255,0.5)' }}>{customer.email ?? '—'}</td>
                  <td className="px-5 py-3.5" style={{ color: 'rgba(224,247,255,0.55)' }}>{customer.userName ?? '—'}</td>
                  <td className="px-5 py-3.5" style={{ color: 'rgba(224,247,255,0.55)' }}>{customer.phoneNumber ?? '—'}</td>
                  <td className="px-5 py-3.5"><DashBadge variant={customer.emailConfirmed ? 'green' : 'yellow'}>{customer.emailConfirmed ? 'Doğrulandı' : 'Onay Bekliyor'}</DashBadge></td>
                  <td className="px-5 py-3.5 text-right">
                    <button type="button" onClick={() => void deleteCustomer(customer)} className="w-8 h-8 inline-flex items-center justify-center rounded"
                      style={{ color: '#ff6b6b', border: '1px solid rgba(255,107,107,0.2)' }} title="Kullanıcıyı sil">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(0,245,255,0.06)' }}>
          <DashPagination currentPage={page} totalItems={filtered.length} itemsPerPage={itemsPerPage} onPageChange={setPage} accent={CYAN} />
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}
