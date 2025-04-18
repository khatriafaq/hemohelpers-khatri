
import { useState, useEffect, useCallback, useRef } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { fetchUserProfile } from "../services/profileService";

export const useAuthentication = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileError, setProfileError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const profileFetchAttempts = useRef(0);
  const maxProfileFetchAttempts = 3;

  const handleProfileFetch = useCallback(async (userId: string) => {
    console.log("Handling profile fetch for user:", userId);
    
    try {
      if (profileFetchAttempts.current === 0) {
        setIsLoading(true);
      }
      
      // Increment fetch attempts
      profileFetchAttempts.current += 1;
      setProfileError(null);
      
      // Check if we've exceeded max attempts
      if (profileFetchAttempts.current > maxProfileFetchAttempts) {
        console.log(`Exceeded max profile fetch attempts (${maxProfileFetchAttempts})`);
        setIsLoading(false);
        setProfileError(new Error(`Failed to load profile after ${maxProfileFetchAttempts} attempts`));
        return;
      }
      
      const { profile, isAdmin, error } = await fetchUserProfile(userId);
      
      if (error) {
        console.error("Error fetching profile:", error);
        setProfileError(error);
        
        if (profileFetchAttempts.current >= maxProfileFetchAttempts) {
          toast({
            title: "Profile Error",
            description: "Failed to load your profile. Please try again later.",
            variant: "destructive",
          });
        }
      }
      
      if (profile) {
        console.log("Setting profile and admin status:", profile, isAdmin);
        setProfile(profile);
        setIsAdmin(Boolean(isAdmin));
        profileFetchAttempts.current = 0; // Reset attempts on success
        setProfileError(null);
      } else if (!error) {
        // If no profile and no error, we should still stop loading
        console.log("No profile found, setting null");
        setProfile(null);
      }
    } catch (error: any) {
      console.error("Error in handleProfileFetch:", error);
      setProfileError(error);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    
    // Function to handle auth state change
    const handleAuthChange = async (event: string, currentSession: Session | null) => {
      console.log("Auth state changed:", event, currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (event === 'SIGNED_OUT') {
        setProfile(null);
        setIsAdmin(false);
        setProfileError(null);
        navigate('/');
      } else if ((event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') && currentSession) {
        // Reset fetch attempts counter
        profileFetchAttempts.current = 0;
        
        // Use setTimeout to avoid potential auth deadlocks
        setTimeout(() => {
          handleProfileFetch(currentSession.user.id);
        }, 0);
      } else {
        // If no auth event requires profile fetch, make sure we're not in loading state
        setIsLoading(false);
      }
    };

    // Setup auth state listener first
    const setupAuthListener = async () => {
      const { data } = supabase.auth.onAuthStateChange(handleAuthChange);
      authListener = data;
    };
    
    // Check for existing session
    const checkExistingSession = async () => {
      try {
        console.log("Checking for existing session");
        const { data } = await supabase.auth.getSession();
        console.log("Retrieved session:", data.session);
        
        if (data.session) {
          setIsLoading(true); // Ensure loading state is true while we process the session
          // Handle session ourselves rather than letting onAuthStateChange do it
          // to ensure we process existing sessions correctly
          handleAuthChange('INITIAL_SESSION', data.session);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        setIsLoading(false);
      }
    };

    // Setup auth in correct order
    setupAuthListener();
    checkExistingSession();

    // Cleanup
    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate, handleProfileFetch]);

  // Add a manual profile refresh function with protection against infinite retries
  const refreshProfile = useCallback(() => {
    if (user?.id) {
      console.log("Manual profile refresh requested");
      // Allow fresh attempts but don't completely reset counter
      profileFetchAttempts.current = Math.max(0, profileFetchAttempts.current - 1);
      setIsLoading(true);
      handleProfileFetch(user.id);
    } else {
      console.log("Cannot refresh profile: no user ID available");
    }
  }, [user, handleProfileFetch]);

  return {
    user,
    session,
    profile,
    isLoading,
    isAdmin,
    profileError,
    setProfile,
    refreshProfile,
  };
};
