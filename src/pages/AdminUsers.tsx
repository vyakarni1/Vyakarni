
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Users, 
  Plus,
  Edit,
  Trash2,
  Shield
} from "lucide-react";
import { useAdvancedUserManagement } from "@/hooks/useAdvancedUserManagement";
import EnhancedUserFilters from "@/components/Admin/UserManagement/EnhancedUserFilters";
import EnhancedBulkActions from "@/components/Admin/UserManagement/EnhancedBulkActions";

const AdminUsers = () => {
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users?.map(user => user.id) || []);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleBulkAction = (action: string, value?: any) => {
    bulkUpdate({ userIds: selectedUsers, action, value });
  };

  const refreshData = () => {
    // Force refresh by updating filters
    setFilters({ ...filters });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">उपयोगकर्ता प्रबंधन</h1>
            <p className="text-gray-600 mt-2">सभी उपयोगकर्ताओं को देखें और प्रबंधित करें</p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>नया उपयोगकर्ता</span>
          </Button>
        </div>

        {/* Enhanced Filters */}
        <EnhancedUserFilters
          filters={filters}
          onFiltersChange={setFilters}
          onExport={exportUsers}
          onRefresh={refreshData}
          isLoading={isLoading}
          totalUsers={users?.length || 0}
        />

        {/* Bulk Actions */}
        <EnhancedBulkActions
          selectedCount={selectedUsers.length}
          onBulkAction={handleBulkAction}
          isUpdating={isBulkUpdating}
        />

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>उपयोगकर्ता सूची</span>
              <span className="text-sm text-gray-500">({users?.length || 0})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === users?.length && users?.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead>उपयोगकर्ता</TableHead>
                    <TableHead>भूमिका</TableHead>
                    <TableHead>गतिविधि</TableHead>
                    <TableHead>शब्द बैलेंस</TableHead>
                    <TableHead>स्थिति</TableHead>
                    <TableHead className="text-right">कार्य</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-700">
                              {user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{user.name || 'नाम नहीं'}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role === 'admin' ? 'एडमिन' : 'उपयोगकर्ता'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{user.usage_stats.total_corrections} सुधार</div>
                          <div className="text-gray-500">{user.usage_stats.words_used_today} शब्द आज</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{user.word_balance.total_words_available} शब्द</div>
                          <div className="text-gray-500">उपलब्ध</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'सक्रिय' : 'निष्क्रिय'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Shield className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
