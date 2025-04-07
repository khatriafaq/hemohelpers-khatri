
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Loader2, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin, profile, profileError, refreshProfile } = useAuth();
  const [profileRefreshed, setProfileRefreshed] = useState(false);
  
  console.log("ProtectedRoute checks:", { 
    isLoading, 
    user: !!user, 
    isAdmin, 
    isVerified: profile?.is_verified,
    requireAdmin,
    hasProfileError: !!profileError,
    profile // Log the complete profile for debugging
  });

  // Attempt to refresh profile if user is logged in but no profile is available
  useEffect(() => {
    if (user && !profile && !isLoading && !profileRefreshed && !profileError) {
      console.log("User exists but no profile found, attempting to refresh profile");
      refreshProfile();
      setProfileRefreshed(true);
    }
  }, [user, profile, isLoading, refreshProfile, profileRefreshed, profileError]);

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

  // Show profile error but allow access if we have user data
  if (profileError && !isLoading) {
    console.log("Profile error detected:", profileError.message);
    return (
      <div className="min-h-screen p-6">
        <Alert variant="destructive" className="max-w-3xl mx-auto mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Profile Error</AlertTitle>
          <AlertDescription>
            We encountered an error loading your profile data. Some features may be limited.
          </AlertDescription>
        </Alert>
        <Outlet />
      </div>
    );
  }

  // Profile not verified yet - only redirect if we have actually loaded the profile
  if (profile && profile.is_verified === false && !isAdmin) {
    console.log("Profile not verified, redirecting to pending approval");
    return <Navigate to="/auth/pending-approval" replace />;
  }

  // Admin page access without admin rights
  if (requireAdmin && !isAdmin) {
    console.log("Admin access required but user is not admin, redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  // Continue even if profile is not fully loaded - the component will handle showing appropriate UI
  console.log("ProtectedRoute passed all checks, rendering Outlet");
  return <Outlet />;
};

export default ProtectedRoute;
