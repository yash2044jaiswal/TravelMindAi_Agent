import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from './Loader';

const ProtectedRoute = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen bg-space-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;