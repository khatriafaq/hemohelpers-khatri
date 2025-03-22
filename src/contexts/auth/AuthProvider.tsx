
import React, { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AuthContext from "./AuthContext";
import { 
  fetchUserProfile, 
  signInWithEmail, 
  signUpWithEmail, 
  updateUserProfile,
  signOutUser
} from "./authService";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
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

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await signInWithEmail(email, password);

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        return { error, data: null };
      }

      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      return { error, data: null };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await signUpWithEmail(email, password, userData);

      if (error) {
        console.error("Signup error:", error);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return { error, data: null };
      }

      toast({
        title: "Account created",
        description: "Your account is pending approval. You'll receive an email once approved.",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error("Signup catch error:", error);
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      return { error, data: null };
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out...");
      const { error } = await signOutUser();
      
      if (error) {
        console.error("Sign out error:", error);
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Clear local state
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsAdmin(false);
      
      // Redirect to home page
      navigate('/');
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error: any) {
      console.error("Sign out error in catch:", error);
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (data: any) => {
    try {
      if (!user) return { error: new Error("No user logged in"), data: null };
      
      const { data: updatedData, error } = await updateUserProfile(user.id, data);

      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
        return { error, data: null };
      }

      if (updatedData && updatedData.length > 0) {
        setProfile(updatedData[0]);
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        });
      }

      return { data: updatedData, error: null };
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
      return { error, data: null };
    }
  };

  const value = {
    user,
    session,
    profile,
    isLoading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
