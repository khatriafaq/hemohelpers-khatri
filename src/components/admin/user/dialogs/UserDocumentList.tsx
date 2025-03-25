
import { Button } from "@/components/ui/button";

interface UserDocumentListProps {
  documents: string[];
}

const UserDocumentList = ({ documents }: UserDocumentListProps) => {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Documents</h4>
      <div className="border rounded-lg p-3 space-y-3">
        {documents.map((doc: string, index: number) => (
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
  );
};

export default UserDocumentList;
