import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import UserTable from "./user/UserTable";
import UserDetailsDialog from "./user/UserDetailsDialog";
import { User } from "@/types/admin";
import { mockUsers } from "@/utils/mockData";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
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

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowDialog(true);
  };

  const handleVerifyUser = (userId: string) => {
    setUsers(
      users.map(user =>
        user.id === userId ? { ...user, status: "verified" } : user
      )
    );
    toast({
      title: "User verified",
      description: "User profile has been verified successfully.",
    });
    setShowDialog(false);
  };

  const handleRejectUser = (userId: string) => {
    setUsers(
      users.map(user =>
        user.id === userId ? { ...user, status: "rejected" } : user
      )
    );
    toast({
      title: "User rejected",
      description: "User profile has been rejected.",
    });
    setShowDialog(false);
  };

  const handleBanUser = (userId: string) => {
    setUsers(
      users.map(user =>
        user.id === userId ? { ...user, status: "banned" } : user
      )
    );
    toast({
      title: "User banned",
      description: "User has been banned from the platform.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Verify, reject, or ban users from the platform.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-[200px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="verified">Verified</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <UserTable 
                  users={filteredUsers}
                  onViewUser={handleViewUser}
                  onVerifyUser={handleVerifyUser}
                  onRejectUser={handleRejectUser}
                  onBanUser={handleBanUser}
                />
              </TabsContent>
              
              <TabsContent value="pending" className="mt-0">
                <UserTable 
                  users={filteredUsers}
                  onViewUser={handleViewUser}
                  onVerifyUser={handleVerifyUser}
                  onRejectUser={handleRejectUser}
                  onBanUser={handleBanUser}
                  filter="pending"
                />
              </TabsContent>
              
              <TabsContent value="verified" className="mt-0">
                <UserTable 
                  users={filteredUsers}
                  onViewUser={handleViewUser}
                  onVerifyUser={handleVerifyUser}
                  onRejectUser={handleRejectUser}
                  onBanUser={handleBanUser}
                  filter="verified"
                />
              </TabsContent>
              
              <TabsContent value="rejected" className="mt-0">
                <UserTable 
                  users={filteredUsers}
                  onViewUser={handleViewUser}
                  onVerifyUser={handleVerifyUser}
                  onRejectUser={handleRejectUser}
                  onBanUser={handleBanUser}
                  filter="rejected"
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <UserDetailsDialog 
          user={selectedUser} 
          onVerify={(userId) => {
            setUsers(
              users.map(user =>
                user.id === userId ? { ...user, status: "verified" } : user
              )
            );
            toast({
              title: "User verified",
              description: "User profile has been verified successfully.",
            });
            setShowDialog(false);
          }}
          onReject={(userId) => {
            setUsers(
              users.map(user =>
                user.id === userId ? { ...user, status: "rejected" } : user
              )
            );
            toast({
              title: "User rejected",
              description: "User profile has been rejected.",
            });
            setShowDialog(false);
          }}
        />
      </Dialog>
    </div>
  );
};

export default UserManagement;
