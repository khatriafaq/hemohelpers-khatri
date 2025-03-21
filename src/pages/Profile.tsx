
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProfileForm from "@/components/ProfileForm";

const Profile = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            
            <ProfileForm />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
