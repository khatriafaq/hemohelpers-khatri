
import { Droplet } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SignUpHeader = () => {
  return (
    <CardHeader className="space-y-3 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-primary/10 p-3">
          <Droplet className="h-10 w-10 text-blood" />
        </div>
      </div>
      <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
      <CardDescription>
        Join our community of blood donors and help save lives
      </CardDescription>
    </CardHeader>
  );
};

export default SignUpHeader;
