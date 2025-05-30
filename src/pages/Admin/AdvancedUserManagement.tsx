
import { useState } from 'react';
import ModernAdminLayout from '@/components/Admin/ModernAdminLayout';
import { useAdvancedUserManagement } from '@/hooks/useAdvancedUserManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  Shield, 
  User, 
  Search, 
  Filter, 
  MoreVertical,
  Crown,
  Activity,
  Calendar,
  Settings,
  UserCheck,
  UserX
} from 'lucide-react';

const AdvancedUserManagement = () => {
  const {
    users,
    isLoading,
    filters,
    setFilters,
    selectedUsers,
    setSelectedUsers,
    bulkUpdate,
    isBulkUpdating,
    exportUsers,
  } = useAdvancedUserManagement();

  const [bulkAction, setBulkAction] = useState<string>('');

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users?.map(user => user.id) || []);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleUserSelect = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleBulkAction = () => {
    if (bulkAction && selectedUsers.length > 0) {
      bulkUpdate({ userIds: selectedUsers, action: bulkAction });
      setBulkAction('');
    }
  };

  if (isLoading) {
    return (
      <ModernAdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </ModernAdminLayout>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              उन्नत उपयोगकर्ता प्रबंधन
            </h1>
            <p className="text-gray-600 mt-1">
              उपयोगकर्ता सब्सक्रिप्शन और गतिविधि प्रबंधन
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {users?.length || 0} कुल उपयोगकर्ता
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {selectedUsers.length} चयनित
            </Badge>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>खोज और फ़िल्टर</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="नाम या ID से खोजें..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-9"
                />
              </div>
              
              <Select value={filters.subscription_status} onValueChange={(value) => setFilters({ ...filters, subscription_status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="सब्सक्रिप्शन फ़िल्टर" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सभी स्थितियां</SelectItem>
                  <SelectItem value="active">सक्रिय</SelectItem>
                  <SelectItem value="free">मुफ़्त</SelectItem>
                  <SelectItem value="suspended">निलंबित</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.date_range} onValueChange={(value) => setFilters({ ...filters, date_range: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="दिनांक फ़िल्टर" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सभी समय</SelectItem>
                  <SelectItem value="today">आज</SelectItem>
                  <SelectItem value="week">इस सप्ताह</SelectItem>
                  <SelectItem value="month">इस महीने</SelectItem>
                </SelectContent>
              </Select>

              {selectedUsers.length > 0 && (
                <div className="flex space-x-2">
                  <Select value={bulkAction} onValueChange={setBulkAction}>
                    <SelectTrigger>
                      <SelectValue placeholder="बल्क एक्शन" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activate">सक्रिय करें</SelectItem>
                      <SelectItem value="suspend">निलंबित करें</SelectItem>
                      <SelectItem value="delete">हटाएं</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleBulkAction} disabled={!bulkAction || isBulkUpdating}>
                    लागू करें
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Export Actions */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => exportUsers('csv')}>
            CSV एक्सपोर्ट
          </Button>
          <Button variant="outline" onClick={() => exportUsers('json')}>
            JSON एक्सपोर्ट
          </Button>
        </div>

        {/* User Table */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>उपयोगकर्ता सूची ({users?.length || 0})</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedUsers.length === (users?.length || 0) && (users?.length || 0) > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-gray-600">सभी चुनें</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">चुनें</TableHead>
                    <TableHead>उपयोगकर्ता</TableHead>
                    <TableHead>सब्सक्रिप्शन</TableHead>
                    <TableHead>स्थिति</TableHead>
                    <TableHead>गतिविधि</TableHead>
                    <TableHead>शामिल होने की तारीख</TableHead>
                    <TableHead className="text-center">कार्य</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => handleUserSelect(user.id, checked as boolean)}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500 font-mono">{user.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusBadge(user.subscription_status)}>
                            {user.plan_name}
                          </Badge>
                          {user.subscription_status === 'active' && user.plan_name !== 'Free' && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={getStatusBadge(user.subscription_status)}>
                          {user.subscription_status === 'active' ? 'सक्रिय' : 'निष्क्रिय'}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Activity className="h-3 w-3" />
                          <span>{user.total_corrections} सुधार</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.words_used.toLocaleString()} शब्द उपयोग
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(user.created_at).toLocaleDateString('hi-IN')}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem 
                              onClick={() => bulkUpdate({ userIds: [user.id], action: 'activate' })}
                              disabled={user.subscription_status === 'active'}
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              सक्रिय करें
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => bulkUpdate({ userIds: [user.id], action: 'suspend' })}
                              disabled={user.subscription_status === 'suspended'}
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              निलंबित करें
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => bulkUpdate({ userIds: [user.id], action: 'delete' })}
                              className="text-red-600"
                            >
                              <Settings className="h-4 w-4 mr-2" />
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
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">कोई उपयोगकर्ता नहीं मिला</h3>
                <p className="text-gray-600">खोज मानदंड बदलने का प्रयास करें</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ModernAdminLayout>
  );
};

export default AdvancedUserManagement;
