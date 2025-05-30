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
  date_range: 'all' | 'today' | 'week' | 'month';
  sort_by: 'name' | 'created_at' | 'word_balance' | 'profile_completion' | 'last_activity';
  sort_order: 'asc' | 'desc';
}

export const useEnhancedUserManagement = () => {
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

  // Fetch comprehensive user data with word balances
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['enhanced-users-with-balances', filters],
    queryFn: async () => {
      // Get all profiles with basic info
      let profileQuery = supabase
        .from('profiles')
        .select('id, name, created_at, avatar_url, phone, bio');

      // Apply search filter
      if (filters.search) {
        profileQuery = profileQuery.or(`name.ilike.%${filters.search}%,id.ilike.%${filters.search}%`);
      }

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

      const { data: profilesData, error: profilesError } = await profileQuery;
      if (profilesError) throw profilesError;
      if (!profilesData || profilesData.length === 0) return [];

      const userIds = profilesData.map(p => p.id);

      // Get user roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      // Get word balances for all users
      const wordBalances = await Promise.all(
        userIds.map(async (userId) => {
          const { data, error } = await supabase.rpc('get_user_word_balance', {
            user_uuid: userId
          });
          return {
            userId,
            balance: data && data.length > 0 ? data[0] : {
              total_words_available: 0,
              free_words: 0,
              purchased_words: 0,
              next_expiry_date: null
            }
          };
        })
      );

      // Get usage statistics
      const { data: usageData } = await supabase
        .from('word_usage_history')
        .select('user_id, words_used, created_at')
        .in('user_id', userIds);

      // Get user login activity
      const { data: loginData } = await supabase
        .from('user_login_activity')
        .select('user_id, login_time')
        .in('user_id', userIds)
        .order('login_time', { ascending: false });

      // Process and transform the data
      const processedUsers: UserWithDetails[] = profilesData.map(user => {
        const userRole = rolesData?.find(r => r.user_id === user.id);
        const wordBalance = wordBalances.find(wb => wb.userId === user.id)?.balance || {
          total_words_available: 0,
          free_words: 0,
          purchased_words: 0,
          next_expiry_date: null
        };

        // Calculate profile completion
        let completionScore = 0;
        if (user.name) completionScore += 25;
        if (user.avatar_url) completionScore += 25;
        if (user.phone) completionScore += 25;
        if (user.bio) completionScore += 25;

        // Calculate usage stats
        const userUsage = usageData?.filter(u => u.user_id === user.id) || [];
        const today = new Date().toDateString();
        const thisMonth = new Date().getMonth();
        
        const usageStats = {
          total_corrections: userUsage.length,
          words_used_today: userUsage
            .filter(u => new Date(u.created_at).toDateString() === today)
            .reduce((sum, u) => sum + (u.words_used || 0), 0),
          words_used_this_month: userUsage
            .filter(u => new Date(u.created_at).getMonth() === thisMonth)
            .reduce((sum, u) => sum + (u.words_used || 0), 0)
        };

        // Get last login
        const lastLogin = loginData?.find(l => l.user_id === user.id)?.login_time || user.created_at;
        const isActive = new Date(lastLogin) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        return {
          id: user.id,
          name: user.name,
          email: `user${user.id.slice(0, 8)}@example.com`, // Placeholder - would need auth access for real email
          created_at: user.created_at,
          avatar_url: user.avatar_url,
          phone: user.phone,
          bio: user.bio,
          last_login: lastLogin,
          is_active: isActive,
          role: userRole?.role || 'user',
          profile_completion: completionScore,
          word_balance: wordBalance,
          usage_stats: usageStats
        };
      });

      // Apply filters
      let filteredUsers = processedUsers;

      if (filters.role !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }

      if (filters.activity_status !== 'all') {
        filteredUsers = filteredUsers.filter(user => 
          filters.activity_status === 'active' ? user.is_active : !user.is_active
        );
      }

      if (filters.word_balance_range !== 'all') {
        filteredUsers = filteredUsers.filter(user => {
          const balance = user.word_balance.total_words_available;
          switch (filters.word_balance_range) {
            case 'none': return balance === 0;
            case 'low': return balance > 0 && balance < 100;
            case 'medium': return balance >= 100 && balance < 1000;
            case 'high': return balance >= 1000;
            default: return true;
          }
        });
      }

      if (filters.profile_completion !== 'all') {
        filteredUsers = filteredUsers.filter(user => {
          switch (filters.profile_completion) {
            case 'incomplete': return user.profile_completion < 100;
            case 'complete': return user.profile_completion === 100;
            default: return true;
          }
        });
      }

      // Apply sorting
      filteredUsers.sort((a, b) => {
        let aValue, bValue;
        switch (filters.sort_by) {
          case 'word_balance':
            aValue = a.word_balance.total_words_available;
            bValue = b.word_balance.total_words_available;
            break;
          case 'profile_completion':
            aValue = a.profile_completion;
            bValue = b.profile_completion;
            break;
          case 'last_activity':
            aValue = new Date(a.last_login || 0).getTime();
            bValue = new Date(b.last_login || 0).getTime();
            break;
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          default:
            aValue = new Date(a.created_at).getTime();
            bValue = new Date(b.created_at).getTime();
        }

        if (filters.sort_order === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      return filteredUsers;
    },
  });

  // Bulk operations for word credits
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ userIds, action, value }: { userIds: string[]; action: string; value?: any }) => {
      if (action === 'add_credits') {
        // Add word credits to selected users
        const promises = userIds.map(userId => 
          supabase.from('user_word_credits').insert({
            user_id: userId,
            words_available: value.amount,
            words_purchased: value.amount,
            is_free_credit: value.is_free || false,
            expiry_date: value.expiry_date || null,
          })
        );
        await Promise.all(promises);
      } else if (action === 'deduct_credits') {
        // Deduct word credits - this would need the RPC function
        const promises = userIds.map(userId => 
          supabase.rpc('deduct_words', {
            user_uuid: userId,
            words_to_deduct: value.amount,
            action_type: 'admin_deduction',
            text_content: `Admin deduction: ${value.reason || 'No reason provided'}`
          })
        );
        await Promise.all(promises);
      } else if (action === 'suspend') {
        // Instead of using "suspended" role, we'll deactivate users by setting a flag
        // For now, we'll just log this action since we need to implement a proper suspension system
        console.log('Suspend action requested for users:', userIds);
      } else if (action === 'activate') {
        // Reactivate users - ensure they have 'user' role
        const promises = userIds.map(userId => 
          supabase.from('user_roles').upsert({
            user_id: userId,
            role: 'user'
          })
        );
        await Promise.all(promises);
      }
    },
    onSuccess: (_, { action, userIds }) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-users-with-balances'] });
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

  // Export users with comprehensive data
  const exportUsers = async (format: 'csv' | 'json' = 'csv') => {
    try {
      const exportData = users || [];
      
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users-comprehensive-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const csvContent = [
          'Name,Email,Created At,Role,Word Balance,Free Words,Purchased Words,Profile Completion,Last Login,Total Corrections,Words Used Today',
          ...exportData.map(user => 
            `"${user.name}","${user.email || 'N/A'}","${user.created_at}","${user.role}",${user.word_balance.total_words_available},${user.word_balance.free_words},${user.word_balance.purchased_words},${user.profile_completion}%,"${user.last_login}",${user.usage_stats.total_corrections},${user.usage_stats.words_used_today}`
          )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users-comprehensive-export-${new Date().toISOString().split('T')[0]}.csv`;
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
    exportUsers,
  };
};
