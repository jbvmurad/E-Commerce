import { clearAuthSession, saveAuthSession } from '../auth/authSession';
import { ExternalLoginResponse, LoginResponse, MessageResponse } from '../types/api';
import { ApiError, apiRequest } from './apiClient';

export const authService = {
  async login(email: string, password: string) {
    const response = await apiRequest<LoginResponse>('/api/security/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    saveAuthSession(response);
    return response;
  },

  async externalLogin(credential: string, flow: 'Login' | 'Register') {
    const response = await apiRequest<ExternalLoginResponse>('/api/security/auth/external-login', {
      method: 'POST',
      body: JSON.stringify({
        provider: 'Google',
        credential,
        redirectUri: window.location.origin,
        flow,
      }),
    });

    if (response.status === 'Authenticated') {
      if (!response.token || !response.refreshToken || !response.userId) {
        throw new ApiError('Google giriş cevabı eksik.', 500);
      }

      saveAuthSession({
        token: response.token,
        refreshToken: response.refreshToken,
        refreshTokenExpires: response.refreshTokenExpires,
        userId: response.userId,
      });
    }

    return response;
  },

  register(fullName: string, email: string, password: string, confirmPassword: string) {
    return apiRequest<MessageResponse>('/api/security/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password, confirmPassword }),
    });
  },

  forgotPassword(email: string) {
    return apiRequest<MessageResponse>('/api/security/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword(code: string, newPassword: string, confirmPassword: string) {
    return apiRequest<MessageResponse>('/api/security/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ code, newPassword, confirmPassword }),
    });
  },

  confirmEmail(code: string) {
    return apiRequest<MessageResponse>('/api/security/auth/confirm-email', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  resendConfirmation(email: string) {
    return apiRequest<MessageResponse>('/api/security/auth/resend-confirmation', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  confirmEmailChange(userId: string, code: string) {
    return apiRequest<MessageResponse>('/api/security/auth/confirm-email-change', {
      method: 'POST',
      body: JSON.stringify({ userId, code }),
    });
  },

  changeEmail(newEmail: string) {
    return apiRequest<MessageResponse>('/api/security/auth/change-email', {
      method: 'POST',
      body: JSON.stringify({ newEmail }),
    });
  },

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    const response = await apiRequest<MessageResponse>('/api/security/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });
    clearAuthSession();
    return response;
  },

  async logout() {
    try {
      return await apiRequest<MessageResponse>('/api/security/auth/logout', { method: 'POST' });
    } finally {
      clearAuthSession();
    }
  },
};
