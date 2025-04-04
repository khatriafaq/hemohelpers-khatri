import { User } from "@/types/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserTable from "./UserTable";
import { filterUsersByStatus } from "./user-utils";
import { useState } from "react";

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
  
  // Add console log to help with debugging
  console.log(`UserTabs received ${filteredUsers?.length || 0} users, loading: ${loading}`);

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid grid-cols-4 w-auto">
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default UserTabs;
