
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { BloodRequest, BloodType } from "@/types/admin";

interface UseRequestManagementProps {
  initialRequests: BloodRequest[];
}

export interface CreateRequestData {
  title: string;
  bloodType: BloodType;
  location: string;
  date: Date | undefined;
  description: string;
  isUrgent: boolean;
}

export const useRequestManagement = ({ initialRequests }: UseRequestManagementProps) => {
  const [requests, setRequests] = useState<BloodRequest[]>(initialRequests);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const { toast } = useToast();

  const handleCreateRequest = (requestData: CreateRequestData) => {
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

  return {
    requests,
    showNewRequestDialog,
    setShowNewRequestDialog,
    handleCreateRequest,
    handleMatchRequest,
    handleCompleteRequest,
    handleDeleteRequest
  };
};
