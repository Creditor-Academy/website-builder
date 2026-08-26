import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthSession } from '@/components/auth/AuthSessionProvider';

export function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuthSession();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#fcf8fa]">
        <Loader2 className="h-8 w-8 animate-spin text-[#131b2e]" aria-label="Checking session" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
