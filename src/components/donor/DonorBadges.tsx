import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface DonorBadgesProps {
  bloodType: string;
  isAvailable: boolean;
  lastDonation?: string;
}

export default function DonorBadges({ bloodType, isAvailable, lastDonation }: DonorBadgesProps) {
  // Format the last donation date in AM/PM format
  const formatLastDonationDate = (dateString?: string) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return original string if formatting fails
    }
  };

  const formattedLastDonation = formatLastDonationDate(lastDonation);

  return (
    <div className="flex flex-wrap items-center gap-3 mt-3">
      {/* Blood Type Badge */}
      <div className="rounded-full bg-blood-light px-4 py-1.5 text-blood font-semibold flex items-center justify-center min-w-[60px]">
        <span className="text-lg">{bloodType}</span>
      </div>
      
      {/* Last Donation Button */}
      {lastDonation && (
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full h-8 text-xs gap-1 flex items-center justify-center min-w-[120px]"
            >
              <Clock className="h-3.5 w-3.5" />
              Last Donation
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3">
            <div className="flex flex-col">
              <div className="text-sm font-medium">Last donated on</div>
              <div className="flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{formattedLastDonation}</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
