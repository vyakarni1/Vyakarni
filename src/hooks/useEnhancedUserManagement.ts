
import { useState } from 'react';
import { UserFilters } from '@/types/userManagement';
import { useUserData } from '@/hooks/useUserData';
import { useBulkUserOperations } from '@/hooks/useBulkUserOperations';
import { useUserExport } from '@/utils/userExport';

export const useEnhancedUserManagement = () => {
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
  const { bulkUpdate, isBulkUpdating } = useBulkUserOperations();
  const { exportUsers } = useUserExport();

  return {
    users,
    isLoading,
    error,
    filters,
    setFilters,
    selectedUsers,
    setSelectedUsers,
    bulkUpdate,
    isBulkUpdating,
    exportUsers: (format: 'csv' | 'json' = 'csv') => exportUsers(users || [], format),
  };
};
