
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Check, X, Eye, UserCheck, UserX, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    bloodType: "O+",
    location: "San Francisco, CA",
    status: "verified",
    registeredDate: "April 15, 2023",
    documents: ["ID Card", "Blood Test Report"]
  },
  {
    id: "2",
    name: "Emma Johnson",
    email: "emma.johnson@example.com",
    bloodType: "A-",
    location: "Oakland, CA",
    status: "pending",
    registeredDate: "June 22, 2023",
    documents: ["ID Card", "Medical Certificate"]
  },
  {
    id: "3",
    name: "Michael Davis",
    email: "michael.davis@example.com",
    bloodType: "B+",
    location: "San Jose, CA",
    status: "rejected",
    registeredDate: "May 10, 2023",
    documents: ["Driver's License"]
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    bloodType: "AB+",
    location: "Palo Alto, CA",
    status: "pending",
    registeredDate: "July 3, 2023",
    documents: ["Passport", "Blood Test Report"]
  },
  {
    id: "5",
    name: "Robert Taylor",
    email: "robert.taylor@example.com",
    bloodType: "O-",
    location: "Berkeley, CA",
    status: "verified",
    registeredDate: "March 28, 2023",
    documents: ["ID Card", "Medical Certificate"]
  }
];

const UserManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bloodType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVerifyUser = (userId: string) => {
    setUsers(
      users.map(user =>
        user.id === userId ? { ...user, status: "verified" } : user
      )
    );
    toast({
      title: "User verified",
      description: "User profile has been verified successfully.",
    });
    setShowDialog(false);
  };

  const handleRejectUser = (userId: string) => {
    setUsers(
      users.map(user =>
        user.id === userId ? { ...user, status: "rejected" } : user
      )
    );
    toast({
      title: "User rejected",
      description: "User profile has been rejected.",
    });
    setShowDialog(false);
  };

  const handleBanUser = (userId: string) => {
    setUsers(
      users.map(user =>
        user.id === userId ? { ...user, status: "banned" } : user
      )
    );
    toast({
      title: "User banned",
      description: "User has been banned from the platform.",
    });
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      case "banned":
        return <Badge variant="destructive">Banned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Verify, reject, or ban users from the platform.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-[200px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-secondary text-secondary-foreground">
                                  {user.name.split(" ").map(part => part[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="rounded-full bg-blood-light px-2.5 py-1 text-xs font-semibold text-blood inline-block">
                              {user.bloodType}
                            </div>
                          </TableCell>
                          <TableCell>{user.location}</TableCell>
                          <TableCell>{renderStatusBadge(user.status)}</TableCell>
                          <TableCell>{user.registeredDate}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog open={showDialog && selectedUser?.id === user.id} onOpenChange={(open) => {
                                setShowDialog(open);
                                if (!open) setSelectedUser(null);
                              }}>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setShowDialog(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>User Profile - {selectedUser?.name}</DialogTitle>
                                    <DialogDescription>
                                      Review user documents and information before verification.
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  {selectedUser && (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="text-sm font-medium mb-1">Full Name</h4>
                                          <p>{selectedUser.name}</p>
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-medium mb-1">Email</h4>
                                          <p>{selectedUser.email}</p>
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-medium mb-1">Blood Type</h4>
                                          <p>{selectedUser.bloodType}</p>
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-medium mb-1">Location</h4>
                                          <p>{selectedUser.location}</p>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <h4 className="text-sm font-medium mb-2">Documents</h4>
                                        <div className="border rounded-lg p-3 space-y-3">
                                          {selectedUser.documents.map((doc: string, index: number) => (
                                            <div key={index} className="flex items-center justify-between">
                                              <div className="flex items-center gap-2">
                                                <div className="size-8 bg-secondary rounded flex items-center justify-center">
                                                  <span className="text-xs">PDF</span>
                                                </div>
                                                <span>{doc}</span>
                                              </div>
                                              <Button variant="ghost" size="sm">View</Button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <DialogFooter className="flex justify-between sm:justify-between">
                                    <Button 
                                      variant="destructive" 
                                      onClick={() => handleRejectUser(selectedUser?.id)}
                                      disabled={selectedUser?.status === "rejected" || selectedUser?.status === "banned"}
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                    <Button 
                                      onClick={() => handleVerifyUser(selectedUser?.id)}
                                      disabled={selectedUser?.status === "verified" || selectedUser?.status === "banned"}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <Check className="h-4 w-4 mr-2" />
                                      Verify
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              {user.status === "pending" && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => handleVerifyUser(user.id)}
                                >
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                              )}
                              
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleBanUser(user.id)}
                                disabled={user.status === "banned"}
                              >
                                <UserX className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No users found matching your search criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="mt-0">
              {/* Similar table but filtered for pending users */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.filter(user => user.status === "pending").length > 0 ? (
                      filteredUsers.filter(user => user.status === "pending").map((user) => (
                        <TableRow key={user.id}>
                          {/* Same as above row content */}
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-secondary text-secondary-foreground">
                                  {user.name.split(" ").map(part => part[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="rounded-full bg-blood-light px-2.5 py-1 text-xs font-semibold text-blood inline-block">
                              {user.bloodType}
                            </div>
                          </TableCell>
                          <TableCell>{user.location}</TableCell>
                          <TableCell>{renderStatusBadge(user.status)}</TableCell>
                          <TableCell>{user.registeredDate}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowDialog(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleVerifyUser(user.id)}
                              >
                                <UserCheck className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleRejectUser(user.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No pending users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Similar TabsContent blocks for verified and rejected tabs */}
            <TabsContent value="verified" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.filter(user => user.status === "verified").length > 0 ? (
                      filteredUsers.filter(user => user.status === "verified").map((user) => (
                        <TableRow key={user.id}>
                          {/* Same as above row content */}
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-secondary text-secondary-foreground">
                                  {user.name.split(" ").map(part => part[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="rounded-full bg-blood-light px-2.5 py-1 text-xs font-semibold text-blood inline-block">
                              {user.bloodType}
                            </div>
                          </TableCell>
                          <TableCell>{user.location}</TableCell>
                          <TableCell>{renderStatusBadge(user.status)}</TableCell>
                          <TableCell>{user.registeredDate}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowDialog(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleBanUser(user.id)}
                              >
                                <UserX className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No verified users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="rejected" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.filter(user => user.status === "rejected").length > 0 ? (
                      filteredUsers.filter(user => user.status === "rejected").map((user) => (
                        <TableRow key={user.id}>
                          {/* Same as above row content */}
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-secondary text-secondary-foreground">
                                  {user.name.split(" ").map(part => part[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="rounded-full bg-blood-light px-2.5 py-1 text-xs font-semibold text-blood inline-block">
                              {user.bloodType}
                            </div>
                          </TableCell>
                          <TableCell>{user.location}</TableCell>
                          <TableCell>{renderStatusBadge(user.status)}</TableCell>
                          <TableCell>{user.registeredDate}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowDialog(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleVerifyUser(user.id)}
                              >
                                <UserCheck className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No rejected users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
