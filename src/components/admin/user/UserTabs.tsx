
import { User } from "@/types/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserTable from "./UserTable";
import { filterUsersByStatus } from "./user-utils";

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
  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
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
  );
};

export default UserTabs;
