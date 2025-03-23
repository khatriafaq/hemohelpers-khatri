
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { fetchUserProfile } from "../authService";

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
    const { profile, isAdmin, error } = await fetchUserProfile(userId);
    
    if (profile) {
      setProfile(profile);
      setIsAdmin(isAdmin);
    }
    
    setIsLoading(false);
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
