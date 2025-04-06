
import { BloodRequest } from "@/types/admin";
import RequestCard from "./RequestCard";
import EmptyRequestsState from "./EmptyRequestsState";

interface TabContentProps {
  requests: BloodRequest[];
  filter?: string;
  onMatchRequest: (requestId: string) => void;
  onCompleteRequest: (requestId: string) => void;
  onDeleteRequest: (requestId: string) => void;
  onCreateRequest: () => void;
}

const TabContent = ({
  requests,
  filter,
  onMatchRequest,
  onCompleteRequest,
  onDeleteRequest,
  onCreateRequest
}: TabContentProps) => {
  // If filter is provided, filter requests by status
  const filteredRequests = filter 
    ? requests.filter(req => req.status === filter)
    : requests;

  return (
    <div className="mt-0 space-y-4">
      {filteredRequests.length > 0 ? (
        filteredRequests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            onMatchRequest={onMatchRequest}
            onCompleteRequest={onCompleteRequest}
            onDeleteRequest={onDeleteRequest}
          />
        ))
      ) : (
        <EmptyRequestsState 
          onCreateRequest={onCreateRequest} 
          filter={filter}
        />
      )}
    </div>
  );
};

export default TabContent;
