
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldOff,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  name: string;
  email?: string;
  created_at: string;
  avatar_url?: string;
  subscription_status: string;
  plan_name: string;
  total_corrections: number;
  words_used: number;
  last_login?: string;
  is_active: boolean;
}

interface UserTableProps {
  users: User[];
  selectedUsers: string[];
  onSelectUser: (userId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onViewDetails: (user: User) => void;
}

const UserTable = ({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onEditUser,
  onDeleteUser,
  onViewDetails,
}: UserTableProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'suspended':
        return 'destructive';
      case 'free':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'सक्रिय';
      case 'suspended':
        return 'निलंबित';
      case 'free':
        return 'मुफ्त';
      case 'expired':
        return 'समाप्त';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={users.length > 0 && selectedUsers.length === users.length}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>उपयोगकर्ता</TableHead>
            <TableHead>सब्सक्रिप्शन</TableHead>
            <TableHead>गतिविधि</TableHead>
            <TableHead>सांख्यिकी</TableHead>
            <TableHead>अंतिम लॉगिन</TableHead>
            <TableHead className="w-16">कार्य</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={(checked) => onSelectUser(user.id, !!checked)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email || 'ईमेल नहीं'}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Badge variant={getStatusBadgeVariant(user.subscription_status)}>
                    {getStatusText(user.subscription_status)}
                  </Badge>
                  <div className="text-sm text-gray-500">{user.plan_name}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm">{user.is_active ? 'सक्रिय' : 'निष्क्रिय'}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{user.total_corrections} सुधार</div>
                  <div className="text-gray-500">{user.words_used.toLocaleString()} शब्द</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-500">
                  {user.last_login ? new Date(user.last_login).toLocaleDateString('hi-IN') : 'कभी नहीं'}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(user)}>
                      <Eye className="h-4 w-4 mr-2" />
                      विवरण देखें
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditUser(user)}>
                      <Edit className="h-4 w-4 mr-2" />
                      संपादित करें
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDeleteUser(user.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      हटाएं
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
