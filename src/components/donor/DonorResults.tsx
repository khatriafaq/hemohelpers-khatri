
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import DonorCard from "./DonorCard";
import { Donor } from "@/types/admin";
import EmptyState from "./EmptyState";

interface DonorResultsProps {
  donors: Donor[];
  isLoading: boolean;
  error: string | null;
  onClearFilters: () => void;
}

const DonorResults = ({ 
  donors, 
  isLoading, 
  error, 
  onClearFilters 
}: DonorResultsProps) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  useEffect(() => {
    if (!isLoading) {
      // After the first load completes
      setIsInitialLoad(false);
    }
  }, [isLoading]);
  
  // Show loader on initial load
  if (isLoading && isInitialLoad) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <Loader2 className="h-10 w-10 animate-spin text-blood mb-4" />
        <p className="text-muted-foreground">Finding donors...</p>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <p className="text-destructive font-semibold mb-2">Error loading donors</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }
  
  // Show empty state
  if (!isLoading && donors.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} />;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {donors.map((donor) => (
        <DonorCard key={donor.id} donor={donor} />
      ))}
      
      {/* Show loader at bottom when loading more */}
      {isLoading && !isInitialLoad && (
        <div className="col-span-full flex justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-blood" />
        </div>
      )}
    </div>
  );
};

export default DonorResults;
