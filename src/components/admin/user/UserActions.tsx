
import { User } from "@/types/admin";
import { useUserVerification } from "./hooks/useUserVerification";
import { useUserBanning } from "./hooks/useUserBanning";
import { useUserActivation } from "./hooks/useUserActivation";

interface UserActionsProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const useUserActions = ({ users, setUsers }: UserActionsProps) => {
  // Use the individual hook modules
  const { handleVerifyUser, handleRejectUser } = useUserVerification({ users, setUsers });
  const { handleBanUser } = useUserBanning({ users, setUsers });
  const { handleActivateUser, handleDeactivateUser } = useUserActivation({ users, setUsers });

  return {
    handleVerifyUser,
    handleRejectUser,
    handleBanUser,
    handleActivateUser,
    handleDeactivateUser
  };
};
