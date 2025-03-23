
import { Card, CardContent } from "@/components/ui/card";
import SignUpHeader from "@/components/auth/SignUpHeader";
import SignUpForm from "@/components/auth/SignUpForm";
import SignUpFooter from "@/components/auth/SignUpFooter";

const SignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4 py-10">
      <Card className="w-full max-w-md">
        <SignUpHeader />
        <CardContent>
          <SignUpForm />
        </CardContent>
        <SignUpFooter />
      </Card>
    </div>
  );
};

export default SignUp;
