import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/admin";

export const renderStatusBadge = (status: string) => {
  switch (status) {
    case "verified":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>;
    case "pending":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    case "rejected":
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
    case "banned":
      return <Badge variant="destructive">Banned</Badge>;
    default:
      return <Badge variant="outline">{status || "Unknown"}</Badge>;
  }
};

export const renderActiveBadge = (isActive: boolean) => {
  return isActive 
    ? <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
    : <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
};

export const filterUsersByStatus = (users: User[], status: string | null) => {
  if (!users) return [];
  if (!status || status === "all") return users;
  
  // Log the filtering operation for debugging
  console.log(`Filtering users by status: ${status}`, {
    totalUsers: users.length,
    statusCounts: users.reduce((acc, user) => {
      acc[user.status] = (acc[user.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  });
  
  const filteredUsers = users.filter(user => user.status === status);
  
  // Log the filtering results
  console.log(`Filtered users count: ${filteredUsers.length}`);
  
  return filteredUsers;
};

export const filterUsersByActive = (users: User[], active: boolean | null) => {
  if (!users) return [];
  if (active === null) return users;
  return users.filter(user => user.isActive === active);
};

// New function to promote user to admin
export const promoteToAdmin = async (userId: string) => {
  const { toast } = useToast();
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', userId);
    
    if (error) {
      console.error("Error promoting user to admin:", error);
      toast({
        title: "Error",
        description: "Failed to promote user to admin. Please try again.",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: "User has been promoted to admin successfully.",
    });
    return true;
  } catch (error) {
    console.error("Exception promoting user to admin:", error);
    toast({
      title: "Error",
      description: "Failed to promote user to admin. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};
