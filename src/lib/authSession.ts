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

function switchBuilderWorkspace(userId: string | null) {
  return import('@/store/useBuilderStore').then((mod) =>
    userId ? mod.bindBuilderWorkspace(userId) : mod.resetBuilderWorkspace()
  );
}

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
  const previousId = getStoredUser()?.id ?? null;
  localStorage.setItem('user', JSON.stringify(user));
  invalidateSessionCache();
  if (previousId !== user.id) {
    return switchBuilderWorkspace(user.id);
  }
}

export function clearStoredUser() {
  localStorage.removeItem('user');
  clearCsrfToken();
  invalidateSessionCache();
  void switchBuilderWorkspace(null);
}

export function invalidateSessionCache() {
  cachedValidation = null;
}

export function getDashboardPath(_user?: AuthUser | null): string {
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
        const previousId = getStoredUser()?.id ?? null;
        localStorage.setItem('user', JSON.stringify(payload));
        if (previousId !== payload.id) {
          void switchBuilderWorkspace(payload.id);
        }
        return { valid: true, user: payload as AuthUser };
      }
    } catch {
      clearStoredUser();
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
