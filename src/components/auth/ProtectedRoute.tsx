import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthSession } from '@/components/auth/AuthSessionProvider';
import Loading from '@/components/Common/LoadingUI';

export function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuthSession();

  if (isLoading) {
    return <Loading fullScreen label="Checking session" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
