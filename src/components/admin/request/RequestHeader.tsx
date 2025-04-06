
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import CreateRequestDialog from "./CreateRequestDialog";
import { CreateRequestData } from "./hooks/useRequestManagement";

interface RequestHeaderProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  onCreateRequest: (data: CreateRequestData) => void;
}

const RequestHeader = ({ 
  showDialog, 
  setShowDialog, 
  onCreateRequest 
}: RequestHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Blood Requests</h2>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <Button className="rounded-full" onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Blood Request
        </Button>
        
        <CreateRequestDialog 
          onCancel={() => setShowDialog(false)}
          onCreateRequest={onCreateRequest}
        />
      </Dialog>
    </div>
  );
};

export default RequestHeader;
