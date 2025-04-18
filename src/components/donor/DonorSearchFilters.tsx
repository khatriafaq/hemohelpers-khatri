import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Filter, Search as SearchIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import BloodTypeSelector, { BloodType } from "@/components/ui/BloodTypeSelector";

interface DonorSearchFiltersProps {
  search: string;
  setSearch: (search: string) => void;
  bloodType: string | null;
  setBloodType: (bloodType: string | null) => void;
  distance: number[];
  setDistance: (distance: number[]) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  clearFilters: () => void;
}

export default function DonorSearchFilters({
  search,
  setSearch,
  bloodType,
  setBloodType,
  distance,
  setDistance,
  date,
  setDate,
  clearFilters
}: DonorSearchFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Convert string to BloodType or use null
  const typedBloodType = bloodType as BloodType | null;
  
  // Handle blood type change with proper type
  const handleBloodTypeChange = (newType: BloodType) => {
    setBloodType(newType);
  };

  // Check if any filters are active
  const hasActiveFilters = search || bloodType || distance[0] < 20 || date;

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, city or region..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="flex gap-2">
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex gap-2 shrink-0">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[90vw] max-w-md sm:w-80 p-4" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Blood Type</Label>
                <BloodTypeSelector
                  value={typedBloodType || "A+"}
                  onChange={handleBloodTypeChange}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Distance (km)</Label>
                  <span className="text-sm">{distance}km</span>
                </div>
                <Slider
                  value={distance}
                  min={1}
                  max={20}
                  step={1}
                  onValueChange={setDistance}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Available Date</Label>
                <div className="grid gap-2">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                    onClick={(e) => e.preventDefault()}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                  <div className="p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="rounded-md border pointer-events-auto"
                      disabled={(date) => date < new Date()}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between gap-2 pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="w-full sm:w-auto"
                >
                  Clear Filters
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="default"
            className="text-muted-foreground hover:text-foreground"
            onClick={clearFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
