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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Define the donor type based on the real data structure
interface Donor {
  id: string;
  name: string;
  bloodType: string;
  city: string;
  region?: string;
  isAvailable: boolean;
  distance: number; // Making this required as expected by DonorCard
  lastDonation?: string;
  avatar?: string;
}

export default function DonorSearch() {
  const [search, setSearch] = useState("");
  const [bloodType, setBloodType] = useState<any>(null);
  const [distance, setDistance] = useState([20]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch real donors from the database
  useEffect(() => {
    const fetchDonors = async () => {
      setIsLoading(true);
      
      try {
        // Query all profiles that are available to be donors
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, blood_type, location, region, is_available')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching donors:", error);
          toast({
            title: "Error",
            description: "Failed to load donors. Please try again.",
            variant: "destructive",
          });
          setDonors([]);
        } else if (data) {
          console.log("Fetched donors:", data);
          
          // Transform the data to match our Donor interface
          const transformedDonors = data.map(profile => {
            // Calculate a mock distance - in a real app this would be based on geolocation
            const mockDistance = Math.floor(Math.random() * 20) + 1;
            
            return {
              id: profile.id,
              name: profile.full_name || "Anonymous Donor",
              bloodType: profile.blood_type || "O+",
              city: profile.location || "Unknown Location",
              region: profile.region || "",
              isAvailable: profile.is_available !== false, // Default to true if undefined
              distance: mockDistance, // Ensuring this is always set
              // No last_donation_date in the profiles table, so we'll leave this undefined
              lastDonation: undefined
            };
          });
          
          setDonors(transformedDonors);
          setFilteredDonors(transformedDonors);
        }
      } catch (error) {
        console.error("Exception fetching donors:", error);
        toast({
          title: "Error",
          description: "Failed to load donors. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDonors();
  }, [toast]);
  
  // Filter donors based on search criteria
  useEffect(() => {
    if (donors.length === 0) return;
    
    let results = [...donors];
    
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
      results = results.filter(donor => 
        donor.distance !== undefined && donor.distance <= distance[0]
      );
    }
    
    // Sort by distance
    results = results.sort((a, b) => 
      (a.distance || 20) - (b.distance || 20)
    );
    
    setFilteredDonors(results);
  }, [search, bloodType, distance, donors]);
  
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
        <span>Showing all available donors</span>
      </div>
      
      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full h-[200px] animate-pulse bg-muted/50">
              <CardContent className="flex items-center justify-center h-full">
                Loading donors...
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredDonors.length > 0 ? (
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
