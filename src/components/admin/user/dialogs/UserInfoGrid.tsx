
import { User } from "@/types/admin";

interface UserInfoGridProps {
  user: User;
}

const UserInfoGrid = ({ user }: UserInfoGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="text-sm font-medium mb-1">Full Name</h4>
        <p>{user.name}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-1">Email</h4>
        <p>{user.email}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-1">Blood Type</h4>
        <p>{user.bloodType}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-1">Location</h4>
        <p>{user.location}</p>
      </div>
    </div>
  );
};

export default UserInfoGrid;
