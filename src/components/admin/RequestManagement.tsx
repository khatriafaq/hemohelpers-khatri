
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

import { BloodRequest, BloodType } from "@/types/admin";
import { mockRequests } from "@/utils/mockData";
import RequestCard from "./request/RequestCard";
import CreateRequestDialog from "./request/CreateRequestDialog";
import EmptyRequestsState from "./request/EmptyRequestsState";

const RequestManagement = () => {
  const [requests, setRequests] = useState<BloodRequest[]>(mockRequests);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const { toast } = useToast();

  const handleCreateRequest = (requestData: {
    title: string;
    bloodType: BloodType;
    location: string;
    date: Date | undefined;
    description: string;
    isUrgent: boolean;
  }) => {
    const newRequest: BloodRequest = {
      id: (requests.length + 1).toString(),
      title: requestData.title,
      bloodType: requestData.bloodType,
      location: requestData.location,
      status: requestData.isUrgent ? "urgent" : "scheduled",
      deadline: requestData.date ? format(requestData.date, "MMM d, yyyy") : "Not specified",
      createdAt: format(new Date(), "MMM d, yyyy"),
      description: requestData.description,
      matched: false
    };

    setRequests([newRequest, ...requests]);
    setShowNewRequestDialog(false);

    toast({
      title: "Blood request created",
      description: `Your "${requestData.title}" blood request has been created successfully.`,
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blood Requests</h2>
        <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
          <Button className="rounded-full" onClick={() => setShowNewRequestDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Blood Request
          </Button>
          
          <CreateRequestDialog 
            onCancel={() => setShowNewRequestDialog(false)}
            onCreateRequest={handleCreateRequest}
          />
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
              {requests.length > 0 ? (
                requests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onMatchRequest={handleMatchRequest}
                    onCompleteRequest={handleCompleteRequest}
                    onDeleteRequest={handleDeleteRequest}
                  />
                ))
              ) : (
                <EmptyRequestsState onCreateRequest={() => setShowNewRequestDialog(true)} />
              )}
            </TabsContent>
            
            <TabsContent value="urgent" className="mt-0 space-y-4">
              {requests.filter(req => req.status === "urgent").length > 0 ? (
                requests
                  .filter(req => req.status === "urgent")
                  .map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onMatchRequest={handleMatchRequest}
                      onCompleteRequest={handleCompleteRequest}
                      onDeleteRequest={handleDeleteRequest}
                    />
                  ))
              ) : (
                <EmptyRequestsState 
                  onCreateRequest={() => setShowNewRequestDialog(true)} 
                  filter="urgent"
                />
              )}
            </TabsContent>
            
            <TabsContent value="scheduled" className="mt-0 space-y-4">
              {requests.filter(req => req.status === "scheduled").length > 0 ? (
                requests
                  .filter(req => req.status === "scheduled")
                  .map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onMatchRequest={handleMatchRequest}
                      onCompleteRequest={handleCompleteRequest}
                      onDeleteRequest={handleDeleteRequest}
                    />
                  ))
              ) : (
                <EmptyRequestsState 
                  onCreateRequest={() => setShowNewRequestDialog(true)} 
                  filter="scheduled"
                />
              )}
            </TabsContent>
            
            <TabsContent value="ongoing" className="mt-0 space-y-4">
              {requests.filter(req => req.status === "ongoing").length > 0 ? (
                requests
                  .filter(req => req.status === "ongoing")
                  .map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onMatchRequest={handleMatchRequest}
                      onCompleteRequest={handleCompleteRequest}
                      onDeleteRequest={handleDeleteRequest}
                    />
                  ))
              ) : (
                <EmptyRequestsState 
                  onCreateRequest={() => setShowNewRequestDialog(true)} 
                  filter="ongoing"
                />
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0 space-y-4">
              {requests.filter(req => req.status === "completed").length > 0 ? (
                requests
                  .filter(req => req.status === "completed")
                  .map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onMatchRequest={handleMatchRequest}
                      onCompleteRequest={handleCompleteRequest}
                      onDeleteRequest={handleDeleteRequest}
                    />
                  ))
              ) : (
                <EmptyRequestsState 
                  onCreateRequest={() => setShowNewRequestDialog(true)} 
                  filter="completed"
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestManagement;
