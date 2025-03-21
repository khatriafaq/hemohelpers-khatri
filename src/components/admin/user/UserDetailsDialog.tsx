
import { User } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, X } from "lucide-react";

interface UserDetailsDialogProps {
  user: User | null;
  onVerify: (userId: string) => void;
  onReject: (userId: string) => void;
}

const UserDetailsDialog = ({ user, onVerify, onReject }: UserDetailsDialogProps) => {
  if (!user) return null;

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>User Profile - {user.name}</DialogTitle>
        <DialogDescription>
          Review user documents and information before verification.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
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
        
        <div>
          <h4 className="text-sm font-medium mb-2">Documents</h4>
          <div className="border rounded-lg p-3 space-y-3">
            {user.documents.map((doc: string, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-8 bg-secondary rounded flex items-center justify-center">
                    <span className="text-xs">PDF</span>
                  </div>
                  <span>{doc}</span>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <DialogFooter className="flex justify-between sm:justify-between">
        <Button 
          variant="destructive" 
          onClick={() => onReject(user.id)}
          disabled={user.status === "rejected" || user.status === "banned"}
        >
          <X className="h-4 w-4 mr-2" />
          Reject
        </Button>
        <Button 
          onClick={() => onVerify(user.id)}
          disabled={user.status === "verified" || user.status === "banned"}
          className="bg-green-600 hover:bg-green-700"
        >
          <Check className="h-4 w-4 mr-2" />
          Verify
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default UserDetailsDialog;
