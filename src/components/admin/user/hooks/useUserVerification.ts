
import { User } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

interface UseUserVerificationProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const useUserVerification = ({ users, setUsers }: UseUserVerificationProps) => {
  const { toast } = useToast();
  const { session } = useAuth();
  
  const checkAuthAndAdminStatus = async () => {
    if (!session) {
      console.error("No authenticated session found");
      toast({
        title: "Authentication Error",
        description: "You need to be logged in to perform this action.",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if the current user is an admin
    const { data: currentUserProfile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();
      
    if (profileError) {
      console.error("Error fetching current user profile:", profileError);
      return false;
    } 
    
    console.log("Current user admin status:", currentUserProfile?.is_admin);
    if (!currentUserProfile?.is_admin) {
      console.error("Current user is not an admin");
      toast({
        title: "Permission Error",
        description: "You need to be an admin to perform this action.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      console.log(`Verifying user with ID: ${userId}`);
      
      // Check auth and admin status
      const isAuthorized = await checkAuthAndAdminStatus();
      if (!isAuthorized) return;
      
      // Log the current user state
      console.log("Current users state:", users);
      const currentUser = users.find(u => u.id === userId);
      console.log("Current user to verify:", currentUser);
      
      // First, check if the user exists and get their current state
      const { data: existingUser, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (fetchError) {
        console.error("Error fetching user:", fetchError);
        toast({
          title: "Error",
          description: "Failed to fetch user data. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Existing user data:", existingUser);
      
      // Update the user's verification status in the database
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', userId)
        .select();

      if (error) {
        console.error("Error verifying user:", error);
        
        // If the update fails, try an upsert approach
        console.log("Trying upsert approach...");
        const { data: upsertData, error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            is_verified: true,
            // Include other fields to ensure they're not overwritten
            email: existingUser.email,
            full_name: existingUser.full_name,
            blood_type: existingUser.blood_type,
            location: existingUser.location,
            is_available: existingUser.is_available,
            is_admin: existingUser.is_admin
          })
          .select();

        if (upsertError) {
          console.error("Error verifying user with upsert:", upsertError);
          toast({
            title: "Error",
            description: `Failed to verify user: ${upsertError.message}`,
            variant: "destructive",
          });
          return;
        }

        console.log("User verification response (upsert):", upsertData);
      } else {
        console.log("User verification response (update):", data);
      }
      
      // Verify the update was successful by fetching the user again
      const { data: verifyData, error: verifyError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (verifyError) {
        console.error("Error verifying update:", verifyError);
      } else {
        console.log("Verified user data after update:", verifyData);
        console.log("is_verified value after update:", verifyData.is_verified);
      }
      
      // Update the local state directly with the correct status type
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, status: "verified" as const } : user
      );
      
      console.log("Updated users state:", updatedUsers);
      setUsers(updatedUsers);
      
      toast({
        title: "User verified",
        description: "User profile has been verified successfully.",
      });
    } catch (error) {
      console.error("Exception verifying user:", error);
      toast({
        title: "Error",
        description: "Failed to verify user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      console.log(`Rejecting user with ID: ${userId}`);
      
      // Check auth and admin status
      const isAuthorized = await checkAuthAndAdminStatus();
      if (!isAuthorized) return;
      
      // Log the current user state
      console.log("Current users state:", users);
      const currentUser = users.find(u => u.id === userId);
      console.log("Current user to reject:", currentUser);
      
      // First, check if the user exists and get their current state
      const { data: existingUser, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (fetchError) {
        console.error("Error fetching user:", fetchError);
        toast({
          title: "Error",
          description: "Failed to fetch user data. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Existing user data:", existingUser);
      
      // Update the user's verification status in the database
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_verified: false })
        .eq('id', userId)
        .select();

      if (error) {
        console.error("Error rejecting user:", error);
        toast({
          title: "Error",
          description: "Failed to reject user. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("User rejection response:", data);
      
      // Update the local state directly with the correct status type
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, status: "rejected" as const } : user
      );
      
      console.log("Updated users state:", updatedUsers);
      setUsers(updatedUsers);
      
      toast({
        title: "User rejected",
        description: "User profile has been rejected.",
      });
    } catch (error) {
      console.error("Exception rejecting user:", error);
      toast({
        title: "Error",
        description: "Failed to reject user. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleVerifyUser,
    handleRejectUser
  };
};
