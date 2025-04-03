
import { MapPin } from "lucide-react";
import { useDonors } from "@/hooks/useDonors";
import DonorSearchFilters from "@/components/donor/DonorSearchFilters";
import DonorResults from "@/components/donor/DonorResults";

export default function DonorSearch() {
  const {
    search,
    setSearch,
    bloodType,
    setBloodType,
    distance,
    setDistance,
    date,
    setDate,
    filteredDonors,
    isLoading,
    clearFilters
  } = useDonors();
  
  return (
    <div className="space-y-6">
      <DonorSearchFilters
        search={search}
        setSearch={setSearch}
        bloodType={bloodType}
        setBloodType={setBloodType}
        distance={distance}
        setDistance={setDistance}
        date={date}
        setDate={setDate}
        clearFilters={clearFilters}
      />
      
      {/* Location hint */}
      <div className="flex items-center text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 mr-1.5" />
        <span>Showing all available donors in the system</span>
      </div>
      
      <DonorResults
        isLoading={isLoading}
        filteredDonors={filteredDonors}
        clearFilters={clearFilters}
      />
    </div>
  );
}
