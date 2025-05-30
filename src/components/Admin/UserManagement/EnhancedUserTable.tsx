
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
  Eye,
  Coins,
  Activity,
  Calendar,
  Crown,
  User,
  Phone,
  Mail
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";

interface UserWithDetails {
  id: string;
  name: string;
  email?: string;
  created_at: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  last_login?: string;
  is_active: boolean;
  role: string;
  profile_completion: number;
  word_balance: {
    total_words_available: number;
    free_words: number;
    purchased_words: number;
    next_expiry_date?: string;
  };
  usage_stats: {
    total_corrections: number;
    words_used_today: number;
    words_used_this_month: number;
  };
}

interface EnhancedUserTableProps {
  users: UserWithDetails[];
  selectedUsers: string[];
  onSelectUser: (userId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onEditUser: (user: UserWithDetails) => void;
  onDeleteUser: (userId: string) => void;
  onViewDetails: (user: UserWithDetails) => void;
  onManageCredits: (user: UserWithDetails) => void;
}

const EnhancedUserTable = ({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onEditUser,
  onDeleteUser,
  onViewDetails,
  onManageCredits,
}: EnhancedUserTableProps) => {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'suspended':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'एडमिन';
      case 'user':
        return 'उपयोगकर्ता';
      case 'suspended':
        return 'निलंबित';
      default:
        return role;
    }
  };

  const getWordBalanceColor = (balance: number) => {
    if (balance === 0) return 'text-red-600';
    if (balance < 100) return 'text-orange-600';
    if (balance < 1000) return 'text-blue-600';
    return 'text-green-600';
  };

  const getWordBalanceIcon = (balance: number) => {
    if (balance === 0) return '💸';
    if (balance < 100) return '⚠️';
    if (balance < 1000) return '💰';
    return '💎';
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="w-12">
                  <Checkbox
                    checked={users.length > 0 && selectedUsers.length === users.length}
                    onCheckedChange={onSelectAll}
                  />
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">उपयोगकर्ता</TableHead>
                <TableHead className="text-gray-700 font-semibold">भूमिका और स्थिति</TableHead>
                <TableHead className="text-gray-700 font-semibold">शब्द बैलेंस</TableHead>
                <TableHead className="text-gray-700 font-semibold">प्रोफ़ाइल पूर्णता</TableHead>
                <TableHead className="text-gray-700 font-semibold">उपयोग आंकड़े</TableHead>
                <TableHead className="text-gray-700 font-semibold">अंतिम गतिविधि</TableHead>
                <TableHead className="text-center text-gray-700 font-semibold">कार्य</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50/50 transition-all duration-200 border-b border-gray-100">
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => onSelectUser(user.id, !!checked)}
                    />
                  </TableCell>
                  
                  {/* User Info */}
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 ring-2 ring-gray-200">
                        <AvatarImage src={user.avatar_url} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 truncate">{user.name}</div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{user.email || 'ईमेल नहीं'}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Phone className="h-3 w-3" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Role and Status */}
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                          {user.role === 'admin' && <Crown className="h-3 w-3 mr-1" />}
                          {user.role === 'user' && <User className="h-3 w-3 mr-1" />}
                          {user.role === 'suspended' && <Shield className="h-3 w-3 mr-1" />}
                          {getRoleText(user.role)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`h-2 w-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className={`text-xs ${user.is_active ? 'text-green-700' : 'text-gray-500'}`}>
                          {user.is_active ? 'सक्रिय' : 'निष्क्रिय'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Word Balance */}
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getWordBalanceIcon(user.word_balance.total_words_available)}</span>
                        <span className={`font-bold text-lg ${getWordBalanceColor(user.word_balance.total_words_available)}`}>
                          {user.word_balance.total_words_available.toLocaleString()}
                        </span>
                        <Coins className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>मुफ्त: {user.word_balance.free_words}</div>
                        <div>खरीदे गए: {user.word_balance.purchased_words}</div>
                        {user.word_balance.next_expiry_date && (
                          <div className="text-orange-600">
                            समाप्ति: {new Date(user.word_balance.next_expiry_date).toLocaleDateString('hi-IN')}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Profile Completion */}
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Progress value={user.profile_completion} className="w-16 h-2" />
                        <span className="text-sm font-medium">{user.profile_completion}%</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.profile_completion === 100 ? 'पूर्ण प्रोफ़ाइल' : 'अधूरी प्रोफ़ाइल'}
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Usage Stats */}
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-1">
                        <Activity className="h-3 w-3 text-blue-500" />
                        <span>{user.usage_stats.total_corrections} सुधार</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        आज: {user.usage_stats.words_used_today} शब्द
                      </div>
                      <div className="text-xs text-gray-500">
                        इस महीने: {user.usage_stats.words_used_this_month} शब्द
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Last Activity */}
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <div>
                        <div className="text-gray-900">
                          {user.last_login ? new Date(user.last_login).toLocaleDateString('hi-IN') : 'कभी नहीं'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.last_login ? new Date(user.last_login).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Actions */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onViewDetails(user)}>
                          <Eye className="h-4 w-4 mr-2" />
                          विवरण देखें
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditUser(user)}>
                          <Edit className="h-4 w-4 mr-2" />
                          संपादित करें
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onManageCredits(user)}>
                          <Coins className="h-4 w-4 mr-2" />
                          शब्द क्रेडिट प्रबंधन
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onDeleteUser(user.id)}
                          className="text-red-600 focus:text-red-600"
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
        
        {(!users || users.length === 0) && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">कोई उपयोगकर्ता नहीं मिला</h3>
            <p className="text-gray-600">खोज मानदंड बदलने का प्रयास करें या फिल्टर हटाएं</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedUserTable;
