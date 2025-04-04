import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import DonorAvatar from "./donor/DonorAvatar";
import DonorInfo from "./donor/DonorInfo";
import DonorBadges from "./donor/DonorBadges";
import DonationRequestDialog from "./donor/DonationRequestDialog";

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
    orakh?: string;
  };
}

export default function DonorCard({ donor }: DonorCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-elevation-medium hover:-translate-y-1">
      <CardHeader className="bg-card p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <DonorAvatar name={donor.name} avatarUrl={donor.avatar} />
            <DonorInfo 
              name={donor.name}
              city={donor.city}
              region={donor.region}
              distance={donor.distance}
              orakh={donor.orakh}
            />
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
        <DonorBadges 
          bloodType={donor.bloodType}
          isAvailable={donor.isAvailable}
          lastDonation={donor.lastDonation}
        />
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-2 gap-2">
        <Button variant="outline" className="w-1/2 rounded-full" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          Message
        </Button>
        
        <Button 
          className="w-1/2 rounded-full bg-blood hover:bg-blood/90 text-white" 
          size="sm"
          disabled={!donor.isAvailable}
          onClick={() => setIsDialogOpen(true)}
        >
          Request Donation
        </Button>
        
        <DonationRequestDialog 
          donorName={donor.name}
          bloodType={donor.bloodType}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </CardFooter>
    </Card>
  );
}
