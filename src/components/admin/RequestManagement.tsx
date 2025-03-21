
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, Droplet, MapPin, Plus, AlertTriangle, Check, MessageSquare, X, Clock3 } from "lucide-react";
import BloodTypeSelector from "@/components/ui/BloodTypeSelector";
import { useToast } from "@/hooks/use-toast";

// Mock blood request data
const mockRequests = [
  {
    id: "1",
    title: "Emergency Transfusion",
    bloodType: "O+",
    location: "San Francisco General Hospital",
    status: "urgent",
    deadline: "Today, 6:00 PM",
    createdAt: "Today, 10:24 AM",
    description: "Patient needs emergency blood transfusion after vehicle accident. Critical condition.",
    matched: false
  },
  {
    id: "2",
    title: "Scheduled Surgery",
    bloodType: "A-",
    location: "UCSF Medical Center",
    status: "scheduled",
    deadline: "Jul 24, 2023",
    createdAt: "Jul 10, 2023",
    description: "Blood needed for scheduled heart surgery. 2 donors required.",
    matched: true
  },
  {
    id: "3",
    title: "Leukemia Treatment",
    bloodType: "B+",
    location: "Stanford Medical Center",
    status: "ongoing",
    deadline: "Weekly until Aug 30",
    createdAt: "Jun 15, 2023",
    description: "Regular blood platelets needed for ongoing leukemia treatment.",
    matched: true
  },
  {
    id: "4",
    title: "Kidney Transplant",
    bloodType: "AB+",
    location: "Kaiser Permanente Medical Center",
    status: "scheduled",
    deadline: "Jul 18, 2023",
    createdAt: "Jul 5, 2023",
    description: "Blood needed for scheduled kidney transplant surgery.",
    matched: false
  },
  {
    id: "5",
    title: "Burn Treatment",
    bloodType: "O-",
    location: "Santa Clara Valley Medical Center",
    status: "urgent",
    deadline: "Tomorrow, 9:00 AM",
    createdAt: "Today, 2:15 PM",
    description: "Patient with severe burns needs universal donor blood.",
    matched: false
  }
];

type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

interface BloodRequest {
  id: string;
  title: string;
  bloodType: string;
  location: string;
  status: "urgent" | "scheduled" | "ongoing" | "completed";
  deadline: string;
  createdAt: string;
  description: string;
  matched: boolean;
}

