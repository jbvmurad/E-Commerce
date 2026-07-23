import { useEffect, useMemo, useState } from 'react';
import { Loader2, Plus, ShieldCheck, Trash2, UserPlus, UserRoundMinus } from 'lucide-react';
import { ToastContainer, useToast } from '../../../components/dashboard/DashToast';
import { adminService } from '../../../services/adminService';
import { ApiError } from '../../../services/apiClient';
import { RoleResponse, UserResponse, UserRoleResponse } from '../../../types/api';

const CYAN = '#00f5ff';
const cardStyle = { background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.15)', borderRadius: 8 };
const headStyle: React.CSSProperties = { color: CYAN, fontFamily: 'Playfair Display, serif', letterSpacing: '0.04em', textShadow: `0 0 12px ${CYAN}50` };

export function AdminAuthorization() {
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [assignments, setAssignments] = useState<UserRoleResponse[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newRoleName, setNewRoleName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toasts, show, remove } = useToast();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [roleData, userData, assignmentData] = await Promise.all([
        adminService.getRoles(),
        adminService.getUsers(),
        adminService.getUserRoles(),
      ]);
      setRoles(roleData);
      setUsers(userData);
      setAssignments(assignmentData);
      setSelectedRoleId((current) => current || roleData[0]?.id || '');
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Yetkilendirme bilgileri alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const selectedRole = roles.find((role) => role.id === selectedRoleId);
  const selectedAssignments = useMemo(
    () => assignments.filter((assignment) => assignment.roleId === selectedRoleId),
    [assignments, selectedRoleId],
  );
  const assignedUserIds = new Set(selectedAssignments.map((assignment) => assignment.userId));
  const availableUsers = users.filter((user) => !assignedUserIds.has(user.id));

  const createRole = async () => {
    const name = newRoleName.trim();
    if (!name) return;
    try {
      const response = await adminService.createRole(name);
      show(response.message, 'success');
      setNewRoleName('');
      await load();
    } catch (requestError) {
      show(requestError instanceof ApiError ? requestError.message : 'Rol oluşturulamadı.', 'error');
    }
  };

  const deleteRole = async () => {
    if (!selectedRole || !window.confirm(`${selectedRole.name ?? 'Rol'} silinsin mi?`)) return;
    try {
      const response = await adminService.deleteRole(selectedRole.id);
      show(response.message, 'success');
      setSelectedRoleId('');
      await load();
    } catch (requestError) {
      show(requestError instanceof ApiError ? requestError.message : 'Rol silinemedi.', 'error');
    }
  };

  const assignRole = async () => {
    if (!selectedRoleId || !selectedUserId) return;
    try {
      const response = await adminService.assignRole(selectedUserId, selectedRoleId);
      show(response.message, 'success');
      setSelectedUserId('');
      await load();
    } catch (requestError) {
      show(requestError instanceof ApiError ? requestError.message : 'Rol atanamadı.', 'error');
    }
  };

  const removeAssignment = async (assignment: UserRoleResponse) => {
    if (!window.confirm(`${assignment.userFullName} kullanıcısından ${assignment.roleName ?? 'rol'} kaldırılsın mı?`)) return;
    try {
      const response = await adminService.removeRoles(assignment.userId, [assignment.roleId]);
      show(response.message, 'success');
      await load();
    } catch (requestError) {
      show(requestError instanceof ApiError ? requestError.message : 'Rol kaldırılamadı.', 'error');
    }
  };

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }} className="space-y-5">
      <div>
        <h1 style={{ ...headStyle, fontSize: 22 }}>YETKİLENDİRME</h1>
        <p style={{ color: 'rgba(224,247,255,0.4)', fontSize: 12 }} className="mt-0.5">Security API rol ve kullanıcı-rol yönetimi</p>
      </div>

      {error && <p className="text-sm text-red-400 border border-red-500/25 bg-red-500/5 p-3">{error}</p>}

      <div className="flex flex-col xl:flex-row gap-5 items-start">
        <div className="w-full xl:w-64 shrink-0 rounded overflow-hidden" style={cardStyle}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(0,245,255,0.08)' }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(224,247,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Roller</p>
          </div>

          {loading ? (
            <div className="py-10 text-center"><Loader2 className="inline animate-spin text-[#00f5ff]" size={22} /></div>
          ) : roles.map((role) => {
            const selected = selectedRoleId === role.id;
            const count = assignments.filter((assignment) => assignment.roleId === role.id).length;
            return (
              <button key={role.id} onClick={() => setSelectedRoleId(role.id)} className="flex items-center justify-between w-full px-4 py-3 text-sm transition-all"
                style={selected ? { borderLeft: `2px solid ${CYAN}`, paddingLeft: 14, background: 'rgba(0,245,255,.08)', color: CYAN } : { borderLeft: '2px solid transparent', paddingLeft: 14, color: 'rgba(224,247,255,0.5)' }}>
                <div className="flex items-center gap-2.5"><ShieldCheck size={15} style={{ color: selected ? CYAN : 'rgba(224,247,255,0.3)' }} />{role.name ?? 'Unnamed role'}</div>
                <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: 'rgba(0,245,255,.08)', color: CYAN, border: '1px solid rgba(0,245,255,.2)' }}>{count}</span>
              </button>
            );
          })}

          <div className="p-3 space-y-2" style={{ borderTop: '1px solid rgba(0,245,255,0.08)' }}>
            <input value={newRoleName} onChange={(event) => setNewRoleName(event.target.value)} placeholder="Yeni rol adı"
              className="w-full px-3 py-2 text-sm outline-none" style={{ background: 'rgba(2,4,8,.8)', border: '1px solid rgba(0,245,255,.18)', color: 'rgba(224,247,255,.85)' }} />
            <button type="button" onClick={() => void createRole()} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm"
              style={{ background: 'rgba(0,245,255,.1)', border: '1px solid rgba(0,245,255,.3)', color: CYAN }}><Plus size={14} />Rol Oluştur</button>
          </div>
        </div>

        <div className="flex-1 w-full rounded" style={cardStyle}>
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(0,245,255,0.08)' }}>
            <div>
              <p style={{ ...headStyle, fontSize: 14 }}>{selectedRole?.name ?? 'Rol seçin'}</p>
              <p style={{ color: 'rgba(224,247,255,0.4)', fontSize: 11 }} className="mt-0.5">{selectedAssignments.length} kullanıcıya atanmış</p>
            </div>
            {selectedRole && (
              <button type="button" onClick={() => void deleteRole()} className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 border border-red-500/25 bg-red-500/5"><Trash2 size={14} />Rolü Sil</button>
            )}
          </div>

          <div className="p-5">
            <div className="flex flex-col md:flex-row gap-3 mb-5 p-4" style={{ background: 'rgba(0,245,255,.025)', border: '1px solid rgba(0,245,255,.1)' }}>
              <select value={selectedUserId} onChange={(event) => setSelectedUserId(event.target.value)} className="flex-1 px-3 py-2 text-sm outline-none"
                style={{ background: '#020408', border: '1px solid rgba(0,245,255,.18)', color: 'rgba(224,247,255,.8)' }} disabled={!selectedRoleId}>
                <option value="">Rol atanacak kullanıcıyı seç</option>
                {availableUsers.map((user) => <option key={user.id} value={user.id}>{user.fullName} — {user.email ?? 'e-posta yok'}</option>)}
              </select>
              <button type="button" onClick={() => void assignRole()} disabled={!selectedRoleId || !selectedUserId} className="flex items-center justify-center gap-2 px-4 py-2 text-sm disabled:opacity-40"
                style={{ background: 'rgba(0,245,255,.12)', border: '1px solid rgba(0,245,255,.35)', color: CYAN }}><UserPlus size={15} />Rol Ata</button>
            </div>

            {selectedAssignments.length === 0 ? (
              <p className="py-10 text-center text-sm" style={{ color: 'rgba(224,247,255,.4)' }}>Bu rol henüz hiçbir kullanıcıya atanmamış.</p>
            ) : (
              <div className="space-y-2">
                {selectedAssignments.map((assignment) => (
                  <div key={`${assignment.userId}-${assignment.roleId}`} className="flex items-center justify-between gap-4 px-4 py-3"
                    style={{ border: '1px solid rgba(0,245,255,.1)', background: 'rgba(0,245,255,.025)' }}>
                    <div><p className="text-sm" style={{ color: 'rgba(224,247,255,.85)' }}>{assignment.userFullName}</p><p className="text-xs mt-0.5" style={{ color: 'rgba(224,247,255,.4)' }}>{assignment.userEmail ?? 'E-posta yok'}</p></div>
                    <button type="button" onClick={() => void removeAssignment(assignment)} className="flex items-center gap-2 px-3 py-2 text-xs text-red-400 border border-red-500/20"><UserRoundMinus size={14} />Kaldır</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}
