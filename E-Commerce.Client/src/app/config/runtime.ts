export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000')
  .replace(/\/+$/, '');

export const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '').trim();

export const LANGUAGE_STORAGE_KEY = 'e-commerce.language';
export const AUTH_SESSION_STORAGE_KEY = 'e-commerce.auth-session';
export const LANGUAGE_CHANGED_EVENT = 'e-commerce-language-changed';
export const AUTH_CHANGED_EVENT = 'e-commerce-auth-changed';

export type SupportedLanguage = 'tr' | 'en' | 'ru' | 'az';

export function getStoredLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'tr';

  const value = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return value === 'en' || value === 'ru' || value === 'az' || value === 'tr'
    ? value
    : 'tr';
}

export function setStoredLanguage(language: SupportedLanguage) {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGED_EVENT, { detail: language }));
}
