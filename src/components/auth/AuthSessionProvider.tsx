import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  clearStoredUser,
  consumeSessionExpiredFlag,
  getDashboardPath,
  getStoredUser,
  invalidateSessionCache,
  validateSession,
  type AuthUser,
} from '@/lib/authSession';

type AuthSessionContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  validateSession: (force?: boolean) => Promise<boolean>;
  signOutLocal: () => void;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function useAuthSession() {
  const ctx = useContext(AuthSessionContext);
  if (!ctx) {
    throw new Error('useAuthSession must be used within AuthSessionProvider');
  }
  return ctx;
}

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpiredOpen, setSessionExpiredOpen] = useState(false);

  const runValidation = useCallback(async (force = false) => {
    setIsLoading(true);
    const result = await validateSession(force);
    setUser(result.user);
    setIsLoading(false);
    return result.valid;
  }, []);

  const signOutLocal = useCallback(() => {
    clearStoredUser();
    setUser(null);
    invalidateSessionCache();
  }, []);

  useEffect(() => {
    void runValidation();

    if (consumeSessionExpiredFlag()) {
      setSessionExpiredOpen(true);
    }

    const onSessionExpired = () => {
      signOutLocal();
      setSessionExpiredOpen(true);
      if (window.location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('auth:session-expired', onSessionExpired);
    return () => window.removeEventListener('auth:session-expired', onSessionExpired);
  }, [navigate, runValidation, signOutLocal]);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      user,
      isAuthenticated: !!user?.id,
      isLoading,
      validateSession: runValidation,
      signOutLocal,
    }),
    [user, isLoading, runValidation, signOutLocal]
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
      <AlertDialog open={sessionExpiredOpen} onOpenChange={setSessionExpiredOpen}>
        <AlertDialogContent className="rounded-2xl w-[calc(100vw-2rem)] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Session expired</AlertDialogTitle>
            <AlertDialogDescription>
              Your session is no longer valid. Please sign in again to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="bg-[#131b2e] hover:bg-[#252f4a] text-white rounded-lg"
              onClick={() => {
                setSessionExpiredOpen(false);
                navigate('/login', { replace: true });
              }}
            >
              Go to login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthSessionContext.Provider>
  );
}

export { getDashboardPath };
