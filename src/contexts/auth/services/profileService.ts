
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
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ id: userId, email: '' }])
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
    
    const { data: updatedData, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...data })
      .select();

    if (error) {
      console.error('Error updating profile:', error);
    } else {
      console.log('Profile updated successfully:', updatedData);
    }

    return { data: updatedData, error };
  } catch (error: any) {
    console.error('Error in updateUserProfile:', error);
    return { error, data: null };
  }
};
