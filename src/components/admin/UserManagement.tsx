
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { User } from "@/types/admin";

import UserDetailsDialog from "./user/dialogs/UserDetailsDialog";
import UserFilters from "./user/UserFilters";
import UserTabs from "./user/UserTabs";
import { useUsers } from "./user/hooks/useUsers";
import { useUserActions } from "./user/UserActions";

const UserManagement = () => {
  const { users, setUsers, loading, searchQuery, setSearchQuery, filteredUsers } = useUsers();
  const { handleVerifyUser, handleRejectUser, handleBanUser } = useUserActions({ users, setUsers });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowDialog(true);
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
            <UserFilters 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
            />
          </div>
        </CardHeader>
        <CardContent>
          <UserTabs 
            loading={loading}
            filteredUsers={filteredUsers}
            onViewUser={handleViewUser}
            onVerifyUser={handleVerifyUser}
            onRejectUser={handleRejectUser}
            onBanUser={handleBanUser}
          />
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
