
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import SignInForm from "@/components/auth/SignInForm";
import { Droplet } from "lucide-react";

const SignIn = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  return (
    <main className="min-h-screen bg-muted/20">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-md mx-auto px-4">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Droplet className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
            <p className="text-muted-foreground text-center mt-2">
              Sign in to access the admin dashboard
            </p>
          </div>
          
          <SignInForm />
        </div>
      </div>
    </main>
  );
};

export default SignIn;
