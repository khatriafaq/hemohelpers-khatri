
import { supabase } from "@/integrations/supabase/client";

export const checkEmailExists = async (email: string) => {
  try {
    // Check if the email exists in auth.users (via profiles table)
    const { data: existingProfiles, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email.toLowerCase().trim());
    
    if (error) {
      console.error("Error checking if email exists:", error);
      return false;
    }
    
    return existingProfiles && existingProfiles.length > 0;
  } catch (error) {
    console.error("Error checking if email exists:", error);
    return false;
  }
};

export const signUpWithEmail = async (email: string, password: string, userData: any) => {
  try {
    console.log("Checking if email exists:", email);
    
    // Normalize the email (trim and lowercase)
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if a user with this email already exists in profiles
    const emailExists = await checkEmailExists(normalizedEmail);
    
    if (emailExists) {
      console.log("Email already exists in the system:", normalizedEmail);
      // Return custom error if email already exists in profiles
      return { 
        error: { message: "This email is already in use. Please use a different email or sign in." },
        data: null 
      };
    }
    
    console.log("Signing up with userData:", userData);
    
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: userData,
      },
    });

    if (error) {
      console.error("Supabase signup error:", error);
    } else {
      console.log("Signup successful:", data);
    }

    return { data, error };
  } catch (error: any) {
    console.error("Signup catch error:", error);
    return { error, data: null };
  }
};
