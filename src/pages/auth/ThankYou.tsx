
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const ThankYou = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Thank You for Signing Up!</CardTitle>
          <CardDescription>
            Your account has been created and is pending approval from our administrators.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            We'll send you an email notification once your account has been approved. 
            This usually takes 24-48 hours.
          </p>
          <p className="text-muted-foreground">
            In the meantime, you can explore our website to learn more about blood donation 
            and how you can help save lives.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 p-6">
          <Button asChild variant="outline">
            <Link to="/">Return Home</Link>
          </Button>
          <Button asChild className="bg-blood hover:bg-blood/90">
            <Link to="/auth/sign-in">Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ThankYou;
