
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./ProfileForm";
import { FormField, FormItem, FormLabel, FormDescription, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { CalendarClock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface ProfilePreferencesProps {
  form: UseFormReturn<ProfileFormValues>;
}

export default function ProfilePreferences({ form }: ProfilePreferencesProps) {
  const { toast } = useToast();
  
  useEffect(() => {
    // Notify user that these preferences are saved locally only
    toast({
      title: "Note about preferences",
      description: "Availability and contact visibility preferences are temporarily stored locally only.",
      duration: 5000,
    });
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Preferences</h3>
      <div className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="isAvailable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base flex items-center">
                  <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                  Available for Donation
                </FormLabel>
                <FormDescription>
                  Set your current availability status for blood donation.
                  <span className="text-muted-foreground text-xs block mt-1">(Currently stored locally only)</span>
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="showContactDetails"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Show Contact Details</FormLabel>
                <FormDescription>
                  Allow others to see your contact information in search results.
                  <span className="text-muted-foreground text-xs block mt-1">(Currently stored locally only)</span>
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
