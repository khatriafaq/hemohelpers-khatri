
import { MapPin } from "lucide-react";

interface DonorInfoProps {
  name: string;
  city: string;
  region?: string;
  distance: number;
}

export default function DonorInfo({ name, city, region, distance }: DonorInfoProps) {
  return (
    <div>
      <h3 className="font-medium text-lg">{name}</h3>
      <div className="text-sm text-muted-foreground flex items-center">
        <MapPin className="h-3.5 w-3.5 mr-1" />
        {city}{region ? `, ${region}` : ""}
        <span className="mx-1.5">•</span>
        <span>{distance} km away</span>
      </div>
    </div>
  );
}
