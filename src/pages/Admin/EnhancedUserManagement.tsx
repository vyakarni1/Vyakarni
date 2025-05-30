
import React, { useState } from 'react';
import ModernAdminLayout from '@/components/Admin/ModernAdminLayout';
import EnhancedUserFilters from '@/components/Admin/UserManagement/EnhancedUserFilters';
import EnhancedUserTable from '@/components/Admin/UserManagement/EnhancedUserTable';
import EnhancedBulkActions from '@/components/Admin/UserManagement/EnhancedBulkActions';
import { useEnhancedUserManagement } from '@/hooks/useAdvancedUserManagement';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Activity, 
  Crown, 
  Coins,
  TrendingUp,
  Clock
} from 'lucide-react';

const EnhancedUserManagement = () => {
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
  } = useEnhancedUserManagement();

  const [selectedUser, setSelectedUser] = useState(null);

  const handleSelectUser = (userId: string, selected: boolean) => {
    if (selected) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedUsers(users?.map(user => user.id) || []);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkAction = (action: string, value?: any) => {
    if (selectedUsers.length === 0) return;
    bulkUpdate({ userIds: selectedUsers, action, value });
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    console.log('Edit user:', user);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('क्या आप वाकई इस उपयोगकर्ता को हटाना चाहते हैं?')) {
      bulkUpdate({ userIds: [userId], action: 'delete' });
    }
  };

  const handleViewDetails = (user: any) => {
    console.log('View details for user:', user);
  };

  const handleManageCredits = (user: any) => {
    console.log('Manage credits for user:', user);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Calculate stats
  const stats = users ? {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.is_active).length,
    adminUsers: users.filter(u => u.role === 'admin').length,
    totalWordBalance: users.reduce((sum, u) => sum + u.word_balance.total_words_available, 0),
    averageProfileCompletion: Math.round(users.reduce((sum, u) => sum + u.profile_completion, 0) / users.length),
    usersWithZeroBalance: users.filter(u => u.word_balance.total_words_available === 0).length,
  } : {
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    totalWordBalance: 0,
    averageProfileCompletion: 0,
    usersWithZeroBalance: 0,
  };

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
              व्यापक उपयोगकर्ता प्रोफ़ाइल, शब्द बैलेंस और गतिविधि प्रबंधन
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">लाइव डेटा</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-700">{stats.totalUsers}</div>
                  <div className="text-sm text-blue-600">कुल उपयोगकर्ता</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-700">{stats.activeUsers}</div>
                  <div className="text-sm text-green-600">सक्रिय उपयोगकर्ता</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-700">{stats.adminUsers}</div>
                  <div className="text-sm text-purple-600">एडमिन उपयोगकर्ता</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-yellow-700">{stats.totalWordBalance.toLocaleString()}</div>
                  <div className="text-sm text-yellow-600">कुल शब्द बैलेंस</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <div>
                  <div className="text-2xl font-bold text-indigo-700">{stats.averageProfileCompletion}%</div>
                  <div className="text-sm text-indigo-600">औसत प्रोफ़ाइल पूर्णता</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-red-700">{stats.usersWithZeroBalance}</div>
                  <div className="text-sm text-red-600">शून्य बैलेंस वाले</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <EnhancedUserFilters
          filters={filters}
          onFiltersChange={setFilters}
          onExport={exportUsers}
          onRefresh={handleRefresh}
          isLoading={isLoading}
          totalUsers={stats.totalUsers}
        />

        {/* Bulk Actions */}
        <EnhancedBulkActions
          selectedCount={selectedUsers.length}
          onBulkAction={handleBulkAction}
          isUpdating={isBulkUpdating}
        />

        {/* User Table */}
        {isLoading ? (
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600">उपयोगकर्ता डेटा लोड हो रहा है...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <EnhancedUserTable
            users={users || []}
            selectedUsers={selectedUsers}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAll}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onViewDetails={handleViewDetails}
            onManageCredits={handleManageCredits}
          />
        )}
      </div>
    </ModernAdminLayout>
  );
};

export default EnhancedUserManagement;
