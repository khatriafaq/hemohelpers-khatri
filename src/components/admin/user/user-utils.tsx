
import { Badge } from "@/components/ui/badge";

export const renderStatusBadge = (status: string) => {
  switch (status) {
    case "verified":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>;
    case "pending":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    case "rejected":
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
    case "banned":
      return <Badge variant="destructive">Banned</Badge>;
    default:
      return <Badge variant="outline">{status || "Unknown"}</Badge>;
  }
};

export const renderActiveBadge = (isActive: boolean) => {
  return isActive 
    ? <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
    : <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
};

export const filterUsersByStatus = (users: any[], status: string | null) => {
  if (!users) return [];
  if (!status) return users;
  return users.filter(user => user.status === status);
};

export const filterUsersByActive = (users: any[], active: boolean | null) => {
  if (!users) return [];
  if (active === null) return users;
  return users.filter(user => user.isActive === active);
};
