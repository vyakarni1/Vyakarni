
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserWithDetails {
  id: string;
  name?: string;
  email: string;
  created_at: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  last_login?: string;
  is_active: boolean;
  role: string;
  profile_completion: number;
  word_balance: {
    total_words_available: number;
    free_words: number;
    purchased_words: number;
    next_expiry_date?: string;
  };
  usage_stats: {
    total_corrections: number;
    words_used_today: number;
    words_used_this_month: number;
  };
}

interface UserFilters {
  search: string;
  role: string;
  activity_status: string;
  word_balance_range: string;
  profile_completion: string;
  date_range: string;
  sort_by: string;
  sort_order: string;
}

export const useAdvancedUserManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  // Fetch users with advanced filtering using current database structure
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['advanced-users', filters],
    queryFn: async () => {
      // Base profiles query
      let profileQuery = supabase
        .from('profiles')
        .select('id, name, email, created_at, avatar_url, phone, bio');

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
        profileQuery = profileQuery.gte('created_at', dateThreshold.toISOString());
      }

      // Apply search filter
      if (filters.search) {
        profileQuery = profileQuery.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data: profilesData, error: profilesError } = await profileQuery
        .order(filters.sort_by, { ascending: filters.sort_order === 'asc' });

      if (profilesError) throw profilesError;

      if (!profilesData || profilesData.length === 0) {
        return [];
      }

      // Get user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', profilesData.map(p => p.id));

      if (rolesError) throw rolesError;

      // Get word balance data
      const { data: wordCreditsData, error: creditsError } = await supabase
        .from('user_word_credits')
        .select('user_id, words_available, is_free_credit, expiry_date')
        .in('user_id', profilesData.map(p => p.id))
        .gt('words_available', 0);

      if (creditsError) throw creditsError;

      // Get usage history data
      const { data: usageData, error: usageError } = await supabase
        .from('word_usage_history')
        .select('user_id, words_used, created_at')
        .in('user_id', profilesData.map(p => p.id));

      if (usageError) throw usageError;

      // Get user stats
      const { data: userUsageData, error: userUsageError } = await supabase
        .from('user_usage')
        .select('user_id, created_at')
        .in('user_id', profilesData.map(p => p.id));

      if (userUsageError) throw userUsageError;

      // Process and transform the data
      const processedUsers: UserWithDetails[] = profilesData.map(user => {
        const userRoles = rolesData?.filter(r => r.user_id === user.id) || [];
        const userRole = userRoles[0]?.role || 'user';
        
        // Calculate word balance
        const userWordCredits = wordCreditsData?.filter(w => w.user_id === user.id) || [];
        const totalWords = userWordCredits.reduce((sum, credit) => sum + credit.words_available, 0);
        const freeWords = userWordCredits
          .filter(credit => credit.is_free_credit)
          .reduce((sum, credit) => sum + credit.words_available, 0);
        const purchasedWords = totalWords - freeWords;
        const nextExpiry = userWordCredits
          .filter(credit => credit.expiry_date)
          .sort((a, b) => new Date(a.expiry_date!).getTime() - new Date(b.expiry_date!).getTime())[0]?.expiry_date;

        // Calculate usage stats
        const userUsageHistory = usageData?.filter(u => u.user_id === user.id) || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const wordsUsedToday = userUsageHistory
          .filter(usage => new Date(usage.created_at) >= today)
          .reduce((sum, usage) => sum + usage.words_used, 0);
        
        const wordsUsedThisMonth = userUsageHistory
          .filter(usage => new Date(usage.created_at) >= monthStart)
          .reduce((sum, usage) => sum + usage.words_used, 0);

        const totalCorrections = userUsageData?.filter(u => u.user_id === user.id).length || 0;

        // Calculate profile completion
        let completionScore = 0;
        if (user.name) completionScore += 25;
        if (user.email) completionScore += 25;
        if (user.avatar_url) completionScore += 25;
        if (user.phone || user.bio) completionScore += 25;

        // Determine if user is active (used service in last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const isActive = userUsageHistory.some(usage => new Date(usage.created_at) >= weekAgo);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
          avatar_url: user.avatar_url,
          phone: user.phone,
          bio: user.bio,
          last_login: user.created_at, // Using created_at as placeholder since we don't track last login
          is_active: isActive,
          role: userRole,
          profile_completion: completionScore,
          word_balance: {
            total_words_available: totalWords,
            free_words: freeWords,
            purchased_words: purchasedWords,
            next_expiry_date: nextExpiry,
          },
          usage_stats: {
            total_corrections: totalCorrections,
            words_used_today: wordsUsedToday,
            words_used_this_month: wordsUsedThisMonth,
          },
        };
      });

      // Apply additional filters
      let filteredUsers = processedUsers;

      // Role filter
      if (filters.role !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }

      // Activity status filter
      if (filters.activity_status !== 'all') {
        if (filters.activity_status === 'active') {
          filteredUsers = filteredUsers.filter(user => user.is_active);
        } else if (filters.activity_status === 'inactive') {
          filteredUsers = filteredUsers.filter(user => !user.is_active);
        }
      }

      // Word balance range filter
      if (filters.word_balance_range !== 'all') {
        filteredUsers = filteredUsers.filter(user => {
          const balance = user.word_balance.total_words_available;
          switch (filters.word_balance_range) {
            case 'none':
              return balance === 0;
            case 'low':
              return balance > 0 && balance <= 99;
            case 'medium':
              return balance >= 100 && balance <= 999;
            case 'high':
              return balance >= 1000;
            default:
              return true;
          }
        });
      }

      // Profile completion filter
      if (filters.profile_completion !== 'all') {
        if (filters.profile_completion === 'complete') {
          filteredUsers = filteredUsers.filter(user => user.profile_completion === 100);
        } else if (filters.profile_completion === 'incomplete') {
          filteredUsers = filteredUsers.filter(user => user.profile_completion < 100);
        }
      }

      return filteredUsers;
    },
  });

  // Bulk operations
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ userIds, action, value }: { userIds: string[]; action: string; value?: any }) => {
      if (action === 'suspend') {
        // Update user role to suspended
        for (const userId of userIds) {
          const { error } = await supabase
            .from('user_roles')
            .upsert({ user_id: userId, role: 'suspended' }, { onConflict: 'user_id' });
          if (error) throw error;
        }
      } else if (action === 'activate') {
        // Update user role back to user
        for (const userId of userIds) {
          const { error } = await supabase
            .from('user_roles')
            .upsert({ user_id: userId, role: 'user' }, { onConflict: 'user_id' });
          if (error) throw error;
        }
      } else if (action === 'delete') {
        // Delete users (cascade will handle related data)
        const { error } = await supabase
          .from('profiles')
          .delete()
          .in('id', userIds);
        if (error) throw error;
      } else if (action === 'add_credits') {
        // Add word credits to users
        const wordsToAdd = value || 100;
        for (const userId of userIds) {
          const { error } = await supabase
            .from('user_word_credits')
            .insert({
              user_id: userId,
              words_available: wordsToAdd,
              words_purchased: wordsToAdd,
              is_free_credit: true,
            });
          if (error) throw error;
        }
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
          'Name,Email,Created At,Role,Word Balance,Profile Completion,Is Active',
          ...exportData.map(user => 
            `"${user.name || 'N/A'}","${user.email}","${user.created_at}","${user.role}",${user.word_balance.total_words_available},${user.profile_completion}%,${user.is_active ? 'Yes' : 'No'}`
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
