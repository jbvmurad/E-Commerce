export interface GoogleRegistrationDraft {
  fullName: string;
  email: string;
}

const GOOGLE_REGISTRATION_STORAGE_KEY = 'e-commerce.google-registration';

export function saveGoogleRegistrationDraft(draft: GoogleRegistrationDraft) {
  window.sessionStorage.setItem(GOOGLE_REGISTRATION_STORAGE_KEY, JSON.stringify(draft));
}

export function getGoogleRegistrationDraft(): GoogleRegistrationDraft | null {
  const value = window.sessionStorage.getItem(GOOGLE_REGISTRATION_STORAGE_KEY);
  if (!value) return null;

  try {
    const draft = JSON.parse(value) as Partial<GoogleRegistrationDraft>;
    return typeof draft.fullName === 'string' && typeof draft.email === 'string'
      ? { fullName: draft.fullName, email: draft.email }
      : null;
  } catch {
    return null;
  }
}

export function clearGoogleRegistrationDraft() {
  window.sessionStorage.removeItem(GOOGLE_REGISTRATION_STORAGE_KEY);
}
