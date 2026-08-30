import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#17120f]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d4af37]/20 border-t-[#d4af37]" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'artisan') {
      return <Navigate to="/artisan/dashboard" replace />;
    } else {
      return <Navigate to="/marketplace" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;