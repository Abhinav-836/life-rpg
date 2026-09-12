import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

// Keeps a logged-in user out of Login/Signup — sends them straight to the app.
export default function PublicRoute() {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing) return null;
  if (isAuthenticated) return <Navigate to="/app" replace />;
  return <Outlet />;
}
