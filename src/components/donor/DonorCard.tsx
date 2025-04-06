
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail } from "lucide-react";
import DonorInfo from "./DonorInfo";
import DonorBadges from "./DonorBadges";
import BloodDropAvatar from "@/components/ui/BloodDropAvatar";
import { useState } from "react";
import DonationRequestDialog from "./DonationRequestDialog";

interface DonorCardProps {
  donor: {
    id: string;
    name: string;
    bloodType: string;
    city: string;
    region?: string;
    phone?: string;
    email?: string;
    isAvailable: boolean;
    lastDonationDate?: Date;
    orakh?: string;
    distance: number;
  };
}

export default function DonorCard({ donor }: DonorCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Convert lastDonation string to Date if it exists
  const lastDonationDate = donor.lastDonationDate instanceof Date 
    ? donor.lastDonationDate 
    : undefined;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center gap-4">
            <BloodDropAvatar 
              bloodType={donor.bloodType} 
              lastDonationDate={lastDonationDate}
              size="lg"
            />
            <DonorBadges 
              bloodType={donor.bloodType}
              isAvailable={donor.isAvailable}
              lastDonation={donor.lastDonationDate?.toLocaleDateString()}
            />
          </div>
          
          <div className="flex-1 space-y-4">
            <DonorInfo 
              name={donor.name}
              city={donor.city}
              region={donor.region}
              distance={donor.distance}
              orakh={donor.orakh}
            />
            
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{donor.city}</span>
                {donor.region && <span>, {donor.region}</span>}
              </div>
              {donor.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{donor.phone}</span>
                </div>
              )}
              {donor.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{donor.email}</span>
                </div>
              )}
            </div>
            
            <Button 
              className="w-full md:w-auto" 
              onClick={() => setIsDialogOpen(true)}
              disabled={!donor.isAvailable}
            >
              {donor.isAvailable ? "Contact Donor" : "Not Available"}
            </Button>
            
            <DonationRequestDialog 
              donorName={donor.name}
              bloodType={donor.bloodType}
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
