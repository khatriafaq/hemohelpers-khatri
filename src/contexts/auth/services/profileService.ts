
import { supabase } from "@/integrations/supabase/client";

export const fetchUserProfile = async (userId: string) => {
  try {
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
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ id: userId, email }])
          .select()
          .single();
          
        if (createError) {
          console.error('Error creating profile:', createError);
          throw createError;
        }
        
        console.log('New profile created:', newProfile);
        return { profile: newProfile, isAdmin: newProfile?.is_admin || false };
      }
      
      throw error;
    }

    if (data) {
      console.log("Profile data:", data);
      return { profile: data, isAdmin: data.is_admin || false };
    }
    
    return { profile: null, isAdmin: false };
  } catch (error: any) {
    console.error('Error fetching profile:', error.message);
    return { profile: null, isAdmin: false, error };
  }
};

export const updateUserProfile = async (userId: string, data: any) => {
  try {
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
      is_available: data.isAvailable,
      show_contact_details: data.showContactDetails,
      email: data.email,
      phone: data.phone,
    };
    
    console.log("Transformed profile data for database:", profileData);
    
    // Explicitly type the options object to match what Supabase expects
    const options = { onConflict: 'id' };
    
    const { data: updatedData, error } = await supabase
      .from('profiles')
      .upsert([profileData], options)
      .select();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    } else {
      console.log('Profile updated successfully:', updatedData);
      // Return the first item if it's an array
      return { data: Array.isArray(updatedData) ? updatedData[0] : updatedData, error: null };
    }

    return { data: updatedData, error: null };
  } catch (error: any) {
    console.error('Error in updateUserProfile:', error);
    return { error, data: null };
  }
};
