
import { User } from "@/types/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserTable from "./UserTable";

interface UserTabsProps {
  loading: boolean;
  filteredUsers: User[];
  onViewUser: (user: User) => void;
  onVerifyUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
  onBanUser: (userId: string) => void;
}

const UserTabs = ({
  loading,
  filteredUsers,
  onViewUser,
  onVerifyUser,
  onRejectUser,
  onBanUser
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
          onViewUser={onViewUser}
          onVerifyUser={onVerifyUser}
          onRejectUser={onRejectUser}
          onBanUser={onBanUser}
        />
      </TabsContent>
      
      <TabsContent value="pending" className="mt-0">
        <UserTable 
          users={filteredUsers}
          onViewUser={onViewUser}
          onVerifyUser={onVerifyUser}
          onRejectUser={onRejectUser}
          onBanUser={onBanUser}
          filter="pending"
        />
      </TabsContent>
      
      <TabsContent value="verified" className="mt-0">
        <UserTable 
          users={filteredUsers}
          onViewUser={onViewUser}
          onVerifyUser={onVerifyUser}
          onRejectUser={onRejectUser}
          onBanUser={onBanUser}
          filter="verified"
        />
      </TabsContent>
      
      <TabsContent value="rejected" className="mt-0">
        <UserTable 
          users={filteredUsers}
          onViewUser={onViewUser}
          onVerifyUser={onVerifyUser}
          onRejectUser={onRejectUser}
          onBanUser={onBanUser}
          filter="rejected"
        />
      </TabsContent>
    </Tabs>
  );
};

export default UserTabs;
