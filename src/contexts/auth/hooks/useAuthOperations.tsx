import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { signInWithEmail, signUpWithEmail, signOutUser, updateUserProfile } from "../services";

export const useAuthOperations = (user: any, setProfile: (profile: any) => void) => {
  const { toast } = useToast();
  const navigate = useNavigate();

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
      
      // Navigation happens in the auth state change listener
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

  return {
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
};
