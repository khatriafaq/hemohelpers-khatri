
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import DonorSearch from "@/components/DonorSearch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search as SearchIcon, List } from "lucide-react";

const Search = () => {
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
            <h1 className="text-3xl font-bold mb-2">Find Blood Donors</h1>
            <p className="text-muted-foreground">
              Search for compatible blood donors in your area and connect with them directly.
            </p>
          </div>
          
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="list" className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <List className="mr-2 h-4 w-4" />
                List View
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                Map View
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="animate-fade-in">
              <DonorSearch />
            </TabsContent>
            
            <TabsContent value="map" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Map View</CardTitle>
                  <CardDescription>
                    This feature is coming soon. You'll be able to view donors on an interactive map.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 border border-dashed rounded-lg h-[400px] flex flex-col items-center justify-center p-4">
                    <SearchIcon className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Map View Coming Soon</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      We're working on an interactive map that will show donor locations. 
                      For now, please use the list view to find donors in your area.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default Search;
