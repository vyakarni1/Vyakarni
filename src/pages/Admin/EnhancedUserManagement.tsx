
import React, { useState } from 'react';
import ModernAdminLayout from '@/components/Admin/ModernAdminLayout';
import UserFilters from '@/components/Admin/UserManagement/UserFilters';
import UserTable from '@/components/Admin/UserManagement/UserTable';
import BulkActions from '@/components/Admin/UserManagement/BulkActions';
import { useAdvancedUserManagement } from '@/hooks/useAdvancedUserManagement';

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
    updateUser,
    exportUsers,
  } = useAdvancedUserManagement();

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
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('क्या आप वाकई इस उपयोगकर्ता को हटाना चाहते हैं?')) {
      bulkUpdate({ userIds: [userId], action: 'delete' });
    }
  };

  const handleViewDetails = (user: any) => {
    console.log('View details for user:', user);
  };

  const handleRefresh = () => {
    window.location.reload();
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
              व्यापक उपयोगकर्ता खोज, फिल्टरिंग और बल्क संचालन
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">लाइव डेटा</span>
          </div>
        </div>

        {/* Filters */}
        <UserFilters
          filters={filters}
          onFiltersChange={setFilters}
          onExport={exportUsers}
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />

        {/* Bulk Actions */}
        <BulkActions
          selectedCount={selectedUsers.length}
          onBulkAction={handleBulkAction}
          isUpdating={isBulkUpdating}
        />

        {/* User Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <UserTable
            users={users || []}
            selectedUsers={selectedUsers}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAll}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onViewDetails={handleViewDetails}
          />
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{users?.length || 0}</div>
            <div className="text-sm text-gray-600">कुल उपयोगकर्ता</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">
              {users?.filter(u => u.is_active).length || 0}
            </div>
            <div className="text-sm text-gray-600">सक्रिय उपयोगकर्ता</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">
              {users?.filter(u => u.subscription_status === 'active').length || 0}
            </div>
            <div className="text-sm text-gray-600">प्रीमियम सदस्य</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border">
            <div className="text-2xl font-bold text-orange-600">{selectedUsers.length}</div>
            <div className="text-sm text-gray-600">चयनित उपयोगकर्ता</div>
          </div>
        </div>
      </div>
    </ModernAdminLayout>
  );
};

export default EnhancedUserManagement;
