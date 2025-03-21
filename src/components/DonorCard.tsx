
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Mail, MapPin, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface DonorCardProps {
  donor: {
    id: string;
    name: string;
    bloodType: string;
    city: string;
    region?: string;
    isAvailable: boolean;
    distance: number;
    avatar?: string;
    lastDonation?: string;
  };
}

export default function DonorCard({ donor }: DonorCardProps) {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSendRequest = () => {
    // Simulate sending a request
    console.log("Request sent to:", donor.name, "Message:", message);
    
    toast({
      title: "Request sent",
      description: `Your donation request has been sent to ${donor.name}.`,
    });
    
    setIsDialogOpen(false);
    setMessage("");
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-elevation-medium hover:-translate-y-1">
      <CardHeader className="bg-card p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={donor.avatar} alt={donor.name} />
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {donor.name.split(" ").map(part => part[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{donor.name}</h3>
              <div className="text-sm text-muted-foreground flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {donor.city}{donor.region ? `, ${donor.region}` : ""}
                <span className="mx-1.5">•</span>
                <span>{donor.distance} km away</span>
              </div>
            </div>
          </div>
          
          <Badge 
            variant={donor.isAvailable ? "default" : "outline"}
            className={donor.isAvailable ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
          >
            {donor.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex flex-wrap gap-3 mt-3">
          <div className="rounded-full bg-blood-light px-4 py-1.5 text-blood font-semibold flex items-center">
            <span className="text-lg">{donor.bloodType}</span>
          </div>
          
          {donor.lastDonation && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full h-8 text-xs gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Last Donation
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3">
                <div className="flex flex-col">
                  <div className="text-sm font-medium">Last donated on</div>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{donor.lastDonation}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-2 gap-2">
        <Button variant="outline" className="w-1/2 rounded-full" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          Message
        </Button>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-1/2 rounded-full bg-blood hover:bg-blood/90 text-white" 
              size="sm"
              disabled={!donor.isAvailable}
            >
              Request Donation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Request donation from {donor.name}</DialogTitle>
              <DialogDescription>
                Send a message explaining your needs and situation. The donor will be notified immediately.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 bg-secondary/50 p-3 rounded-lg">
                <div className="flex h-10 w-10 rounded-full bg-blood items-center justify-center text-white font-semibold">
                  {donor.bloodType}
                </div>
                <div>
                  <p className="font-medium">{donor.bloodType} Blood Type</p>
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
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
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
      </CardFooter>
    </Card>
  );
}
