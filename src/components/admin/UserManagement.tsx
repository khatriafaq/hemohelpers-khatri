import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { User } from "@/types/admin";
import { Loader2, AlertCircle, Shield, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

import UserDetailsDialog from "./user/dialogs/UserDetailsDialog";
import UserFilters from "./user/UserFilters";
import UserTabs from "./user/UserTabs";
import { useUsers } from "./user/hooks/useUsers";
import { useUserActions } from "./user/UserActions";
import { useAuth } from "@/contexts/auth";

const UserManagement = () => {
  const { isAdmin } = useAuth();
  const { users, setUsers, loading, searchQuery, setSearchQuery, filteredUsers } = useUsers();
  const { 
    handleVerifyUser, 
    handleRejectUser, 
    handleBanUser,
    handleActivateUser,
    handleDeactivateUser,
    testUpdateUser,
    checkRLSPolicies,
    directUpdateUser
  } = useUserActions({ users, setUsers });
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowDialog(true);
  };

  const handleDirectUpdate = () => {
    if (filteredUsers.length > 0) {
      const user = filteredUsers[0];
      directUpdateUser(user.id, user.email);
    } else {
      toast({
        title: "Error",
        description: "No users available to update.",
        variant: "destructive",
      });
    }
  };

  // Add debug info to help troubleshoot
  console.log("UserManagement rendered with", {
    isAdmin,
    totalUsers: users.length,
    filteredUsers: filteredUsers.length,
    loading
  });

  if (!isAdmin) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You need admin privileges to access the user management section.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Verify, reject, or ban users from the platform. Activate or deactivate user accounts.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <UserFilters 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkRLSPolicies}
                className="flex items-center"
              >
                <Shield className="h-4 w-4 mr-2" />
                Check RLS
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDirectUpdate}
                className="flex items-center"
                disabled={loading || filteredUsers.length === 0}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Direct Update
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-4 text-muted-foreground">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No users found</AlertTitle>
              <AlertDescription>
                No users were found in the database. This could be due to an authentication issue or empty database.
              </AlertDescription>
            </Alert>
          ) : (
            <UserTabs 
              loading={loading}
              filteredUsers={filteredUsers}
              onViewUser={handleViewUser}
              onVerifyUser={handleVerifyUser}
              onRejectUser={handleRejectUser}
              onBanUser={handleBanUser}
              onActivateUser={handleActivateUser}
              onDeactivateUser={handleDeactivateUser}
              onTestUpdateUser={testUpdateUser}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <UserDetailsDialog 
          user={selectedUser} 
          onVerify={(userId) => {
            handleVerifyUser(userId);
            setShowDialog(false);
          }}
          onReject={(userId) => {
            handleRejectUser(userId);
            setShowDialog(false);
          }}
        />
      </Dialog>
    </div>
  );
};

export default UserManagement;
