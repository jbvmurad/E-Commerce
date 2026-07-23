import {
  AddressPayload,
  MessageResponse,
  ProfileResponse,
  UserAddressResponse,
} from '../types/api';
import { apiRequest } from './apiClient';

export const profileService = {
  getMe() {
    return apiRequest<ProfileResponse>('/api/profile/me');
  },

  updateProfile(payload: {
    fullName?: string;
    phoneNumber?: string;
    image?: File | null;
    removeImage?: boolean;
  }) {
    const formData = new FormData();
    if (payload.fullName !== undefined) formData.append('FullName', payload.fullName);
    if (payload.phoneNumber !== undefined) formData.append('PhoneNumber', payload.phoneNumber);
    if (payload.image) formData.append('Image', payload.image, payload.image.name);
    formData.append('RemoveImage', String(payload.removeImage ?? false));

    return apiRequest<MessageResponse>('/api/profile/me', {
      method: 'PUT',
      body: formData,
    });
  },

  getAddresses() {
    return apiRequest<UserAddressResponse[]>('/api/profile/addresses?$orderby=CreatedAt desc');
  },

  addAddress(payload: AddressPayload) {
    return apiRequest<MessageResponse>('/api/profile/addresses', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateAddress(id: string, payload: AddressPayload) {
    return apiRequest<MessageResponse>(`/api/profile/addresses/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ id, ...payload }),
    });
  },

  deleteAddress(id: string) {
    return apiRequest<MessageResponse>(`/api/profile/addresses/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};
