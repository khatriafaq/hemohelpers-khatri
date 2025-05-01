
import { supabase } from "@/integrations/supabase/client";

// Use a type assertion approach instead of importing the type
type Profile = {
  id: string;
  email?: string;
  full_name?: string;
  is_admin?: boolean;
  is_verified?: boolean;
  blood_type?: string;
  location?: string;
  family_card_number?: string;
  orakh?: string;
  age?: number;
  phone?: string;
  created_at?: string;
  updated_at?: string;
  region?: string;
  is_available?: boolean;
  show_contact_details?: boolean;
};

console.log('ProfileService: Using Supabase URL:', 
  (supabase as any).url || 'Unknown URL');

export async function fetchUserProfile(userId: string): Promise<{ profile: Profile | null; isAdmin: boolean; error: Error | null }> {
  console.log("⭐ fetchUserProfile called with userId:", userId);

  if (!userId) {
    console.error("❌ fetchUserProfile: No userId provided");
    return { 
      profile: null, 
      isAdmin: false, 
      error: new Error("No user ID provided") 
    };
  }

  let email = '';
  let isAdmin = false;
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    console.log("🔑 Current auth session available:", !!sessionData.session);
    
    if (sessionData.session?.user) {
      email = sessionData.session.user.email || '';
      isAdmin = email ? 
        (email.endsWith('@admin.com') || email.endsWith('@hemohelpers.com')) : 
        false;
    } else {
      console.warn("⚠️ No active session found, authentication may be required");
    }
  } catch (e) {
    console.error("❌ Error checking auth session:", e);
  }

  try {
    console.log("🔍 Attempting to fetch profile for userId:", userId);
    
    // Use the supabase function call to avoid infinite recursion in RLS
    const { data: adminCheckData, error: adminCheckError } = await supabase.rpc('is_admin', { user_id: userId });
    
    if (adminCheckError) {
      console.error("❌ Error checking admin status:", adminCheckError);
    } else {
      isAdmin = !!adminCheckData;
      console.log("👑 Admin status from database:", isAdmin);
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("❌ Profile fetch error:", error);
      console.log("⚠️ Error fetching profile, attempting to create default profile");

      const newProfile = createDefaultProfile(userId, email, isAdmin);
      try {
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) {
          console.error("❌ Failed to create profile:", createError);
          return { 
            profile: newProfile as Profile,
            isAdmin,
            error: new Error(`Failed to create profile: ${createError.message}`) 
          };
        }

        console.log("✅ Created new profile successfully:", createdProfile);
        return { 
          profile: createdProfile as Profile, 
          isAdmin: Boolean(createdProfile.is_admin),
          error: null 
        };
      } catch (createException) {
        console.error("❌ Exception creating profile:", createException);
        return { 
          profile: newProfile as Profile, 
          isAdmin, 
          error: new Error(`Exception creating profile: ${createException}`) 
        };
      }
    }

    if (!data) {
      const newProfile = createDefaultProfile(userId, email, isAdmin);
      return { 
        profile: newProfile as Profile, 
        isAdmin,
        error: new Error("No profile data found") 
      };
    }

    const profileIsAdmin = data.is_admin || 
      (data.email && (
        data.email.endsWith('@admin.com') || 
        data.email.endsWith('@hemohelpers.com')
      ));

    return { 
      profile: data as Profile, 
      isAdmin: profileIsAdmin, 
      error: null 
    };
  } catch (e) {
    console.error("❌ Exception in fetchUserProfile:", e);
    
    const emergencyProfile = createDefaultProfile(userId, email, isAdmin);
    return { 
      profile: emergencyProfile as Profile, 
      isAdmin, 
      error: e instanceof Error ? e : new Error(String(e)) 
    };
  }
}

// Helper function to create a default profile
function createDefaultProfile(userId: string, email: string = '', isAdmin: boolean = false): any {
  return {
    id: userId,
    email: email || 'unknown@example.com',
    full_name: email ? email.split('@')[0] : 'New User',
    is_admin: isAdmin,
    is_verified: true,
    created_at: new Date().toISOString(),
    blood_type: 'O+',
    location: 'Not set',
    family_card_number: '000000',
    orakh: 'Not set',
    age: 30,
    phone: '00000000000'
  };
}

// Update the updateUserProfile function to accept user ID as the first parameter
export async function updateUserProfile(userId: string, profileData: any) {
  if (!userId) {
    console.error("❌ updateUserProfile: No user ID provided");
    return { error: new Error("No user ID provided"), data: null };
  }

  try {
    console.log("🔄 Updating profile for id:", userId);
    
    // Ensure we have the ID in the profile data
    const updatedData = { 
      ...profileData,
      id: userId
    };
    
    if (updatedData.email) {
      updatedData.is_admin = 
        updatedData.email.endsWith('@admin.com') || 
        updatedData.email.endsWith('@hemohelpers.com');
      console.log("👑 Admin status set to:", updatedData.is_admin);
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updatedData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error("❌ Profile update error:", error);
      return { error, data: null };
    }

    console.log("✅ Profile updated successfully");
    return { data, error: null };
  } catch (error: any) {
    console.error("❌ Exception in updateUserProfile:", error);
    return { 
      error, 
      data: null 
    };
  }
}
