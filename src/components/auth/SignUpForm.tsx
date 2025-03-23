
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, MapPin } from "lucide-react";
import BloodTypeSelector from "@/components/ui/BloodTypeSelector";

interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  bloodType: string;
  location: string;
}

const SignUpForm = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    bloodType: "O+",
    location: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBloodTypeChange = (value: any) => {
    setFormData((prev) => ({ ...prev, bloodType: value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const userData = {
        full_name: formData.fullName,
        blood_type: formData.bloodType,
        location: formData.location,
      };

      const { error } = await signUp(formData.email, formData.password, userData);
      
      if (!error) {
        navigate("/auth/thank-you");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="fullName"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            className="pl-9"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="pl-9"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            className="pl-9"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="********"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="pl-9"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Blood Type</Label>
        <BloodTypeSelector
          value={formData.bloodType}
          onChange={handleBloodTypeChange}
          className="grid-cols-4"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="location"
            name="location"
            placeholder="City, State"
            value={formData.location}
            onChange={handleChange}
            className="pl-9"
            required
          />
        </div>
      </div>
      
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full bg-blood hover:bg-blood/90" 
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Sign Up"}
      </Button>
    </form>
  );
};

export default SignUpForm;
