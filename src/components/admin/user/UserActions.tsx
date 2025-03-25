
import { User } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";

interface UserActionsProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const useUserActions = ({ users, setUsers }: UserActionsProps) => {
  const { toast } = useToast();

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

  return {
    handleVerifyUser,
    handleRejectUser,
    handleBanUser
  };
};
