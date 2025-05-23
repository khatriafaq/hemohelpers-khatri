
import { useState, useEffect } from "react";
import { User } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        console.log("Fetching users from profiles table. Current user is admin:", isAdmin);
        
        if (!isAdmin) {
          console.warn("Non-admin user attempting to access user management");
          toast({
            title: "Access Restricted",
            description: "You need admin privileges to access all user data.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        // Fetch all users from Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching users:", error);
          toast({
            title: "Error",
            description: "Failed to load users. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Make sure we have data and it's an array
        if (!data || !Array.isArray(data)) {
          console.error("No data returned from profiles table or data is not an array", data);
          setLoading(false);
          return;
        }

        console.log(`Successfully fetched ${data.length} users from profiles table`);
        console.log("Raw user data sample:", data.slice(0, 3)); // Log sample of raw data

        // Transform the data to match our User interface
        const formattedUsers = data.map(profile => {
          // Log the raw values for debugging
          console.log(`User ${profile.id} raw values:`, {
            id: profile.id,
            email: profile.email,
            is_verified: profile.is_verified,
            is_available: profile.is_available,
            created_at: profile.created_at
          });
          
          // CORRECTED LOGIC FOR STATUS DETERMINATION:
          let status: "verified" | "pending" | "rejected" | "banned";
          
          // If is_verified is explicitly true, user is verified
          if (profile.is_verified === true) {
            status = "verified";
          } 
          // If is_verified is false and is_available is false, user is banned
          else if (profile.is_verified === false && profile.is_available === false) {
            status = "banned";
          }
          // If is_verified is explicitly set to false, user is pending
          else if (profile.is_verified === false) {
            status = "pending";
          }
          // Fallback for any other case - mark as pending
          else {
            status = "pending";
            console.log(`User ${profile.id} has unusual is_verified value: ${profile.is_verified}, defaulting to pending`);
          }
          
          return {
            id: profile.id || "unknown-id",
            name: profile.full_name || profile.email?.split('@')[0] || "Anonymous User",
            email: profile.email || "unknown@email.com",
            bloodType: profile.blood_type || "Unknown",
            location: profile.location || "Unknown",
            status: status,
            isActive: profile.is_available !== false, // Default to true if undefined
            registeredDate: profile.created_at 
              ? new Date(profile.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })
              : "Unknown",
            documents: [], // In a real implementation, you would fetch documents from storage
            phone: profile.phone || undefined,
            age: profile.age || undefined
          };
        });

        console.log("Formatted users for display:", formattedUsers);
        console.log("Pending users:", formattedUsers.filter(u => u.status === "pending").length);
        console.log("Verified users:", formattedUsers.filter(u => u.status === "verified").length);
        console.log("Rejected users:", formattedUsers.filter(u => u.status === "rejected").length);
        console.log("Banned users:", formattedUsers.filter(u => u.status === "banned").length);
        
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Exception fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast, isAdmin]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.bloodType && user.bloodType.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.location && user.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return {
    users,
    setUsers,
    loading,
    searchQuery,
    setSearchQuery,
    filteredUsers
  };
};
