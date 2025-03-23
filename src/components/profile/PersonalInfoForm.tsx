
import { Separator } from "@/components/ui/separator";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./ProfileForm";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import BloodTypeSelector from "@/components/ui/BloodTypeSelector";
import { ContactInfoForm } from "./ContactInfoForm";
import { ProfilePreferences } from "./ProfilePreferences";

interface PersonalInfoFormProps {
  form: UseFormReturn<ProfileFormValues>;
}

export default function PersonalInfoForm({ form }: PersonalInfoFormProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age</FormLabel>
            <FormControl>
              <Input placeholder="Enter your age" {...field} />
            </FormControl>
            <FormDescription>
              You must be at least 18 years old to register as a donor.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="bloodType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Blood Type</FormLabel>
            <FormControl>
              <BloodTypeSelector
                value={field.value as any}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Your city" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region/State (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Your region" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <Separator className="my-4" />
      
      <ContactInfoForm form={form} />
      
      <Separator className="my-4" />
      
      <ProfilePreferences form={form} />
    </div>
  );
}
