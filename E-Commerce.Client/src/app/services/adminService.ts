import {
  MessageResponse,
  RoleResponse,
  UserResponse,
  UserRoleResponse,
} from '../types/api';
import { apiRequest } from './apiClient';

export const adminService = {
  getUsers() {
    return apiRequest<UserResponse[]>('/api/security/auth?$orderby=FullName');
  },

  deleteUser(id: string) {
    return apiRequest<MessageResponse>(`/api/security/auth?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  getRoles() {
    return apiRequest<RoleResponse[]>('/api/security/role?$orderby=Name');
  },

  createRole(name: string) {
    return apiRequest<MessageResponse>('/api/security/role', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  deleteRole(id: string) {
    return apiRequest<MessageResponse>(`/api/security/role?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  getUserRoles() {
    return apiRequest<UserRoleResponse[]>('/api/security/userrole');
  },

  assignRole(userId: string, roleId: string) {
    return apiRequest<MessageResponse>('/api/security/userrole', {
      method: 'POST',
      body: JSON.stringify({ userId, roleId }),
    });
  },

  removeRoles(userId: string, roleIds: string[]) {
    return apiRequest<MessageResponse>(`/api/security/userrole/${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      body: JSON.stringify({ roleIds }),
    });
  },
};
