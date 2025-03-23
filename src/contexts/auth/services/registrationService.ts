
import { supabase } from "@/integrations/supabase/client";

export const checkEmailExists = async (email: string) => {
  try {
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email);
    
    return existingProfiles && existingProfiles.length > 0;
  } catch (error) {
    console.error("Error checking if email exists:", error);
    return false;
  }
};

export const signUpWithEmail = async (email: string, password: string, userData: any) => {
  try {
    console.log("Signing up with userData:", userData);
    
    // Check if a user with this email already exists in profiles
    const emailExists = await checkEmailExists(email);
    
    if (emailExists) {
      // Return custom error if email already exists in profiles
      return { 
        error: { message: "This email is already in use. Please use a different email or sign in." },
        data: null 
      };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    return { data, error };
  } catch (error: any) {
    console.error("Signup catch error:", error);
    return { error, data: null };
  }
};
