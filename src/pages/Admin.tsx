
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminDashboard from "@/components/admin/AdminDashboard";
import UserManagement from "@/components/admin/UserManagement";
import RequestManagement from "@/components/admin/RequestManagement";
import { ShieldCheck, Users, Droplet } from "lucide-react";
import { useAuth } from "@/contexts/auth";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isAdmin } = useAuth();

  // Debug output
  console.log("Admin page rendered, isAdmin:", isAdmin);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-muted/20">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="page-container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage users, verify profiles, activate/deactivate accounts, and handle blood donation requests.
            </p>
          </div>
          
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="mr-2 h-4 w-4" />
                User Management
              </TabsTrigger>
              <TabsTrigger 
                value="requests" 
                className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Droplet className="mr-2 h-4 w-4" />
                Blood Requests
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
              <AdminDashboard />
            </TabsContent>
            
            <TabsContent value="users" className="animate-fade-in">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="requests" className="animate-fade-in">
              <RequestManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default Admin;
