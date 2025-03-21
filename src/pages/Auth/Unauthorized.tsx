
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-muted/20">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="bg-destructive/10 p-4 rounded-full mb-6">
              <ShieldAlert className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground mt-2 mb-6">
              You don't have permission to access this page.
              Only administrators can access the admin dashboard.
            </p>
            
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Go Back
              </Button>
              <Button onClick={() => navigate("/")}>
                Return Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Unauthorized;
