
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ProfileForm } from "@/components/profile";
import { useAuth } from "@/contexts/auth";
import { Loader2, RefreshCw, AlertTriangle, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user, profile, isLoading, refreshProfile, profileError } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
  const [directProfileData, setDirectProfileData] = useState<any>(null);
  const [isDirectFetching, setIsDirectFetching] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    if (!isLoading && !user) {
      console.log("No user found, redirecting to sign-in");
      navigate('/auth/sign-in');
    }
  }, [user, isLoading, navigate]);

  // Direct profile fetch from Supabase (bypassing context)
  useEffect(() => {
    const fetchProfileDirectly = async () => {
      if (!user?.id || directProfileData) return;
      
      try {
        setIsDirectFetching(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching profile directly:", error);
        } else if (data) {
          console.log("Direct profile fetch successful:", data);
          setDirectProfileData(data);
          
          // If profile is verified but we're on pending page, redirect home
          if (data.is_verified && window.location.pathname.includes('pending-approval')) {
            toast({
              title: "Account Verified",
              description: "Your account is now verified. Redirecting to your profile."
            });
            navigate('/profile');
          }
        }
      } catch (e) {
        console.error("Exception fetching profile directly:", e);
      } finally {
        setIsDirectFetching(false);
      }
    };
    
    fetchProfileDirectly();
  }, [user, navigate, toast, directProfileData]);

  // Check if there are any auth errors on page load
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (error) {
      toast({
        title: "Authentication Error",
        description: errorDescription || "There was an error with authentication.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Handle refresh with retry limit
  const handleRefresh = () => {
    setRetryCount(prev => prev + 1);
    setDirectProfileData(null); // Clear direct data to force refresh
    refreshProfile();
    toast({
      title: "Refreshing Profile",
      description: "Attempting to reload your profile data...",
    });
  };

  if (isLoading || isDirectFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blood" />
        <p className="ml-2 text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Please sign in to view your profile.</p>
      </div>
    );
  }

  // Use direct profile data if available
  const displayProfile = directProfileData || profile;

  // Display user metadata if profile is not available
  const renderFallbackUserInfo = () => {
    const metadata = user.user_metadata || {};
    
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCircle className="h-6 w-6 mr-2 text-primary" />
            User Information from Auth
          </CardTitle>
          <CardDescription>
            We're having trouble loading your full profile data, but here's the information we have from your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Email</h3>
              <p>{user.email || "No email available"}</p>
            </div>
            
            {metadata.full_name && (
              <div>
                <h3 className="font-medium">Name</h3>
                <p>{metadata.full_name}</p>
              </div>
            )}
            
            {metadata.blood_type && (
              <div>
                <h3 className="font-medium">Blood Type</h3>
                <p>{metadata.blood_type}</p>
              </div>
            )}
            
            {metadata.location && (
              <div>
                <h3 className="font-medium">Location</h3>
                <p>{metadata.location}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <main className="min-h-screen bg-muted/20">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="page-container">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">Your Donor Profile</h1>
              <p className="text-muted-foreground">
                Complete your profile information to be discoverable by those in need of blood donations.
              </p>
            </div>
            
            {profileError && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Profile Error</AlertTitle>
                <AlertDescription>
                  There was an error loading your profile: {profileError.message}
                </AlertDescription>
              </Alert>
            )}
            
            {!displayProfile && !isLoading && renderFallbackUserInfo()}
            
            {displayProfile ? (
              <ProfileForm />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    Complete Your Profile
                  </CardTitle>
                  <CardDescription>
                    We're having trouble loading your complete profile data. This could be due to a temporary issue.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4">
                    <div className="flex flex-col items-center">
                      {retryCount < 3 ? (
                        <>
                          <p className="mb-4">Please try refreshing your profile data or complete your profile.</p>
                          <div className="space-x-4">
                            <Button onClick={handleRefresh} variant="outline" className="flex items-center">
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Refresh Profile
                            </Button>
                            <Button onClick={() => window.location.reload()}>
                              Reload Page
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="mb-4">We've tried several times to load your profile without success.</p>
                          <div className="space-y-2">
                            <Button onClick={() => navigate('/')} variant="outline">
                              Return to Home Page
                            </Button>
                            <Button onClick={() => window.location.reload()} className="ml-2">
                              Reload Page
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
