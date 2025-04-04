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
  orakh?: string;
}

export const useDonors = () => {
  const [search, setSearch] = useState("");
  const [bloodType, setBloodType] = useState<string | null>(null);
  const [distance, setDistance] = useState([20]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all donors from the database regardless of current user
  useEffect(() => {
    const fetchDonors = async () => {
      setIsLoading(true);
      console.log("Fetching all available donors...");
      
      try {
        // Query all profiles that are available to be donors and are verified
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, blood_type, location, region, is_available, orakh')
          .eq('is_available', true) // Only fetch available donors
          .eq('is_verified', true) // Only fetch verified donors
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
          console.log(`Fetched ${data.length} donors:`, data);
          
          // Transform the data to match our Donor interface
          const transformedDonors = data.map(profile => {
            const mockDistance = Math.floor(Math.random() * 20) + 1;
            
            // Generate a random date within the last 100 days for testing
            const mockLastDonation = new Date();
            mockLastDonation.setDate(mockLastDonation.getDate() - Math.floor(Math.random() * 100));
            
            return {
              id: profile.id,
              name: profile.full_name || "Anonymous Donor",
              bloodType: profile.blood_type || "O+",
              city: profile.location || "Unknown Location",
              region: profile.region || "",
              isAvailable: profile.is_available !== false,
              distance: mockDistance,
              lastDonation: mockLastDonation.toISOString(),
              orakh: profile.orakh || ""
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
