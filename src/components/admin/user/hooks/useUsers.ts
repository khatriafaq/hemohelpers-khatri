
import { useState, useEffect } from "react";
import { User } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        console.log("Fetching all users from profiles table...");
        
        // Fetch all users from Supabase without any filtering
        const { data, error } = await supabase
          .from('profiles')
          .select('*');

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

        console.log(`Fetched ${data?.length || 0} users from profiles table:`, data);

        // Transform the data to match our User interface
        const formattedUsers = data.map(profile => {
          // Determine status based on verification state or admin field
          let status: "verified" | "pending" | "rejected" | "banned" = "pending";
          if (profile.is_verified === true) {
            status = "verified";
          } else if (profile.is_verified === false) {
            status = "rejected";
          }

          return {
            id: profile.id,
            name: profile.full_name || "Anonymous User",
            email: profile.email || "",
            bloodType: profile.blood_type || "Unknown",
            location: profile.location || "Unknown",
            status: status,
            isActive: profile.is_available === true, // Add isActive status
            registeredDate: new Date(profile.created_at).toLocaleDateString('en-US', {
              year: 'numeric', 
              month: 'long', 
              day: 'numeric'
            }),
            documents: [], // In a real implementation, you would fetch documents from storage
            phone: profile.phone || undefined,
            age: profile.age || undefined
          };
        });

        console.log("Formatted users for display:", formattedUsers);
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
  }, [toast]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bloodType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.location.toLowerCase().includes(searchQuery.toLowerCase())
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
