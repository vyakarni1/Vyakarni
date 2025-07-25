
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Crown,
  User,
  Plus,
  Shield,
  UserCog
} from "lucide-react";
import { useAdvancedUserManagement } from "@/hooks/useAdvancedUserManagement";
import EnhancedUserFilters from "@/components/Admin/UserManagement/EnhancedUserFilters";
import EnhancedBulkActions from "@/components/Admin/UserManagement/EnhancedBulkActions";
import EnhancedUserTable from "@/components/Admin/UserManagement/EnhancedUserTable";

const AdminUsers = () => {
  const {
    adminUsers,
    regularUsers,
    isLoading,
    filters,
    setFilters,
    selectedUsers,
    setSelectedUsers,
    bulkUpdate,
    isBulkUpdating,
    exportUsers,
  } = useAdvancedUserManagement();

  const handleSelectAll = (checked: boolean, userType: 'admin' | 'regular') => {
    const targetUsers = userType === 'admin' ? adminUsers : regularUsers;
    if (checked) {
      setSelectedUsers([...selectedUsers, ...targetUsers.map(user => user.id)]);
    } else {
      const targetUserIds = targetUsers.map(user => user.id);
      setSelectedUsers(selectedUsers.filter(id => !targetUserIds.includes(id)));
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
          totalUsers={(adminUsers?.length || 0) + (regularUsers?.length || 0)}
        />

        {/* Bulk Actions */}
        <EnhancedBulkActions
          selectedCount={selectedUsers.length}
          onBulkAction={handleBulkAction}
          isUpdating={isBulkUpdating}
        />

        {/* User Sections with Tabs */}
        <Tabs defaultValue="regular" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="regular" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>नियमित उपयोगकर्ता ({regularUsers?.length || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center space-x-2">
              <Crown className="h-4 w-4" />
              <span>एडमिन उपयोगकर्ता ({adminUsers?.length || 0})</span>
            </TabsTrigger>
          </TabsList>

          {/* Regular Users Tab */}
          <TabsContent value="regular" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>नियमित उपयोगकर्ता</span>
                  <span className="text-sm text-gray-500">({regularUsers?.length || 0})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedUserTable
                  users={regularUsers || []}
                  selectedUsers={selectedUsers}
                  onSelectUser={handleSelectUser}
                  onSelectAll={(checked) => handleSelectAll(checked, 'regular')}
                  onEditUser={(user) => console.log('Edit user:', user)}
                  onDeleteUser={(userId) => handleBulkAction('delete', { userIds: [userId] })}
                  onViewDetails={(user) => console.log('View details:', user)}
                  onManageCredits={(user) => console.log('Manage credits:', user)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Users Tab */}
          <TabsContent value="admin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="h-5 w-5" />
                  <span>एडमिन उपयोगकर्ता</span>
                  <span className="text-sm text-gray-500">({adminUsers?.length || 0})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedUserTable
                  users={adminUsers || []}
                  selectedUsers={selectedUsers}
                  onSelectUser={handleSelectUser}
                  onSelectAll={(checked) => handleSelectAll(checked, 'admin')}
                  onEditUser={(user) => console.log('Edit admin:', user)}
                  onDeleteUser={(userId) => handleBulkAction('delete', { userIds: [userId] })}
                  onViewDetails={(user) => console.log('View admin details:', user)}
                  onManageCredits={(user) => console.log('Manage admin credits:', user)}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">कुल उपयोगकर्ता</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(adminUsers?.length || 0) + (regularUsers?.length || 0)}</div>
              <p className="text-xs text-muted-foreground">
                {regularUsers?.length || 0} नियमित + {adminUsers?.length || 0} एडमिन
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">सक्रिय उपयोगकर्ता</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {[...(adminUsers || []), ...(regularUsers || [])].filter(user => user.is_active).length}
              </div>
              <p className="text-xs text-muted-foreground">
                पिछले 7 दिनों में सक्रिय
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">चयनित उपयोगकर्ता</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedUsers.length}</div>
              <p className="text-xs text-muted-foreground">
                बल्क ऑपरेशन के लिए तैयार
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
