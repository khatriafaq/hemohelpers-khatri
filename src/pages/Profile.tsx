
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ProfileForm } from "@/components/profile";
import { useAuth } from "@/contexts/auth";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth/sign-in');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blood" />
        <p className="ml-2 text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-muted/20">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="page-container">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">Your Donor Profile</h1>
              <p className="text-muted-foreground">
                Complete your profile information to be discoverable by those in need of blood donations.
              </p>
            </div>
            
            {profile && <ProfileForm />}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
