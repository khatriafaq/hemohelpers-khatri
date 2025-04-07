
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin, profile, refreshProfile } = useAuth();
  const [profileRefreshed, setProfileRefreshed] = useState(false);
  
  console.log("ProtectedRoute checks:", { 
    isLoading, 
    user: !!user, 
    isAdmin, 
    isVerified: profile?.is_verified,
    requireAdmin
  });

  // Attempt to refresh profile if user is logged in but no profile is available
  useEffect(() => {
    if (user && !profile && !isLoading && !profileRefreshed) {
      console.log("User exists but no profile found, attempting to refresh profile");
      refreshProfile();
      setProfileRefreshed(true);
    }
  }, [user, profile, isLoading, refreshProfile, profileRefreshed]);

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

  // Profile not approved yet - only redirect if we have actually loaded the profile
  if (profile && !profile.is_verified && !isAdmin) {
    console.log("Profile not verified, redirecting to pending approval");
    return <Navigate to="/auth/pending-approval" replace />;
  }

  // Admin page access without admin rights
  if (requireAdmin && !isAdmin) {
    console.log("Admin access required but user is not admin, redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  // Continue even if profile is null - the component will handle showing an error
  console.log("ProtectedRoute passed all checks, rendering Outlet");
  return <Outlet />;
};

export default ProtectedRoute;
