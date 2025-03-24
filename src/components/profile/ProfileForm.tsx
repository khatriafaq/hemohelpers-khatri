
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import PersonalInfoForm from "./PersonalInfoForm";
import VerificationDocuments from "./VerificationDocuments";
import { useAuth } from "@/contexts/auth";

// Profile form schema - we'll use this across multiple components
export const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 18, {
    message: "You must be at least 18 years old to register.",
  }),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  city: z.string().min(2, { message: "City is required" }),
  region: z.string().optional(),
  orakh: z.string().min(1, { message: "Orakh is required" }),
  familyCardNumber: z.string().min(1, { message: "Family Card Number is required" }),
  isAvailable: z.boolean().default(true),
  showContactDetails: z.boolean().default(false),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const [tab, setTab] = useState("personal");
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);
  const { toast } = useToast();
  const { updateProfile, profile } = useAuth();

  console.log("Current profile data:", profile);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile?.name || "",
      age: profile?.age?.toString() || "",
      bloodType: profile?.blood_type || "O+",
      city: profile?.city || "",
      region: profile?.region || "",
      orakh: profile?.orakh || "",
      familyCardNumber: profile?.family_card_number || "",
      isAvailable: profile?.is_available ?? true,
      showContactDetails: profile?.show_contact_details ?? false,
      email: profile?.email || "",
      phone: profile?.phone || "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    console.log("Submitting profile data:", data);
    
    try {
      // Transform form data to match the expected format
      const profileData = {
        name: data.name,
        age: parseInt(data.age),
        blood_type: data.bloodType,
        city: data.city,
        region: data.region,
        orakh: data.orakh,
        family_card_number: data.familyCardNumber,
        is_available: data.isAvailable,
        show_contact_details: data.showContactDetails,
        email: data.email,
        phone: data.phone,
      };
      
      const result = await updateProfile(profileData);
      console.log("Profile update result:", result);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
        variant: "destructive"
      });
    }
  }

  return (
    <div className="form-container">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="personal" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="h-4 w-4 mr-2" />
            Personal Information
          </TabsTrigger>
          <TabsTrigger value="verification" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Shield className="h-4 w-4 mr-2" />
            Verification Documents
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and preferences. This information will be used to match you with donors or recipients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <PersonalInfoForm form={form} />
                  
                  <Button type="submit" className="w-full rounded-lg">
                    Save Profile
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="verification" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Verification Documents</CardTitle>
              <CardDescription>
                Upload your identification and blood type proof documents for verification. All documents will be reviewed by our team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <VerificationDocuments 
                uploadedDocuments={uploadedDocuments} 
                setUploadedDocuments={setUploadedDocuments}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setTab("personal")}>
                Back to Personal Info
              </Button>
              <Button>
                Submit for Verification
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
