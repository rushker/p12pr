// client/src/components/common/AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;