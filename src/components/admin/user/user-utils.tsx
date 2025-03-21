
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
      return <Badge variant="outline">{status}</Badge>;
  }
};
