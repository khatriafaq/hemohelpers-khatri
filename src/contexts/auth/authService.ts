
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

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

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  } catch (error: any) {
    return { error, data: null };
  }
};

export const signUpWithEmail = async (email: string, password: string, userData: any) => {
  try {
    console.log("Signing up with userData:", userData);
    
    // Check if a user with this email already exists in profiles
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email);
    
    if (existingProfiles && existingProfiles.length > 0) {
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

export const updateUserProfile = async (userId: string, data: any) => {
  try {
    const { data: updatedData, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId)
      .select();

    return { data: updatedData, error };
  } catch (error: any) {
    return { error, data: null };
  }
};

export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error signing out:", error);
    return { error };
  }
};
