
import { useState, useEffect, useCallback } from "react";
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
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProfileFetch = useCallback(async (userId: string) => {
    console.log("Handling profile fetch for user:", userId);
    
    try {
      const { profile, isAdmin, error } = await fetchUserProfile(userId);
      
      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Profile Error",
          description: "Failed to load your profile. Please try again.",
          variant: "destructive",
        });
      }
      
      if (profile) {
        console.log("Setting profile and admin status:", profile, isAdmin);
        setProfile(profile);
        setIsAdmin(Boolean(isAdmin));
      } else {
        console.log("No profile found, setting null");
        setProfile(null);
      }
    } catch (error) {
      console.error("Error in handleProfileFetch:", error);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    
    // Function to handle auth state change
    const handleAuthChange = (event: string, currentSession: Session | null) => {
      console.log("Auth state changed:", event, currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (event === 'SIGNED_OUT') {
        setProfile(null);
        setIsAdmin(false);
        navigate('/');
      } else if ((event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') && currentSession) {
        // Fetch the user profile, but don't set isLoading=false yet (wait for the fetch to complete)
        handleProfileFetch(currentSession.user.id);
      }
    };

    // Setup auth state listener first
    const setupAuthListener = () => {
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

  return {
    user,
    session,
    profile,
    isLoading,
    isAdmin,
    setProfile,
  };
};
