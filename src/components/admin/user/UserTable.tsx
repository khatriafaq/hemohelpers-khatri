
import { User } from "@/types/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Eye, UserCheck, UserX } from "lucide-react";
import { renderStatusBadge } from "./user-utils";

interface UserTableProps {
  users: User[];
  onViewUser: (user: User) => void;
  onVerifyUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
  onBanUser: (userId: string) => void;
  filter?: string;
}

const UserTable = ({ 
  users, 
  onViewUser, 
  onVerifyUser, 
  onRejectUser, 
  onBanUser,
  filter
}: UserTableProps) => {
  const filteredUsers = filter 
    ? users.filter(user => user.status === filter) 
    : users;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Blood Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        {user.name.split(" ").map(part => part[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="rounded-full bg-blood-light px-2.5 py-1 text-xs font-semibold text-blood inline-block">
                    {user.bloodType}
                  </div>
                </TableCell>
                <TableCell>{user.location}</TableCell>
                <TableCell>{renderStatusBadge(user.status)}</TableCell>
                <TableCell>{user.registeredDate}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => onViewUser(user)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {user.status === "pending" && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => onVerifyUser(user.id)}
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {user.status === "pending" && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onRejectUser(user.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {user.status === "rejected" && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => onVerifyUser(user.id)}
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {user.status !== "banned" && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onBanUser(user.id)}
                        disabled={user.status === "banned"}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                {filter ? `No ${filter} users found.` : 'No users found matching your search criteria.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
