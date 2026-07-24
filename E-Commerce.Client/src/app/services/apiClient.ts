import { API_BASE_URL, getStoredLanguage } from '../config/runtime';
import { translateText } from '../i18n';

export interface ValidationErrorResponse {
  errors: Record<string, string[]>;
  statusCode: number;
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
}

export class ApiError extends Error {
  readonly status: number;
  readonly validationErrors: Record<string, string[]>;

  constructor(message: string, status: number, validationErrors: Record<string, string[]> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.validationErrors = validationErrors;
  }
}

function isValidationError(value: unknown): value is ValidationErrorResponse {
  if (!value || typeof value !== 'object') return false;
  return 'errors' in value && typeof (value as ValidationErrorResponse).errors === 'object';
}

function extractErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as ErrorResponse).message;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return fallback;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  headers.set('Accept-Language', getStoredLanguage());

  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      credentials: 'include',
    });
  } catch {
    throw new ApiError(
      translateText('API Gateway bağlantısı kurulamadı ({{url}}). Backend ve gateway durumunu kontrol et.', { url: API_BASE_URL }),
      0,
    );
  }

  const contentType = response.headers.get('content-type') ?? '';
  let payload: unknown = null;

  if (response.status !== 204) {
    if (contentType.includes('application/json')) {
      payload = await response.json().catch(() => null);
    } else {
      payload = await response.text().catch(() => null);
    }
  }

  if (!response.ok) {
    if (isValidationError(payload)) {
      const firstMessage = Object.values(payload.errors).flat()[0] ?? 'Gönderilen bilgiler geçersiz.';
      throw new ApiError(firstMessage, response.status, payload.errors);
    }

    const fallback = typeof payload === 'string' && payload.trim()
      ? payload
      : translateText('İstek başarısız oldu ({{status}}).', { status: response.status });

    throw new ApiError(extractErrorMessage(payload, fallback), response.status);
  }

  return payload as T;
}

export function firstValidationMessage(error: unknown, fieldName: string): string | undefined {
  if (!(error instanceof ApiError)) return undefined;

  const exact = error.validationErrors[fieldName];
  if (exact?.length) return exact[0];

  const key = Object.keys(error.validationErrors).find(
    (item) => item.toLocaleLowerCase() === fieldName.toLocaleLowerCase(),
  );

  return key ? error.validationErrors[key]?.[0] : undefined;
}
