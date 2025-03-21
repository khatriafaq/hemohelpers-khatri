
import { BloodRequest } from "@/types/admin";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock3, Check, MessageSquare, X } from "lucide-react";
import { renderStatusBadge } from "./request-utils";

interface RequestCardProps {
  request: BloodRequest;
  onMatchRequest: (requestId: string) => void;
  onCompleteRequest: (requestId: string) => void;
  onDeleteRequest: (requestId: string) => void;
}

const RequestCard = ({ 
  request, 
  onMatchRequest, 
  onCompleteRequest, 
  onDeleteRequest 
}: RequestCardProps) => {
  return (
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
            onClick={() => onMatchRequest(request.id)}
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
              onClick={() => onCompleteRequest(request.id)}
            >
              <Check className="h-4 w-4 mr-2" />
              Complete
            </Button>
          )}
          <Button 
            variant="destructive" 
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={() => onDeleteRequest(request.id)}
          >
            <X className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RequestCard;
