// AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

export default function AdminRoute() {
  const { user } = useAuth();
  if (!user?.is_admin) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
