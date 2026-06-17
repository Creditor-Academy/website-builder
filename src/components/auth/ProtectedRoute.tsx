import { Navigate, Outlet, useLocation } from 'react-router-dom';

function isAuthenticated(): boolean {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return false;
    const user = JSON.parse(raw);
    return !!(user && user.id);
  } catch {
    return false;
  }
}

export function ProtectedRoute() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
