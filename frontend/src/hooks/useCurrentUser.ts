import { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:5000/api/v1';

export interface CurrentUser {
    id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    isActive: boolean;
}

export function useCurrentUser() {
    const [user, setUser] = useState<CurrentUser | null>(() => {
        // Hydrate from localStorage instantly (no flicker)
        try {
            const cached = localStorage.getItem('buildora_user');
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(!user);
    const [error, setError] = useState<string | null>(null);

    // Fetch fresh user data from backend
    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/users/me`, {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) {
                if (res.status === 401) {
                    localStorage.removeItem('buildora_user');
                    setUser(null);
                    return;
                }
                throw new Error('Failed to fetch user');
            }
            const data = await res.json();
            const u = data.user as CurrentUser;
            setUser(u);
            localStorage.setItem('buildora_user', JSON.stringify(u));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // Update user name via PATCH /users/me
    const updateName = useCallback(async (name: string) => {
        if (!name.trim()) return;
        try {
            const res = await fetch(`${API_BASE}/users/me`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim() }),
            });
            if (!res.ok) throw new Error('Failed to update name');
            const data = await res.json();
            const updated = data.user as CurrentUser;
            setUser(updated);
            localStorage.setItem('buildora_user', JSON.stringify(updated));
            return true;
        } catch (err: any) {
            setError(err.message);
            return false;
        }
    }, []);

    // Get initials for avatar
    const initials = user?.name
        ? user.name
            .split(' ')
            .map((w) => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : '?';

    return { user, loading, error, refetch: fetchUser, updateName, initials };
}
