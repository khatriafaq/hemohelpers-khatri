
import { Droplet, AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyRequestsStateProps {
  onCreateRequest: () => void;
  filter?: string;
}

const EmptyRequestsState = ({ onCreateRequest, filter }: EmptyRequestsStateProps) => {
  const Icon = filter === "urgent" ? AlertTriangle : Droplet;
  const title = filter ? `No ${filter} requests` : "No blood requests found";
  const description = filter 
    ? `There are currently no ${filter} blood donation requests.`
    : "There are currently no blood donation requests. Create a new request using the button above.";

  return (
    <div className="text-center py-12">
      <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {description}
      </p>
      <Button onClick={onCreateRequest}>
        <Plus className="h-4 w-4 mr-2" />
        Create New Request
      </Button>
    </div>
  );
};

export default EmptyRequestsState;
