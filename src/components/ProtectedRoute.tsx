
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin, profile } = useAuth();
  
  console.log("ProtectedRoute checks:", { 
    isLoading, 
    user: !!user, 
    isAdmin, 
    isVerified: profile?.is_verified,
    requireAdmin
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blood" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    console.log("No user found, redirecting to sign-in");
    return <Navigate to="/auth/sign-in" replace />;
  }

  // Profile not approved yet
  if (profile && !profile.is_verified && !isAdmin) {
    console.log("Profile not verified, redirecting to pending approval");
    return <Navigate to="/auth/pending-approval" replace />;
  }

  // Admin page access without admin rights
  if (requireAdmin && !isAdmin) {
    console.log("Admin access required but user is not admin, redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("ProtectedRoute passed all checks, rendering Outlet");
  return <Outlet />;
};

export default ProtectedRoute;
