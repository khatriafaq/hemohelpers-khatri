import { User } from "@/types/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserTable from "./UserTable";
import { filterUsersByStatus } from "./user-utils";
import { Button } from "@/components/ui/button";

interface UserTabsProps {
  loading: boolean;
  filteredUsers: User[];
  onViewUser: (user: User) => void;
  onVerifyUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
  onBanUser: (userId: string) => void;
  onActivateUser: (userId: string) => void;
  onDeactivateUser: (userId: string) => void;
  onTestUpdateUser?: (userId: string) => void;
}

const UserTabs = ({
  loading,
  filteredUsers,
  onViewUser,
  onVerifyUser,
  onRejectUser,
  onBanUser,
  onActivateUser,
  onDeactivateUser,
  onTestUpdateUser
}: UserTabsProps) => {
  // Add console log to help with debugging
  console.log(`UserTabs received ${filteredUsers?.length || 0} users, loading: ${loading}`);

  // Function to handle test button click
  const handleTestClick = () => {
    if (filteredUsers.length > 0 && onTestUpdateUser) {
      onTestUpdateUser(filteredUsers[0].id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        {onTestUpdateUser && (
          <Button 
            variant="outline" 
            onClick={handleTestClick}
            disabled={loading || filteredUsers.length === 0}
          >
            Test Update
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="all">
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
