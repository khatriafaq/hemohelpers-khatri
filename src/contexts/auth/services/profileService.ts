
import { supabase } from "@/integrations/supabase/client";

export const fetchUserProfile = async (userId: string) => {
  try {
    if (!userId) {
      console.error("No user ID provided to fetchUserProfile");
      return { profile: null, isAdmin: false, error: new Error("No user ID provided") };
    }

    console.log("Fetching profile for user:", userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      
      // Check if the error is "not found" - we'll create a new profile
      if (error.code === 'PGRST116') {
        console.log('Profile not found, creating a new one');
        
        // Get user email from auth if possible
        const { data: userData } = await supabase.auth.getUser();
        const email = userData?.user?.email || '';
        
        // Create a new profile with minimal data
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ 
            id: userId, 
            email,
            is_available: true,
            is_verified: false
          }])
          .select()
          .single();
          
        if (createError) {
          console.error('Error creating profile:', createError);
          return { profile: null, isAdmin: false, error: createError };
        }
        
        console.log('New profile created:', newProfile);
        return { profile: newProfile, isAdmin: Boolean(newProfile?.is_admin) };
      }
      
      return { profile: null, isAdmin: false, error };
    }

    if (data) {
      console.log("Profile data successfully retrieved:", data);
      return { profile: data, isAdmin: Boolean(data.is_admin) };
    }
    
    return { profile: null, isAdmin: false, error: new Error("No profile data returned") };
  } catch (error: any) {
    console.error('Error in fetchUserProfile:', error.message);
    return { profile: null, isAdmin: false, error };
  }
};

export const updateUserProfile = async (userId: string, data: any) => {
  try {
    if (!userId) {
      console.error("No user ID provided to updateUserProfile");
      return { data: null, error: new Error("No user ID provided") };
    }

    console.log("Updating profile for user:", userId, "with data:", data);
    
    // Transform form data to match the database schema column names
    const profileData = {
      id: userId,
      full_name: data.name, 
      age: data.age ? parseInt(data.age) : null,
      blood_type: data.bloodType,
      location: data.city,
      region: data.region,
      orakh: data.orakh,
      family_card_number: data.familyCardNumber,
      email: data.email,
      phone: data.phone,
      is_available: data.isAvailable,
      show_contact_details: data.showContactDetails,
    };
    
    console.log("Transformed profile data for database:", profileData);
    
    // Make sure we're using the correct Supabase API format for upsert
    const { data: updatedData, error } = await supabase
      .from('profiles')
      .upsert([profileData])
      .select();

    if (error) {
      console.error('Error updating profile:', error);
      return { data: null, error };
    }

    console.log('Profile updated successfully:', updatedData);
    return { 
      data: Array.isArray(updatedData) && updatedData.length > 0 ? updatedData[0] : updatedData, 
      error: null 
    };
  } catch (error: any) {
    console.error('Error in updateUserProfile:', error);
    return { error, data: null };
  }
};
