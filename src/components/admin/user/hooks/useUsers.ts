
import { useState, useEffect } from "react";
import { User } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { mockUsers } from "@/utils/mockData";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would fetch from Supabase
        // For now, we'll use mock data but add a small delay to simulate fetching
        setTimeout(() => {
          setUsers(mockUsers);
          setLoading(false);
        }, 500);
        
        // Check for the specific user mentioned by the user
        const duplicateCheck = mockUsers.filter(user => 
          user.email.toLowerCase() === "khatriafaqahmed@hotmail.com"
        );
        
        if (duplicateCheck.length > 0) {
          console.log("Found user khatriafaqahmed@hotmail.com in mock data:", duplicateCheck);
        } else {
          console.log("User khatriafaqahmed@hotmail.com not found in mock data");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
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
