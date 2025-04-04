
import { User } from "@/types/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Eye, Power, PowerOff, UserCheck, UserX, X } from "lucide-react";
import { renderStatusBadge } from "./user-utils";

interface UserTableProps {
  users: User[];
  onViewUser: (user: User) => void;
  onVerifyUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
  onBanUser: (userId: string) => void;
  onActivateUser: (userId: string) => void;
  onDeactivateUser: (userId: string) => void;
}

const UserTable = ({ 
  users, 
  onViewUser, 
  onVerifyUser, 
  onRejectUser, 
  onBanUser,
  onActivateUser,
  onDeactivateUser
}: UserTableProps) => {
  // Add debug information
  console.log(`UserTable received ${users?.length || 0} users to display`);
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Blood Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        {user.name.split(" ").map(part => part[0]).join("").substring(0, 2).toUpperCase()}
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
                <TableCell>
                  <Badge 
                    variant={user.isActive ? "default" : "outline"}
                    className={user.isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
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
                    
                    {user.isActive ? (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        onClick={() => onDeactivateUser(user.id)}
                        title="Deactivate user"
                      >
                        <PowerOff className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => onActivateUser(user.id)}
                        title="Activate user"
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {user.status !== "banned" && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onBanUser(user.id)}
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
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                {loading ? "Loading users..." : "No users found matching your search criteria."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
