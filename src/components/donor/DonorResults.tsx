
import { Card, CardContent } from "@/components/ui/card";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DonorCard from "@/components/DonorCard";
import { Donor } from "@/hooks/useDonors";

interface DonorResultsProps {
  isLoading: boolean;
  filteredDonors: Donor[];
  clearFilters: () => void;
}

export default function DonorResults({ 
  isLoading, 
  filteredDonors,
  clearFilters 
}: DonorResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full h-[200px] animate-pulse bg-muted/50">
            <CardContent className="flex items-center justify-center h-full">
              Loading donors...
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (filteredDonors.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDonors.map((donor) => (
          <DonorCard key={donor.id} donor={donor} />
        ))}
      </div>
    );
  }
  
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-10">
        <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
          <SearchIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">No donors found</h3>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          We couldn't find any donors matching your criteria. Try adjusting your filters or search term.
        </p>
        <Button className="mt-4" onClick={clearFilters}>
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
}
