
import { User } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

interface UseUserActivationProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const useUserActivation = ({ users, setUsers }: UseUserActivationProps) => {
  const { toast } = useToast();
  const { session } = useAuth();

  const handleActivateUser = async (userId: string) => {
    try {
      console.log(`Activating user with ID: ${userId}`);
      
      // Check if we have an authenticated session
      if (!session) {
        console.error("No authenticated session found");
        toast({
          title: "Authentication Error",
          description: "You need to be logged in to perform this action.",
          variant: "destructive",
        });
        return;
      }
      
      // Log the current user state
      console.log("Current users state:", users);
      const currentUser = users.find(u => u.id === userId);
      console.log("Current user to activate:", currentUser);
      
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
      
      // Activate the user by setting is_available to true and is_verified to true
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          is_available: true,
          is_verified: true
        })
        .eq('id', userId)
        .select();

      if (error) {
        console.error("Error activating user:", error);
        toast({
          title: "Error",
          description: "Failed to activate user. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("User activation response:", data);
      
      // Update the local state directly with the correct status type
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, status: "verified" as const, isActive: true } : user
      );
      
      console.log("Updated users state:", updatedUsers);
      setUsers(updatedUsers);
      
      toast({
        title: "User activated",
        description: "User has been activated and verified successfully.",
      });
    } catch (error) {
      console.error("Exception activating user:", error);
      toast({
        title: "Error",
        description: "Failed to activate user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    try {
      console.log(`Deactivating user with ID: ${userId}`);
      
      // Check if we have an authenticated session
      if (!session) {
        console.error("No authenticated session found");
        toast({
          title: "Authentication Error",
          description: "You need to be logged in to perform this action.",
          variant: "destructive",
        });
        return;
      }
      
      // Log the current user state
      console.log("Current users state:", users);
      const currentUser = users.find(u => u.id === userId);
      console.log("Current user to deactivate:", currentUser);
      
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
      
      // Deactivate the user by setting is_available to false
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_available: false })
        .eq('id', userId)
        .select();

      if (error) {
        console.error("Error deactivating user:", error);
        toast({
          title: "Error",
          description: "Failed to deactivate user. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("User deactivation response:", data);
      
      // Update the local state directly with the correct status type
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, isActive: false } : user
      );
      
      console.log("Updated users state:", updatedUsers);
      setUsers(updatedUsers);
      
      toast({
        title: "User deactivated",
        description: "User has been deactivated successfully.",
      });
    } catch (error) {
      console.error("Exception deactivating user:", error);
      toast({
        title: "Error",
        description: "Failed to deactivate user. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleActivateUser,
    handleDeactivateUser
  };
};
