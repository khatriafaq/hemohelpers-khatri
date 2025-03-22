
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const PendingApproval = () => {
  const { signOut } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <Clock className="h-10 w-10 text-yellow-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Account Pending Approval</CardTitle>
          <CardDescription>
            Your account is currently awaiting approval from our administrators.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            We'll send you an email notification once your account has been approved. 
            This usually takes 24-48 hours.
          </p>
          <p className="text-muted-foreground">
            If you believe this is an error or have any questions, please contact our support team.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 p-6">
          <Button asChild variant="outline">
            <Link to="/">Return Home</Link>
          </Button>
          <Button 
            variant="secondary"
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PendingApproval;
