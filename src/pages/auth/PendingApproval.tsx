
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PendingApproval = () => {
  const { signOut, refreshProfile, profile, user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<boolean | null>(null);
  const { toast } = useToast();
  
  console.log("PendingApproval rendered with profile:", profile);
  
  // Check verification status directly from the database on mount
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_verified')
        .eq('id', user.id)
        .maybeSingle();
        
      if (error) {
        console.error('Error checking verification status:', error);
        return;
      }
      
      if (data) {
        console.log('Retrieved verification status:', data.is_verified);
        setVerificationStatus(data.is_verified);
      }
    };
    
    checkVerificationStatus();
  }, [user]);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // First refresh verification status directly from the database
      if (user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_verified')
          .eq('id', user.id)
          .maybeSingle();
          
        if (!error && data) {
          setVerificationStatus(data.is_verified);
          
          // If verified, we should redirect
          if (data.is_verified) {
            toast({
              title: "Account Verified!",
              description: "Your account has been verified. Redirecting to the home page.",
              variant: "default",
            });
            
            // Redirect after a short delay
            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
            return;
          }
        }
      }
      
      // Then refresh the full profile
      refreshProfile();
      
      toast({
        title: "Status Refreshed",
        description: "Your account status has been refreshed.",
      });
    } catch (error) {
      console.error('Error refreshing status:', error);
      toast({
        title: "Refresh Failed",
        description: "There was an error refreshing your status. Please try again.",
        variant: "destructive"
      });
    } finally {
      // Give time for the profile to refresh before allowing another refresh
      setTimeout(() => {
        setIsRefreshing(false);
      }, 3000);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <Clock className="h-10 w-10 text-yellow-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Account Pending Approval</CardTitle>
          <CardDescription>
            Your account is currently awaiting approval from our administrators.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            We'll send you an email notification once your account has been approved. 
            This usually takes 24-48 hours.
          </p>
          <p className="text-muted-foreground">
            If you believe this is an error or have any questions, please contact our support team.
          </p>
          
          <div className="mt-6 p-4 bg-muted/40 rounded-lg">
            <h3 className="font-medium mb-2">Account Status</h3>
            <p className="text-sm text-muted-foreground">
              Verification Status: <span className="font-medium">
                {verificationStatus === true ? (
                  <span className="text-green-600">Verified</span>
                ) : (
                  <span className="text-amber-600">Pending</span>
                )}
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Active Status: <span className="font-medium">{profile?.is_available ? "Active" : "Inactive"}</span>
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 p-6">
          <Button asChild variant="outline">
            <Link to="/">Return Home</Link>
          </Button>
          <Button 
            variant="secondary"
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PendingApproval;
