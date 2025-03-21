
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarIcon, Filter, MapPin, Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import BloodTypeSelector from "@/components/ui/BloodTypeSelector";
import DonorCard from "@/components/DonorCard";

// Mock donor data
const mockDonors = [
  {
    id: "1",
    name: "John Smith",
    bloodType: "O+",
    city: "San Francisco",
    region: "CA",
    isAvailable: true,
    distance: 2.3,
    lastDonation: "May 15, 2023"
  },
  {
    id: "2",
    name: "Emma Johnson",
    bloodType: "A-",
    city: "Oakland",
    region: "CA",
    isAvailable: true,
    distance: 5.8,
    lastDonation: "March 3, 2023"
  },
  {
    id: "3",
    name: "Michael Davis",
    bloodType: "B+",
    city: "San Jose",
    region: "CA",
    isAvailable: false,
    distance: 8.1,
    lastDonation: "January 22, 2023"
  },
  {
    id: "4",
    name: "Sarah Wilson",
    bloodType: "AB+",
    city: "Palo Alto",
    region: "CA",
    isAvailable: true,
    distance: 4.7
  },
  {
    id: "5",
    name: "Robert Taylor",
    bloodType: "O-",
    city: "Berkeley",
    region: "CA",
    isAvailable: true,
    distance: 7.2,
    lastDonation: "April 11, 2023"
  },
  {
    id: "6",
    name: "Jennifer Brown",
    bloodType: "A+",
    city: "San Mateo",
    region: "CA",
    isAvailable: false,
    distance: 9.5,
    lastDonation: "February 8, 2023"
  }
];

export default function DonorSearch() {
  const [search, setSearch] = useState("");
  const [bloodType, setBloodType] = useState<any>(null);
  const [distance, setDistance] = useState([20]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [filteredDonors, setFilteredDonors] = useState(mockDonors);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter donors based on search criteria
  useEffect(() => {
    let results = mockDonors;
    
    // Filter by search term (name or city)
    if (search) {
      const lowerSearch = search.toLowerCase();
      results = results.filter(
        donor => 
          donor.name.toLowerCase().includes(lowerSearch) ||
          donor.city.toLowerCase().includes(lowerSearch) ||
          (donor.region && donor.region.toLowerCase().includes(lowerSearch))
      );
    }
    
    // Filter by blood type
    if (bloodType) {
      results = results.filter(donor => donor.bloodType === bloodType);
    }
    
    // Filter by distance
    if (distance[0] < 20) {
      results = results.filter(donor => donor.distance <= distance[0]);
    }
    
    // Sort by distance
    results = results.sort((a, b) => a.distance - b.distance);
    
    setFilteredDonors(results);
  }, [search, bloodType, distance]);
  
  const clearFilters = () => {
    setSearch("");
    setBloodType(null);
    setDistance([20]);
    setDate(undefined);
  };
  
  return (
    <div className="space-y-6">
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
        
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex gap-2 shrink-0">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Blood Type</Label>
                <BloodTypeSelector
                  value={bloodType}
                  onChange={setBloodType}
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
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Location hint */}
      <div className="flex items-center text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 mr-1.5" />
        <span>Showing donors near San Francisco, CA</span>
      </div>
      
      {/* Results */}
      {filteredDonors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDonors.map((donor) => (
            <DonorCard key={donor.id} donor={donor} />
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
}
