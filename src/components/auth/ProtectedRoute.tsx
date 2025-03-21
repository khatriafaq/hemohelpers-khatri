
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false 
}: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin()) {
    // Redirect to unauthorized page if not an admin
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
