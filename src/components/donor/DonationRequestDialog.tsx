import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BloodDropAvatar from "@/components/ui/BloodDropAvatar";

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
            <BloodDropAvatar 
              bloodType={bloodType} 
              size="sm"
              name={donorName}
            />
            <div>
              <div className="font-medium">{donorName}</div>
              <div className="text-sm text-muted-foreground">Blood Type: {bloodType}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Your message
            </label>
            <Textarea
              id="message"
              placeholder="Explain your situation and when you need the donation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendRequest} disabled={!message.trim()}>
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
