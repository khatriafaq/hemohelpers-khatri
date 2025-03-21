
export interface UserSession {
  id: string;
  email: string;
  full_name?: string;
  is_admin: boolean;
  is_verified: boolean;
}

export interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
}
