
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto bg-destructive/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-6">
          <ShieldAlert className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You do not have permission to access this page. This area is restricted to authorized personnel only.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link to="/">Return Home</Link>
          </Button>
          <Button asChild className="bg-blood hover:bg-blood/90">
            <Link to="/profile">Go to Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