const RequestManagement = () => {
  const [requests, setRequests] = useState<BloodRequest[]>(mockRequests);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [bloodType, setBloodType] = useState<BloodType>("O+");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isUrgent, setIsUrgent] = useState(false);
  const { toast } = useToast();

  const handleCreateRequest = () => {
    const newRequest = {
      id: (requests.length + 1).toString(),
      title,
      bloodType,
      location,
      status: isUrgent ? "urgent" : "scheduled",
      deadline: date ? format(date, "MMM d, yyyy") : "Not specified",
      createdAt: format(new Date(), "MMM d, yyyy"),
      description,
      matched: false
    } as BloodRequest;

    setRequests([newRequest, ...requests]);
    setShowNewRequestDialog(false);
    resetForm();

    toast({
      title: "Blood request created",
      description: `Your "${title}" blood request has been created successfully.`,
    });
  };

  const handleMatchRequest = (requestId: string) => {
    setRequests(
      requests.map(request =>
        request.id === requestId ? { ...request, matched: true } : request
      )
    );

    toast({
      title: "Donors matched",
      description: "Donors have been matched to this blood request.",
    });
  };

  const handleCompleteRequest = (requestId: string) => {
    setRequests(
      requests.map(request =>
        request.id === requestId ? { ...request, status: "completed" } : request
      )
    );

    toast({
      title: "Request completed",
      description: "Blood request has been marked as completed.",
    });
  };

  const handleDeleteRequest = (requestId: string) => {
    setRequests(requests.filter(request => request.id !== requestId));

    toast({
      title: "Request deleted",
      description: "Blood request has been deleted.",
    });
  };

  const resetForm = () => {
    setTitle("");
    setBloodType("O+");
    setLocation("");
    setDescription("");
    setDate(new Date());
    setIsUrgent(false);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "urgent":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex gap-1 items-center">
            <AlertTriangle className="h-3 w-3" />
            Urgent
          </Badge>
        );
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex gap-1 items-center">
            <Calendar className="h-3 w-3" />
            Scheduled
          </Badge>
        );
      case "ongoing":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100 flex gap-1 items-center">
            <Clock className="h-3 w-3" />
            Ongoing
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 flex gap-1 items-center">
            <Check className="h-3 w-3" />
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blood Requests</h2>
        <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
          <DialogTrigger asChild>
            <Button className="rounded-full">
              <Plus className="h-4 w-4 mr-2" />
              New Blood Request
            </Button>
          </DialogTrigger>
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
              <Button variant="outline" onClick={() => setShowNewRequestDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateRequest}
                disabled={!title || !bloodType || !location || !description}
                className={isUrgent ? "bg-destructive hover:bg-destructive/90" : ""}
              >
                Create Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="urgent">Urgent</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0 space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{request.title}</CardTitle>
                          {renderStatusBadge(request.status)}
                        </div>
                        <CardDescription className="mt-1">
                          Created: {request.createdAt}
                        </CardDescription>
                      </div>
                      <div className="rounded-full bg-blood-light px-4 py-1.5 text-blood font-semibold">
                        {request.bloodType}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="space-y-3">
                      <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{request.location}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                        <Clock3 className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>Deadline: {request.deadline}</span>
                      </div>
                      <p className="text-sm">{request.description}</p>
                      
                      {request.matched && (
                        <div className="mt-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Check className="h-3 w-3 mr-1" />
                            Donors Matched
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 pt-2 gap-2">
                    {!request.matched ? (
                      <Button 
                        variant="outline" 
                        className="w-1/2" 
                        size="sm"
                        onClick={() => handleMatchRequest(request.id)}
                      >
                        Match Donors
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-1/2" 
                        size="sm"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message Donors
                      </Button>
                    )}
                    
                    <div className="flex gap-2 w-1/2 justify-end">
                      {request.status !== "completed" && (
                        <Button 
                          className="bg-green-600 hover:bg-green-700 text-white flex-1" 
                          size="sm"
                          onClick={() => handleCompleteRequest(request.id)}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Complete
                        </Button>
                      )}
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="flex-1 sm:flex-none"
                        onClick={() => handleDeleteRequest(request.id)}
                      >
                        <X className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
              
              {requests.length === 0 && (
                <div className="text-center py-12">
                  <Droplet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No blood requests found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    There are currently no blood donation requests. Create a new request using the button above.
                  </p>
                  <Button onClick={() => setShowNewRequestDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Request
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Similar TabsContent blocks for filtered views */}
            <TabsContent value="urgent" className="mt-0 space-y-4">
              {/* Filter by urgent requests */}
              {requests.filter(req => req.status === "urgent").length > 0 ? (
                requests
                  .filter(req => req.status === "urgent")
                  .map((request) => (
                    // Same card structure as above
                    <Card key={request.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">{request.title}</CardTitle>
                              {renderStatusBadge(request.status)}
                            </div>
                            <CardDescription className="mt-1">
                              Created: {request.createdAt}
                            </CardDescription>
                          </div>
                          <div className="rounded-full bg-blood-light px-4 py-1.5 text-blood font-semibold">
                            {request.bloodType}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="space-y-3">
                          <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                            <span>{request.location}</span>
                          </div>
                          <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                            <Clock3 className="h-4 w-4 mt-0.5 shrink-0" />
                            <span>Deadline: {request.deadline}</span>
                          </div>
                          <p className="text-sm">{request.description}</p>
                          
                          {request.matched && (
                            <div className="mt-2">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="h-3 w-3 mr-1" />
                                Donors Matched
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between p-4 pt-2 gap-2">
                        {!request.matched ? (
                          <Button 
                            variant="outline" 
                            className="w-1/2"
                            size="sm"
                            onClick={() => handleMatchRequest(request.id)}
                          >
                            Match Donors
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="w-1/2" 
                            size="sm"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message Donors
                          </Button>
                        )}
                        
                        <div className="flex gap-2 w-1/2 justify-end">
                          {request.status !== "completed" && (
                            <Button 
                              className="bg-green-600 hover:bg-green-700 text-white flex-1" 
                              size="sm"
                              onClick={() => handleCompleteRequest(request.id)}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Complete
                            </Button>
                          )}
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="flex-1 sm:flex-none"
                            onClick={() => handleDeleteRequest(request.id)}
                          >
                            <X className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No urgent requests</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    There are currently no urgent blood donation requests.
                  </p>
                  <Button onClick={() => setShowNewRequestDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Request
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Repeat similar structure for other tabs (scheduled, ongoing, completed) */}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestManagement;
