
import { User } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

interface UseUserBanningProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const useUserBanning = ({ users, setUsers }: UseUserBanningProps) => {
  const { toast } = useToast();
  const { session } = useAuth();

  const handleBanUser = async (userId: string) => {
    try {
      console.log(`Banning user with ID: ${userId}`);
      
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
      console.log("Current user to ban:", currentUser);
      
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
      
      // Update the user's status in the database
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          is_verified: false,
          is_available: false
        })
        .eq('id', userId)
        .select();

      if (error) {
        console.error("Error banning user:", error);
        toast({
          title: "Error",
          description: "Failed to ban user. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("User ban response:", data);
      
      // Update the local state directly with the correct status type
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, status: "banned" as const } : user
      );
      
      console.log("Updated users state:", updatedUsers);
      setUsers(updatedUsers);
      
      toast({
        title: "User banned",
        description: "User has been banned from the platform.",
      });
    } catch (error) {
      console.error("Exception banning user:", error);
      toast({
        title: "Error",
        description: "Failed to ban user. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleBanUser
  };
};
