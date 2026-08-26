import apiClient, { clearCsrfToken } from '@/api/client';

export type AuthUser = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
};

export type SessionValidationResult = {
  valid: boolean;
  user: AuthUser | null;
};

let cachedValidation: Promise<SessionValidationResult> | null = null;

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?.id ? user : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser) {
  localStorage.setItem('user', JSON.stringify(user));
  invalidateSessionCache();
}

export function clearStoredUser() {
  localStorage.removeItem('user');
  clearCsrfToken();
  invalidateSessionCache();
}

export function invalidateSessionCache() {
  cachedValidation = null;
}

export function getDashboardPath(user?: AuthUser | null): string {
  const resolved = user ?? getStoredUser();
  const role = resolved?.role;
  if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'INSTITUTION_ADMIN') {
    return '/admin';
  }
  return '/dashboard';
}

/** Validate the HTTP-only session cookie against the API (cached per page load). */
export async function validateSession(force = false): Promise<SessionValidationResult> {
  if (!force && cachedValidation) {
    return cachedValidation;
  }

  cachedValidation = (async () => {
    try {
      const res = await apiClient.get('/users/me');
      const payload = res.data?.user ?? res.data;
      if (payload?.id) {
        localStorage.setItem('user', JSON.stringify(payload));
        return { valid: true, user: payload as AuthUser };
      }
    } catch {
      localStorage.removeItem('user');
      clearCsrfToken();
    }
    return { valid: false, user: null };
  })();

  return cachedValidation;
}

export const SESSION_EXPIRED_KEY = 'authRedirectReason';
export const SESSION_EXPIRED_VALUE = 'session-expired';

export function markSessionExpired() {
  try {
    sessionStorage.setItem(SESSION_EXPIRED_KEY, SESSION_EXPIRED_VALUE);
  } catch {
    /* ignore */
  }
}

export function consumeSessionExpiredFlag(): boolean {
  try {
    const value = sessionStorage.getItem(SESSION_EXPIRED_KEY);
    if (value === SESSION_EXPIRED_VALUE) {
      sessionStorage.removeItem(SESSION_EXPIRED_KEY);
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}
