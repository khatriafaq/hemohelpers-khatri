
import { FolderX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onClearFilters: () => void;
}

const EmptyState = ({ onClearFilters }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg">
      <FolderX className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No donors found</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn't find any donors matching your current search criteria.
        Try adjusting your filters or search term.
      </p>
      <Button onClick={onClearFilters} variant="outline">
        Clear Filters
      </Button>
    </div>
  );
};

export default EmptyState;
