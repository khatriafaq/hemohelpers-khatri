
import { Link } from "react-router-dom";
import { CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SignUpFooter = () => {
  return (
    <>
      <Separator />
      <CardFooter className="flex justify-center p-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/auth/sign-in" className="text-primary font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </CardFooter>
    </>
  );
};

export default SignUpFooter;
