
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DonationRequestDialogProps {
  donorName: string;
  bloodType: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DonationRequestDialog({ 
  donorName, 
  bloodType, 
  isOpen, 
  onOpenChange 
}: DonationRequestDialogProps) {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSendRequest = () => {
    // Simulate sending a request
    console.log("Request sent to:", donorName, "Message:", message);
    
    toast({
      title: "Request sent",
      description: `Your donation request has been sent to ${donorName}.`,
    });
    
    onOpenChange(false);
    setMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request donation from {donorName}</DialogTitle>
          <DialogDescription>
            Send a message explaining your needs and situation. The donor will be notified immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4 bg-secondary/50 p-3 rounded-lg">
            <div className="flex h-10 w-10 rounded-full bg-blood items-center justify-center text-white font-semibold">
              {bloodType}
            </div>
            <div>
              <p className="font-medium">{bloodType} Blood Type</p>
              <p className="text-sm text-muted-foreground">Compatible with your request</p>
            </div>
          </div>
          
          <Textarea
            placeholder="Explain your need for blood donation..."
            className="min-h-[120px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="h-4 w-4 mr-2" />
            <span>Donor will be notified by email</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendRequest} 
            className="bg-blood hover:bg-blood/90 text-white"
            disabled={!message.trim()}
          >
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
