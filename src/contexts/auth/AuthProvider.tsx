
import React from "react";
import AuthContext from "./AuthContext";
import { useAuthentication } from "./hooks/useAuthentication";
import { useAuthOperations } from "./hooks/useAuthOperations";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const {
    user,
    session,
    profile,
    isLoading,
    isAdmin,
    setProfile,
    refreshProfile
  } = useAuthentication();

  const {
    signIn,
    signUp,
    signOut,
    updateProfile
  } = useAuthOperations(user, setProfile);

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
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
