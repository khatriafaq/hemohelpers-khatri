
import { User } from "@/types/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserTable from "./UserTable";
import { filterUsersByStatus } from "./user-utils";
import { useState, useEffect } from "react";

interface UserTabsProps {
  loading: boolean;
  filteredUsers: User[];
  onViewUser: (user: User) => void;
  onVerifyUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
  onBanUser: (userId: string) => void;
  onActivateUser: (userId: string) => void;
  onDeactivateUser: (userId: string) => void;
}

const UserTabs = ({
  loading,
  filteredUsers,
  onViewUser,
  onVerifyUser,
  onRejectUser,
  onBanUser,
  onActivateUser,
  onDeactivateUser
}: UserTabsProps) => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Count users by status for tab indicators
  const pendingCount = filteredUsers ? filteredUsers.filter(user => user.status === "pending").length : 0;
  const verifiedCount = filteredUsers ? filteredUsers.filter(user => user.status === "verified").length : 0;
  const rejectedCount = filteredUsers ? filteredUsers.filter(user => user.status === "rejected").length : 0;
  const bannedCount = filteredUsers ? filteredUsers.filter(user => user.status === "banned").length : 0;
  
  // Add console log to help with debugging
  console.log(`UserTabs received ${filteredUsers?.length || 0} users, loading: ${loading}`);
  console.log(`User counts by status - Pending: ${pendingCount}, Verified: ${verifiedCount}, Rejected: ${rejectedCount}, Banned: ${bannedCount}`);
  console.log("Filtered users:", filteredUsers);

  // Auto-select the pending tab if there are pending users and we're not on a specific tab
  useEffect(() => {
    if (pendingCount > 0 && activeTab === "all") {
      console.log("Auto-selecting pending tab because there are pending users");
      setActiveTab("pending");
    }
  }, [pendingCount, activeTab]);

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid grid-cols-5 w-auto">
            <TabsTrigger value="all">
              All Users {filteredUsers?.length > 0 && `(${filteredUsers.length})`}
            </TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="verified">
              Verified {verifiedCount > 0 && `(${verifiedCount})`}
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected {rejectedCount > 0 && `(${rejectedCount})`}
            </TabsTrigger>
            <TabsTrigger value="banned">
              Banned {bannedCount > 0 && `(${bannedCount})`}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <UserTable 
            users={filteredUsers}
            loading={loading}
            onViewUser={onViewUser}
            onVerifyUser={onVerifyUser}
            onRejectUser={onRejectUser}
            onBanUser={onBanUser}
            onActivateUser={onActivateUser}
            onDeactivateUser={onDeactivateUser}
          />
        </TabsContent>
        
        <TabsContent value="pending" className="mt-0">
          <UserTable 
            users={filterUsersByStatus(filteredUsers, "pending")}
            loading={loading}
            onViewUser={onViewUser}
            onVerifyUser={onVerifyUser}
            onRejectUser={onRejectUser}
            onBanUser={onBanUser}
            onActivateUser={onActivateUser}
            onDeactivateUser={onDeactivateUser}
          />
        </TabsContent>
        
        <TabsContent value="verified" className="mt-0">
          <UserTable 
            users={filterUsersByStatus(filteredUsers, "verified")}
            loading={loading}
            onViewUser={onViewUser}
            onVerifyUser={onVerifyUser}
            onRejectUser={onRejectUser}
            onBanUser={onBanUser}
            onActivateUser={onActivateUser}
            onDeactivateUser={onDeactivateUser}
          />
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-0">
          <UserTable 
            users={filterUsersByStatus(filteredUsers, "rejected")}
            loading={loading}
            onViewUser={onViewUser}
            onVerifyUser={onVerifyUser}
            onRejectUser={onRejectUser}
            onBanUser={onBanUser}
            onActivateUser={onActivateUser}
            onDeactivateUser={onDeactivateUser}
          />
        </TabsContent>
        
        <TabsContent value="banned" className="mt-0">
          <UserTable 
            users={filterUsersByStatus(filteredUsers, "banned")}
            loading={loading}
            onViewUser={onViewUser}
            onVerifyUser={onVerifyUser}
            onRejectUser={onRejectUser}
            onBanUser={onBanUser}
            onActivateUser={onActivateUser}
            onDeactivateUser={onDeactivateUser}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserTabs;
