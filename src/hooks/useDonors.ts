
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Donor {
  id: string;
  name: string;
  bloodType: string;
  city: string;
  region?: string;
  isAvailable: boolean;
  distance: number;
  lastDonation?: string;
  avatar?: string;
}

export const useDonors = () => {
  const [search, setSearch] = useState("");
  const [bloodType, setBloodType] = useState<string | null>(null);
  const [distance, setDistance] = useState([20]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch donors from the database
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
              lastDonation: undefined
            };
          });
          
          setDonors(transformedDonors);
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
  const filteredDonors = useMemo(() => {
    if (donors.length === 0) return [];
    
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
        donor.distance <= distance[0]
      );
    }
    
    // Sort by distance
    return results.sort((a, b) => a.distance - b.distance);
  }, [search, bloodType, distance, donors]);

  const clearFilters = () => {
    setSearch("");
    setBloodType(null);
    setDistance([20]);
    setDate(undefined);
  };

  return {
    search,
    setSearch,
    bloodType,
    setBloodType,
    distance,
    setDistance,
    date,
    setDate,
    donors,
    filteredDonors,
    isLoading,
    clearFilters
  };
};
