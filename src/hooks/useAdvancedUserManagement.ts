
import { useState } from 'react';
import { UserFilters } from '@/types/userManagement';
import { useUserDataFetching } from './userManagement/useUserDataFetching';
import { useBulkOperations } from './userManagement/useBulkOperations';
import { useUserExport } from './userManagement/useUserExport';
import { logger } from '@/utils/logger';

export const useAdvancedUserManagement = () => {
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: 'all',
    activity_status: 'all',
    word_balance_range: 'all',
    profile_completion: 'all',
    date_range: 'all',
    sort_by: 'created_at',
    sort_order: 'desc',
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Use the refactored hooks
  const { data: users, isLoading, error } = useUserDataFetching(filters);
  const bulkUpdateMutation = useBulkOperations();
  const { exportUsers: exportUsersFunction } = useUserExport();

  // Separate admin and regular users
  const adminUsers = users?.filter(user => user.role === 'admin' || user.role === 'moderator') || [];
  const regularUsers = users?.filter(user => user.role === 'user') || [];

  logger.debug('User management statistics', {
    adminUsersCount: adminUsers.length,
    regularUsersCount: regularUsers.length,
    usersByRole: users?.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  }, 'useAdvancedUserManagement');

  const exportUsers = (format: 'csv' | 'json' = 'csv') => {
    logger.info('Exporting users', { format, userCount: users?.length || 0 }, 'useAdvancedUserManagement');
    exportUsersFunction(users || [], format);
  };

  return {
    users,
    adminUsers,
    regularUsers,
    isLoading,
    error,
    filters,
    setFilters,
    selectedUsers,
    setSelectedUsers,
    bulkUpdate: bulkUpdateMutation.mutate,
    isBulkUpdating: bulkUpdateMutation.isPending,
    exportUsers,
  };
};
