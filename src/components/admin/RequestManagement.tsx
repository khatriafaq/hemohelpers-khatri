
import { Card, CardContent } from "@/components/ui/card";
import { mockRequests } from "@/utils/mockData";
import { useRequestManagement } from "./request/hooks/useRequestManagement";
import RequestHeader from "./request/RequestHeader";
import RequestTabs from "./request/RequestTabs";

const RequestManagement = () => {
  const {
    requests,
    showNewRequestDialog,
    setShowNewRequestDialog,
    handleCreateRequest,
    handleMatchRequest,
    handleCompleteRequest,
    handleDeleteRequest
  } = useRequestManagement({ initialRequests: mockRequests });

  return (
    <div className="space-y-6">
      <RequestHeader 
        showDialog={showNewRequestDialog}
        setShowDialog={setShowNewRequestDialog}
        onCreateRequest={handleCreateRequest}
      />
      
      <Card>
        <CardContent className="p-6">
          <RequestTabs 
            requests={requests}
            onMatchRequest={handleMatchRequest}
            onCompleteRequest={handleCompleteRequest}
            onDeleteRequest={handleDeleteRequest}
            onCreateRequest={() => setShowNewRequestDialog(true)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestManagement;
