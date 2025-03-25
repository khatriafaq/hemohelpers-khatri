
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface UserFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const UserFilters = ({ searchQuery, setSearchQuery }: UserFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 w-full sm:w-[200px]"
        />
      </div>
      <Button variant="outline" size="icon">
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserFilters;
