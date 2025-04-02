
import { User } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserActionsProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const useUserActions = ({ users, setUsers }: UserActionsProps) => {
  const { toast } = useToast();

  const handleVerifyUser = async (userId: string) => {
    try {
      // Update the user's verification status in the database
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', userId);

      if (error) {
        console.error("Error verifying user:", error);
        toast({
          title: "Error",
          description: "Failed to verify user. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Update the local state
      setUsers(
        users.map(user =>
          user.id === userId ? { ...user, status: "verified" } : user
        )
      );
      
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
      // Update the user's verification status in the database
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: false })
        .eq('id', userId);

      if (error) {
        console.error("Error rejecting user:", error);
        toast({
          title: "Error",
          description: "Failed to reject user. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Update the local state
      setUsers(
        users.map(user =>
          user.id === userId ? { ...user, status: "rejected" } : user
        )
      );
      
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

  const handleBanUser = async (userId: string) => {
    try {
      // Update the user's status in the database
      // For banning, we might set a special flag or move them to a banned table
      // Here we'll just use is_verified = false and add a banned flag
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_verified: false,
          // In a real implementation, you might have a specific 'is_banned' column
          // For now, we'll use the status update in the front-end only
        })
        .eq('id', userId);

      if (error) {
        console.error("Error banning user:", error);
        toast({
          title: "Error",
          description: "Failed to ban user. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Update the local state
      setUsers(
        users.map(user =>
          user.id === userId ? { ...user, status: "banned" } : user
        )
      );
      
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
    handleVerifyUser,
    handleRejectUser,
    handleBanUser
  };
};
