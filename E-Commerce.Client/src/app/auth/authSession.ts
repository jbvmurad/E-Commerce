import { useEffect, useState } from 'react';
import {
  AUTH_CHANGED_EVENT,
  AUTH_SESSION_STORAGE_KEY,
} from '../config/runtime';
import { LoginResponse } from '../types/api';

export interface AuthSession {
  userId: string;
  email: string | null;
  fullName: string | null;
  roles: string[];
  expiresAt: number | null;
}

type AuthSessionPatch = Partial<Pick<AuthSession, 'email' | 'fullName' | 'roles' | 'expiresAt'>>;

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return decodeURIComponent(
    Array.from(atob(padded))
      .map((character) => `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join(''),
  );
}

function stringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
  return typeof value === 'string' && value ? [value] : [];
}

export function createSession(response: LoginResponse): AuthSession {
  try {
    const payload = JSON.parse(decodeBase64Url(response.token.split('.')[1])) as Record<string, unknown>;
    const roleClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? payload.role;
    const emailClaim = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ?? payload.email;
    const userIdClaim = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? payload.sub;

    return {
      userId: typeof userIdClaim === 'string' ? userIdClaim : response.userId,
      email: typeof emailClaim === 'string' ? emailClaim : null,
      fullName: typeof payload.FullName === 'string' ? payload.FullName : null,
      roles: stringArray(roleClaim),
      expiresAt: typeof payload.exp === 'number' ? payload.exp * 1000 : null,
    };
  } catch {
    return {
      userId: response.userId,
      email: null,
      fullName: null,
      roles: [],
      expiresAt: null,
    };
  }
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;

  const value = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
  if (!value) return null;

  try {
    const session = JSON.parse(value) as Partial<AuthSession>;

    if (!session.userId || typeof session.userId !== 'string') {
      window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
      return null;
    }

    if (typeof session.expiresAt === 'number' && session.expiresAt <= Date.now()) {
      window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
      return null;
    }

    return {
      userId: session.userId,
      email: typeof session.email === 'string' ? session.email : null,
      fullName: typeof session.fullName === 'string' && session.fullName.trim()
        ? session.fullName.trim()
        : null,
      roles: stringArray(session.roles),
      expiresAt: typeof session.expiresAt === 'number' ? session.expiresAt : null,
    };
  } catch {
    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return null;
  }
}

export function saveAuthSession(response: LoginResponse): AuthSession {
  const session = createSession(response);
  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT, { detail: session }));
  return session;
}

export function updateAuthSession(patch: AuthSessionPatch): AuthSession | null {
  const current = getAuthSession();
  if (!current) return null;

  const session: AuthSession = {
    ...current,
    ...patch,
    fullName: patch.fullName === undefined
      ? current.fullName
      : typeof patch.fullName === 'string'
        ? patch.fullName.trim() || null
        : null,
  };

  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT, { detail: session }));
  return session;
}

export function clearAuthSession() {
  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT, { detail: null }));
}

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(() => getAuthSession());

  useEffect(() => {
    const refresh = () => setSession(getAuthSession());
    window.addEventListener(AUTH_CHANGED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return session;
}
