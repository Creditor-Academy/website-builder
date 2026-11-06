/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateSession, getStoredUser, setStoredUser, clearStoredUser, invalidateSessionCache } from './authSession';
import apiClient from '@/api/client';

vi.mock('@/api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
  clearCsrfToken: vi.fn(),
}));

describe('authSession', () => {
  beforeEach(() => {
    localStorage.clear();
    invalidateSessionCache();
    vi.clearAllMocks();
  });

  it('skips network requests if no user is stored locally', async () => {
    const result = await validateSession();
    expect(result).toEqual({ valid: false, user: null });
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it('validates session against API when stored user exists', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 'u1', name: 'Test User' }));
    (apiClient.get as any).mockResolvedValueOnce({
      data: { user: { id: 'u1', name: 'Updated User' } },
    });

    const result = await validateSession();
    expect(result.valid).toBe(true);
    expect(result.user?.name).toBe('Updated User');
    expect(apiClient.get).toHaveBeenCalledWith('/users/me', { skipAuthRedirect: true });
  });

  it('handles 401 failure gracefully and clears stored user', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 'u1', name: 'Test User' }));
    (apiClient.get as any).mockRejectedValueOnce(new Error('Unauthorized'));

    const result = await validateSession();
    expect(result).toEqual({ valid: false, user: null });
    expect(getStoredUser()).toBeNull();
  });
});

