
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, Clock, Check } from "lucide-react";

export const renderStatusBadge = (status: string) => {
  switch (status) {
    case "urgent":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex gap-1 items-center">
          <AlertTriangle className="h-3 w-3" />
          Urgent
        </Badge>
      );
    case "scheduled":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex gap-1 items-center">
          <Calendar className="h-3 w-3" />
          Scheduled
        </Badge>
      );
    case "ongoing":
      return (
        <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100 flex gap-1 items-center">
          <Clock className="h-3 w-3" />
          Ongoing
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 flex gap-1 items-center">
          <Check className="h-3 w-3" />
          Completed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
