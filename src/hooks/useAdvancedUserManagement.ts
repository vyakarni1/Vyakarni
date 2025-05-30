
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserWithDetails {
  id: string;
  name: string;
  email?: string;
  created_at: string;
  avatar_url?: string;
  subscription_status: string;
  plan_name: string;
  total_corrections: number;
  words_used: number;
  last_login?: string;
  is_active: boolean;
}

interface UserFilters {
  search: string;
  subscription_status: string;
  date_range: 'all' | 'today' | 'week' | 'month';
  sort_by: 'name' | 'created_at' | 'corrections' | 'words_used';
  sort_order: 'asc' | 'desc';
}

export const useAdvancedUserManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    subscription_status: 'all',
    date_range: 'all',
    sort_by: 'created_at',
    sort_order: 'desc',
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Fetch users with advanced filtering
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['advanced-users', filters],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          name,
          created_at,
          avatar_url,
          user_subscriptions(
            status,
            subscription_plans(plan_name)
          ),
          word_usage_history(words_used),
          user_login_activity(login_time)
        `);

      // Apply date range filter
      if (filters.date_range !== 'all') {
        let dateThreshold = new Date();
        switch (filters.date_range) {
          case 'today':
            dateThreshold.setHours(0, 0, 0, 0);
            break;
          case 'week':
            dateThreshold.setDate(dateThreshold.getDate() - 7);
            break;
          case 'month':
            dateThreshold.setMonth(dateThreshold.getMonth() - 1);
            break;
        }
        query = query.gte('created_at', dateThreshold.toISOString());
      }

      // Apply search filter
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error } = await query.order(filters.sort_by, { ascending: filters.sort_order === 'asc' });

      if (error) throw error;

      // Process and transform the data
      const processedUsers: UserWithDetails[] = data?.map(user => {
        const subscription = user.user_subscriptions?.[0];
        const totalCorrections = user.word_usage_history?.length || 0;
        const wordsUsed = user.word_usage_history?.reduce((sum, usage) => sum + (usage.words_used || 0), 0) || 0;
        const lastLogin = user.user_login_activity?.[0]?.login_time || user.created_at;

        return {
          id: user.id,
          name: user.name,
          created_at: user.created_at,
          avatar_url: user.avatar_url,
          subscription_status: subscription?.status || 'free',
          plan_name: subscription?.subscription_plans?.plan_name || 'Free',
          total_corrections: totalCorrections,
          words_used: wordsUsed,
          last_login: lastLogin,
          is_active: new Date(lastLogin) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        };
      }) || [];

      // Apply subscription status filter
      if (filters.subscription_status !== 'all') {
        return processedUsers.filter(user => user.subscription_status === filters.subscription_status);
      }

      return processedUsers;
    },
  });

  // Bulk operations
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ userIds, action, value }: { userIds: string[]; action: string; value?: any }) => {
      if (action === 'suspend') {
        // Update subscription status to suspended
        const { error } = await supabase
          .from('user_subscriptions')
          .update({ status: 'suspended' })
          .in('user_id', userIds);
        if (error) throw error;
      } else if (action === 'activate') {
        // Update subscription status to active
        const { error } = await supabase
          .from('user_subscriptions')
          .update({ status: 'active' })
          .in('user_id', userIds);
        if (error) throw error;
      } else if (action === 'delete') {
        // Delete users (cascade will handle related data)
        const { error } = await supabase
          .from('profiles')
          .delete()
          .in('id', userIds);
        if (error) throw error;
      }
    },
    onSuccess: (_, { action, userIds }) => {
      queryClient.invalidateQueries({ queryKey: ['advanced-users'] });
      setSelectedUsers([]);
      toast({
        title: "बल्क ऑपरेशन सफल",
        description: `${userIds.length} उपयोगकर्ताओं पर ${action} सफलतापूर्वक लागू किया गया।`,
      });
    },
    onError: () => {
      toast({
        title: "त्रुटि",
        description: "बल्क ऑपरेशन में त्रुटि हुई।",
        variant: "destructive",
      });
    },
  });

  // Export users data
  const exportUsers = async (format: 'csv' | 'json' = 'csv') => {
    try {
      const exportData = users || [];
      
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const csvContent = [
          'Name,Email,Created At,Subscription Status,Plan Name,Total Corrections,Words Used,Last Login',
          ...exportData.map(user => 
            `"${user.name}","${user.email || 'N/A'}","${user.created_at}","${user.subscription_status}","${user.plan_name}",${user.total_corrections},${user.words_used},"${user.last_login}"`
          )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }

      toast({
        title: "एक्सपोर्ट सफल",
        description: `उपयोगकर्ता डेटा ${format.toUpperCase()} फॉर्मेट में डाउनलोड हो गया।`,
      });
    } catch (error) {
      toast({
        title: "एक्सपोर्ट त्रुटि",
        description: "डेटा एक्सपोर्ट करने में त्रुटि हुई।",
        variant: "destructive",
      });
    }
  };

  // Update user details
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<UserWithDetails> }) => {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advanced-users'] });
      toast({
        title: "अपडेट सफल",
        description: "उपयोगकर्ता की जानकारी अपडेट हो गई।",
      });
    },
    onError: () => {
      toast({
        title: "त्रुटि",
        description: "उपयोगकर्ता अपडेट करने में त्रुटि हुई।",
        variant: "destructive",
      });
    },
  });

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
    exportUsers,
  };
};
