import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import DonorInfo from "./donor/DonorInfo";
import DonorBadges from "./donor/DonorBadges";
import DonationRequestDialog from "./donor/DonationRequestDialog";
import BloodDropAvatar from "./ui/BloodDropAvatar";
import HeartECG from "./ui/HeartECG";
import { cn } from "@/lib/utils";

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

  // Convert lastDonation string to Date if it exists
  const lastDonationDate = donor.lastDonation ? new Date(donor.lastDonation) : undefined;

  // Determine if the donor is eligible based on last donation date
  const isEligible = () => {
    if (!donor.lastDonation) return true; // If no last donation, assume eligible
    
    try {
      const lastDonationDate = new Date(donor.lastDonation);
      const daysSinceLastDonation = Math.floor(
        (new Date().getTime() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // Assuming 56 days (8 weeks) is the minimum time between donations
      return daysSinceLastDonation >= 56;
    } catch (error) {
      console.error("Error calculating eligibility:", error);
      return true; // Default to eligible if there's an error
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-elevation-medium hover:-translate-y-1">
      <CardHeader className="bg-card p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <BloodDropAvatar 
              bloodType={donor.bloodType} 
              lastDonationDate={lastDonationDate}
              size="md"
              name={donor.name}
            />
            <DonorInfo 
              name={donor.name}
              city={donor.city}
              region={donor.region}
              distance={donor.distance}
              orakh={donor.orakh}
            />
          </div>
          
          <div className="flex items-start gap-6 pt-1">
            <HeartECG 
              size="sm" 
              color={isEligible() ? "text-blood" : "text-amber-500"} 
              isActive={donor.isAvailable}
              className="transform -translate-y-[1px]"
            />
            
            <Badge 
              variant={donor.isAvailable ? "default" : "outline"}
              className={cn(
                "px-3 py-1.5",
                donor.isAvailable 
                  ? "bg-green-100 text-green-800 hover:bg-green-100" 
                  : "bg-muted/50 text-muted-foreground"
              )}
            >
              <span className="font-medium">{donor.isAvailable ? "Available" : "Unavailable"}</span>
            </Badge>
          </div>
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
