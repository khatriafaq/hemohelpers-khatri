
import { User } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, X } from "lucide-react";
import UserInfoGrid from "./UserInfoGrid";
import UserDocumentList from "./UserDocumentList";

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
        <UserInfoGrid user={user} />
        <UserDocumentList documents={user.documents} />
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
