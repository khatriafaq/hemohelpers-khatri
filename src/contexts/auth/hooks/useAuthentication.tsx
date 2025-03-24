
import { useState, useEffect } from "react";
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

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setIsAdmin(false);
          navigate('/');
        } else if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session) {
          await handleProfileFetch(session.user.id);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Retrieved existing session:", session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        handleProfileFetch(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleProfileFetch = async (userId: string) => {
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
        setIsAdmin(isAdmin);
      } else {
        console.log("No profile found, setting null");
        setProfile(null);
      }
    } catch (error) {
      console.error("Error in handleProfileFetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    session,
    profile,
    isLoading,
    isAdmin,
    setProfile,
  };
};
