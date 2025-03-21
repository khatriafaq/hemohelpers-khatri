
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { BarChart, BarChartHorizontal, Bell, Check, ChevronDown, Download, FileText, MoreHorizontal, Plus, Search, Shield, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import BloodTypeSelector from "@/components/ui/BloodTypeSelector";
import { useToast } from "@/hooks/use-toast";

const mockVerificationRequests = [
  { 
    id: "1", 
    name: "John Smith", 
    email: "john.smith@example.com", 
    bloodType: "O+",
    createdAt: "2023-09-15T14:30:00",
    documents: ["ID Card.pdf", "Medical Report.pdf"]
  },
  { 
    id: "2", 
    name: "Emma Johnson", 
    email: "emma.johnson@example.com", 
    bloodType: "A-",
    createdAt: "2023-09-16T11:15:00",
    documents: ["ID Card.jpg", "Blood Test Results.pdf"]
  },
  { 
    id: "3", 
    name: "Michael Davis", 
    email: "michael.davis@example.com", 
    bloodType: "B+",
    createdAt: "2023-09-16T16:45:00",
    documents: ["Driver's License.pdf", "Medical Certificate.pdf"]
  }
];

const mockStats = {
  totalDonors: 2100,
  totalRecipients: 1850,
  pendingVerifications: 3,
  activeDonors: 1450,
  urgentRequests: 5,
  totalDonations: 8250,
  bloodTypeDistribution: [
    { type: "A+", count: 620 },
    { type: "A-", count: 185 },
    { type: "B+", count: 395 },
    { type: "B-", count: 120 },
    { type: "AB+", count: 145 },
    { type: "AB-", count: 80 },
    { type: "O+", count: 405 },
    { type: "O-", count: 150 }
  ],
  recentActivity: [
    { type: "verification", user: "Sarah Wilson", time: "1 hour ago" },
    { type: "donation", user: "Robert Taylor", time: "3 hours ago" },
    { type: "request", user: "Jennifer Brown", time: "5 hours ago" },
    { type: "registration", user: "David Miller", time: "Yesterday" }
  ]
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [urgentRequestDialogOpen, setUrgentRequestDialogOpen] = useState(false);
  const [urgentRequestForm, setUrgentRequestForm] = useState({
    bloodType: "O+" as any,
    hospitalName: "",
    details: "",
    urgency: "high"
  });
  const { toast } = useToast();
  
  const handleVerify = (id: string, approved: boolean) => {
    toast({
      title: approved ? "User verified" : "User rejected",
      description: approved 
        ? "The user has been verified and can now use the platform." 
        : "The user verification has been rejected.",
    });
  };
  
  const handleUrgentRequestSubmit = () => {
    console.log("Urgent request:", urgentRequestForm);
    
    toast({
      title: "Urgent request published",
      description: `Urgent request for ${urgentRequestForm.bloodType} blood at ${urgentRequestForm.hospitalName} has been published.`,
    });
    
    setUrgentRequestDialogOpen(false);
    setUrgentRequestForm({
      bloodType: "O+",
      hospitalName: "",
      details: "",
      urgency: "high"
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, verification requests, and urgent blood donation needs.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={urgentRequestDialogOpen} onOpenChange={setUrgentRequestDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blood hover:bg-blood/90 text-white">
                <Bell className="h-4 w-4 mr-2" />
                Post Urgent Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Post Urgent Blood Request</DialogTitle>
                <DialogDescription>
                  Create an urgent blood donation request that will notify eligible donors in the area.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Blood Type Needed</Label>
                  <BloodTypeSelector
                    value={urgentRequestForm.bloodType}
                    onChange={(value) => setUrgentRequestForm(prev => ({ ...prev, bloodType: value }))}
                    className="grid-cols-4"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hospital-name">Hospital Name & Location</Label>
                  <Input
                    id="hospital-name"
                    placeholder="e.g., San Francisco General Hospital"
                    value={urgentRequestForm.hospitalName}
                    onChange={(e) => setUrgentRequestForm(prev => ({ ...prev, hospitalName: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="request-details">Request Details</Label>
                  <Textarea
                    id="request-details"
                    placeholder="Please provide additional details about the urgent need..."
                    value={urgentRequestForm.details}
                    onChange={(e) => setUrgentRequestForm(prev => ({ ...prev, details: e.target.value }))}
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Urgency Level</Label>
                  <div className="flex space-x-2">
                    {["high", "medium", "low"].map((level) => (
                      <Button
                        key={level}
                        type="button"
                        variant={urgentRequestForm.urgency === level ? "default" : "outline"}
                        className={
                          urgentRequestForm.urgency === level
                            ? level === "high"
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : level === "medium"
                              ? "bg-orange-500 hover:bg-orange-600 text-white"
                              : "bg-yellow-500 hover:bg-yellow-600 text-white"
                            : ""
                        }
                        onClick={() => setUrgentRequestForm(prev => ({ ...prev, urgency: level }))}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setUrgentRequestDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-blood hover:bg-blood/90 text-white"
                  onClick={handleUrgentRequestSubmit}
                  disabled={!urgentRequestForm.hospitalName || !urgentRequestForm.bloodType}
                >
                  Publish Urgent Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export Users List</DropdownMenuItem>
              <DropdownMenuItem>Export Donation History</DropdownMenuItem>
              <DropdownMenuItem>Export Statistics Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="dashboard">
            <BarChart className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="verifications">
            <Shield className="h-4 w-4 mr-2" />
            Verifications
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Total Donors</CardTitle>
                <CardDescription>Active blood donors in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockStats.totalDonors.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {mockStats.activeDonors.toLocaleString()} currently active
                </div>
                <div className="h-1 w-full bg-muted mt-3 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${(mockStats.activeDonors / mockStats.totalDonors) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Total Recipients</CardTitle>
                <CardDescription>People who received donations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockStats.totalRecipients.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {mockStats.urgentRequests} urgent requests pending
                </div>
                <div className="h-1 w-full bg-muted mt-3 rounded-full overflow-hidden">
                  <div className="h-full bg-blood rounded-full" style={{ width: "85%" }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Total Donations</CardTitle>
                <CardDescription>Successful blood donations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockStats.totalDonations.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  ~{(mockStats.totalDonations / 12).toFixed(0)} donations monthly
                </div>
                <div className="h-1 w-full bg-muted mt-3 rounded-full overflow-hidden">
                  <div className="h-full bg-medical-blue rounded-full" style={{ width: "70%" }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Blood Type Distribution</CardTitle>
                <CardDescription>Distribution of donors by blood type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStats.bloodTypeDistribution.map(item => (
                    <div key={item.type} className="flex items-center">
                      <div className="w-10 h-10 rounded-md flex items-center justify-center bg-blood-light text-blood font-semibold mr-3">
                        {item.type}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{item.type}</span>
                          <span className="text-sm text-muted-foreground">{item.count} donors</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blood rounded-full" 
                            style={{ width: `${(item.count / mockStats.totalDonors) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions on the platform</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[300px]">
                  <div className="px-6">
                    {mockStats.recentActivity.map((activity, i) => (
                      <div key={i} className="py-3 border-b last:border-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge variant="outline" className="mb-1">
                              {activity.type}
                            </Badge>
                            <p className="font-medium">{activity.user}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="verifications" className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Verification Requests</CardTitle>
                  <CardDescription>
                    Review and approve user identity and blood type verification requests
                  </CardDescription>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockVerificationRequests.length > 0 ? (
                  mockVerificationRequests.map(request => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {request.name.split(" ").map(part => part[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{request.name}</h3>
                            <p className="text-sm text-muted-foreground">{request.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blood-light flex items-center justify-center">
                            <span className="font-medium text-blood">{request.bloodType}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Requested {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex gap-2 flex-wrap">
                          {request.documents.map((doc, i) => (
                            <Button key={i} variant="outline" size="sm" className="h-8">
                              <FileText className="h-3.5 w-3.5 mr-1.5" />
                              {doc}
                            </Button>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleVerify(request.id, false)}
                          >
                            <X className="h-4 w-4 mr-1.5" />
                            Reject
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleVerify(request.id, true)}
                          >
                            <Check className="h-4 w-4 mr-1.5" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="rounded-full bg-muted w-12 h-12 mx-auto flex items-center justify-center mb-4">
                      <Shield className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No pending verification requests</h3>
                    <p className="text-muted-foreground mt-1">All user verification requests have been processed</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {mockVerificationRequests.length} verification requests
              </div>
              <Button variant="outline" size="sm">
                View All Verification History
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="animate-fade-in">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage all registered users on the platform
                  </CardDescription>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="pl-9"
                    />
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 p-4 bg-muted/50">
                  <div className="col-span-5 font-medium">User</div>
                  <div className="col-span-2 font-medium">Blood Type</div>
                  <div className="col-span-2 font-medium">Status</div>
                  <div className="col-span-2 font-medium">Role</div>
                  <div className="col-span-1 font-medium text-right">Actions</div>
                </div>
                
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-12 p-4 border-t items-center">
                    <div className="col-span-5 flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {["JS", "EJ", "MD", "SW", "RT"][i]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {["John Smith", "Emma Johnson", "Michael Davis", "Sarah Wilson", "Robert Taylor"][i]}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {[
                            "john.smith@example.com",
                            "emma.johnson@example.com",
                            "michael.davis@example.com",
                            "sarah.wilson@example.com",
                            "robert.taylor@example.com",
                          ][i]}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="h-8 w-8 rounded-full bg-blood-light flex items-center justify-center">
                        <span className="font-medium text-blood">
                          {["O+", "A-", "B+", "AB+", "O-"][i]}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Badge variant={i % 3 === 0 ? "outline" : "default"} className={i % 3 === 0 ? "" : "bg-green-100 text-green-800 hover:bg-green-100"}>
                        {i % 3 === 0 ? "Pending" : "Verified"}
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <Badge variant="outline">
                        {i === 0 ? "Admin" : "Donor"}
                      </Badge>
                    </div>
                    <div className="col-span-1 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit User</DropdownMenuItem>
                          <DropdownMenuItem>Disable Account</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing 5 of 2,100 users
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
