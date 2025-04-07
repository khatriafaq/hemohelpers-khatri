
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ProfileForm } from "@/components/profile";
import { useAuth } from "@/contexts/auth";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
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
    refreshProfile();
    toast({
      title: "Refreshing Profile",
      description: "Attempting to reload your profile data...",
    });
  };

  if (isLoading) {
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
            
            {profile ? (
              <ProfileForm />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    Unable to Load Profile
                  </CardTitle>
                  <CardDescription>
                    We're having trouble loading your profile data. This could be due to a temporary issue.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4">
                    <div className="flex flex-col items-center">
                      {retryCount < 3 ? (
                        <>
                          <p className="mb-4">Please try refreshing your profile data.</p>
                          <Button onClick={handleRefresh} variant="outline" className="flex items-center">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh Profile
                          </Button>
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
