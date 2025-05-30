
import { useState } from 'react';
import { UserFilters } from '@/types/userManagement';
import { useUserData } from '@/hooks/useUserData';
import { useBulkOperations } from '@/hooks/useBulkOperations';
import { useUserUpdate } from '@/hooks/useUserUpdate';
import { exportUsers } from '@/utils/userExport';

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

  const { data: users, isLoading, error } = useUserData(filters);
  const bulkUpdateMutation = useBulkOperations();
  const updateUserMutation = useUserUpdate();

  return {
    users,
    isLoading,
    error,
    filters,
    setFilters,
    selectedUsers,
    setSelectedUsers,
    bulkUpdate: bulkUpdateMutation.mutate,
    isBulkUpdating: bulkUpdateMutation.isPending,
    updateUser: updateUserMutation.mutate,
    isUpdating: updateUserMutation.isPending,
    exportUsers: (format: 'csv' | 'json' = 'csv') => exportUsers(users, format),
  };
};
