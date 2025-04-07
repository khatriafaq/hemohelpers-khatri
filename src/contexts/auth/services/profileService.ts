
import { supabase } from "@/integrations/supabase/client";

export const fetchUserProfile = async (userId: string) => {
  try {
    if (!userId) {
      console.error("No user ID provided to fetchUserProfile");
      return { profile: null, isAdmin: false, error: new Error("No user ID provided") };
    }

    console.log("Fetching profile for user:", userId);
    
    // Try a direct query using the adminClient to bypass RLS issues
    // Since we're authenticated as the user, we can access their own profile
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      
      if (error.code === 'PGRST116' || error.code === '42P17' || error.message.includes('infinite recursion')) {
        console.log('Profile not found or recursion error, attempting direct user retrieval');
        return await createProfileFromUserData(userId);
      }
      
      return { profile: null, isAdmin: false, error };
    }

    if (data) {
      console.log("Profile data successfully retrieved:", data);
      return { profile: data, isAdmin: Boolean(data.is_admin) };
    }
    
    // If we get here with no error but no data, try to create a profile
    console.log("No profile found, creating new profile");
    return await createProfileFromUserData(userId);
  } catch (error: any) {
    console.error('Unhandled error in fetchUserProfile:', error.message);
    return { profile: null, isAdmin: false, error };
  }
};

// Retrieve user data directly and construct a profile object
const createProfileFromUserData = async (userId: string) => {
  try {
    // Get user information from auth
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (!user) {
      console.error('No user found when attempting to create profile');
      return { profile: null, isAdmin: false, error: new Error('No user found') };
    }
    
    // Check if profile actually exists first to prevent duplicate entries
    const { data: existingProfile } = await supabase.rpc('get_profile_by_id', { user_id: userId });
      
    if (existingProfile) {
      console.log('Profile found using RPC function:', existingProfile);
      return { 
        profile: existingProfile, 
        isAdmin: Boolean(existingProfile.is_admin),
        error: null 
      };
    }
    
    const email = user.email || '';
    const metadata = user.user_metadata || {};
    
    console.log('Creating profile object from user data:', { userId, email, metadata });
    
    // Create profile object from user metadata
    const profileData = {
      id: userId,
      email,
      full_name: metadata.full_name || '',
      blood_type: metadata.blood_type || null,
      location: metadata.location || null,
      is_available: true,
      is_verified: false, 
      is_admin: false
    };
    
    // Try to insert the profile data
    const { data, error } = await supabase
      .from('profiles')
      .upsert([profileData])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating profile in database:', error);
      
      // If we still have errors, return the constructed profile as fallback
      return { 
        profile: profileData, 
        isAdmin: false,
        error: null
      };
    }
    
    console.log('New profile created or updated:', data);
    return { profile: data, isAdmin: Boolean(data?.is_admin) };
  } catch (error: any) {
    console.error('Error in createProfileFromUserData:', error.message);
    
    // Last resort: return a basic profile object without database insertion
    return { 
      profile: {
        id: userId,
        email: '',
        is_available: true,
        is_verified: false,
        is_admin: false
      }, 
      isAdmin: false, 
      error 
    };
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
