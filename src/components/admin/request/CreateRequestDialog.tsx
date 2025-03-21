
import { useState } from "react";
import { BloodType } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, MapPin, AlertTriangle } from "lucide-react";
import BloodTypeSelector from "@/components/ui/BloodTypeSelector";

interface CreateRequestDialogProps {
  onCancel: () => void;
  onCreateRequest: (requestData: {
    title: string;
    bloodType: BloodType;
    location: string;
    date: Date | undefined;
    description: string;
    isUrgent: boolean;
  }) => void;
}

const CreateRequestDialog = ({ onCancel, onCreateRequest }: CreateRequestDialogProps) => {
  const [title, setTitle] = useState("");
  const [bloodType, setBloodType] = useState<BloodType>("O+");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isUrgent, setIsUrgent] = useState(false);

  const handleSubmit = () => {
    onCreateRequest({
      title,
      bloodType,
      location,
      date,
      description,
      isUrgent
    });
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create New Blood Request</DialogTitle>
        <DialogDescription>
          Fill out the details below to create a new blood donation request.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="title">Request Title</Label>
          <Input
            id="title"
            placeholder="E.g., Emergency Transfusion"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Blood Type</Label>
          <BloodTypeSelector
            value={bloodType}
            onChange={(value) => setBloodType(value as BloodType)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="location"
              placeholder="Hospital or clinic name"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Deadline</Label>
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Provide details about the blood request"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex h-5 items-center space-x-2">
            <input
              type="checkbox"
              id="urgent"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blood focus:ring-blood"
            />
          </div>
          <div className="leading-none">
            <label
              htmlFor="urgent"
              className="text-sm font-medium flex items-center gap-1 cursor-pointer"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
              Mark as Urgent
            </label>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!title || !bloodType || !location || !description}
          className={isUrgent ? "bg-destructive hover:bg-destructive/90" : ""}
        >
          Create Request
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CreateRequestDialog;
