
import { BloodRequest } from "@/types/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabContent from "./TabContent";

interface RequestTabsProps {
  requests: BloodRequest[];
  onMatchRequest: (requestId: string) => void;
  onCompleteRequest: (requestId: string) => void;
  onDeleteRequest: (requestId: string) => void;
  onCreateRequest: () => void;
}

const RequestTabs = ({
  requests,
  onMatchRequest,
  onCompleteRequest,
  onDeleteRequest,
  onCreateRequest
}: RequestTabsProps) => {
  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-6">
        <TabsTrigger value="all">All Requests</TabsTrigger>
        <TabsTrigger value="urgent">Urgent</TabsTrigger>
        <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <TabContent
          requests={requests}
          onMatchRequest={onMatchRequest}
          onCompleteRequest={onCompleteRequest}
          onDeleteRequest={onDeleteRequest}
          onCreateRequest={onCreateRequest}
        />
      </TabsContent>
      
      <TabsContent value="urgent">
        <TabContent
          requests={requests}
          filter="urgent"
          onMatchRequest={onMatchRequest}
          onCompleteRequest={onCompleteRequest}
          onDeleteRequest={onDeleteRequest}
          onCreateRequest={onCreateRequest}
        />
      </TabsContent>
      
      <TabsContent value="scheduled">
        <TabContent
          requests={requests}
          filter="scheduled"
          onMatchRequest={onMatchRequest}
          onCompleteRequest={onCompleteRequest}
          onDeleteRequest={onDeleteRequest}
          onCreateRequest={onCreateRequest}
        />
      </TabsContent>
      
      <TabsContent value="ongoing">
        <TabContent
          requests={requests}
          filter="ongoing"
          onMatchRequest={onMatchRequest}
          onCompleteRequest={onCompleteRequest}
          onDeleteRequest={onDeleteRequest}
          onCreateRequest={onCreateRequest}
        />
      </TabsContent>
      
      <TabsContent value="completed">
        <TabContent
          requests={requests}
          filter="completed"
          onMatchRequest={onMatchRequest}
          onCompleteRequest={onCompleteRequest}
          onDeleteRequest={onDeleteRequest}
          onCreateRequest={onCreateRequest}
        />
      </TabsContent>
    </Tabs>
  );
};

export default RequestTabs;
