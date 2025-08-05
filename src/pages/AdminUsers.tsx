
import React, { useState } from 'react';
import AdminLayoutWithNavigation from "@/components/AdminLayoutWithNavigation";
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
import { UserCorrectionHistoryDialog } from "@/components/Admin/UserCorrections";

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

  // State for corrections dialog
  const [correctionsDialogOpen, setCorrectionsDialogOpen] = useState(false);
  const [selectedUserForCorrections, setSelectedUserForCorrections] = useState<any>(null);

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

  const handleViewCorrections = (user: any) => {
    setSelectedUserForCorrections(user);
    setCorrectionsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <AdminLayoutWithNavigation>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayoutWithNavigation>
    );
  }

  return (
    <AdminLayoutWithNavigation>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">उपयोगकर्ता प्रबंधन</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">सभी उपयोगकर्ताओं को देखें और प्रबंधित करें</p>
          </div>
          <Button className="flex items-center space-x-2 flex-shrink-0 min-h-[44px]">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">नया उपयोगकर्ता</span>
            <span className="sm:hidden">नया</span>
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
          <TabsList className="grid w-full grid-cols-2 h-auto p-1">
            <TabsTrigger value="regular" className="flex items-center justify-center space-x-1 sm:space-x-2 min-h-[44px] px-2 sm:px-4">
              <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate">
                <span className="hidden sm:inline">नियमित उपयोगकर्ता</span>
                <span className="sm:hidden">नियमित</span>
                <span className="ml-1">({regularUsers?.length || 0})</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center justify-center space-x-1 sm:space-x-2 min-h-[44px] px-2 sm:px-4">
              <Crown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate">
                <span className="hidden sm:inline">एडमिन उपयोगकर्ता</span>
                <span className="sm:hidden">एडमिन</span>
                <span className="ml-1">({adminUsers?.length || 0})</span>
              </span>
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
                  onViewCorrections={handleViewCorrections}
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
                  onViewCorrections={handleViewCorrections}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
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

        {/* User Corrections Dialog */}
        {selectedUserForCorrections && (
          <UserCorrectionHistoryDialog
            open={correctionsDialogOpen}
            onOpenChange={setCorrectionsDialogOpen}
            userId={selectedUserForCorrections.id}
            userName={selectedUserForCorrections.name || 'अनाम उपयोगकर्ता'}
            userEmail={selectedUserForCorrections.email}
          />
        )}
      </div>
    </AdminLayoutWithNavigation>
  );
};

export default AdminUsers;
