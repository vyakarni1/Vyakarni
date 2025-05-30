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
  date_range: 'all' | 'today' | 'week' | 'month';
  sort_by: 'name' | 'created_at' | 'word_balance' | 'profile_completion' | 'last_activity';
  sort_order: 'asc' | 'desc';
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

  // Fetch users with advanced filtering
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['advanced-users', filters],
    queryFn: async () => {
      console.log('🔍 Starting user fetch with filters:', filters);
      
      // Base profiles query - get ALL profiles first
      let profileQuery = supabase
        .from('profiles')
        .select(`
          id, 
          name, 
          email,
          created_at, 
          avatar_url,
          phone,
          bio
        `);

      // Only apply date range filter if it's not 'all'
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
        console.log('📅 Applied date filter:', filters.date_range, 'threshold:', dateThreshold.toISOString());
      }

      // Only apply search filter if there's actual search text
      if (filters.search && filters.search.trim()) {
        profileQuery = profileQuery.or(`name.ilike.%${filters.search.trim()}%,email.ilike.%${filters.search.trim()}%`);
        console.log('🔍 Applied search filter:', filters.search.trim());
      }

      const { data: profilesData, error: profilesError } = await profileQuery
        .order(filters.sort_by === 'name' ? 'name' : 'created_at', { ascending: filters.sort_order === 'asc' });

      if (profilesError) {
        console.error('❌ Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('👥 Fetched profiles:', profilesData?.length || 0, 'profiles');

      if (!profilesData || profilesData.length === 0) {
        console.log('⚠️ No profiles found');
        return [];
      }

      const userIds = profilesData.map(p => p.id);
      console.log('👤 User IDs for further queries:', userIds);

      // Get user roles - fetch ALL roles, don't filter here
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      if (rolesError) {
        console.error('❌ Error fetching roles:', rolesError);
        throw rolesError;
      }

      console.log('🔐 Fetched roles:', rolesData?.length || 0, rolesData);

      // Get word credits data
      const { data: creditsData, error: creditsError } = await supabase
        .from('user_word_credits')
        .select('user_id, words_available, is_free_credit, expiry_date')
        .in('user_id', userIds)
        .gt('words_available', 0);

      if (creditsError) {
        console.error('❌ Error fetching credits:', creditsError);
        throw creditsError;
      }

      console.log('💰 Fetched credits:', creditsData?.length || 0);

      // Get usage data
      const { data: usageData, error: usageError } = await supabase
        .from('word_usage_history')
        .select('user_id, words_used, created_at')
        .in('user_id', userIds);

      if (usageError) {
        console.error('❌ Error fetching usage:', usageError);
        throw usageError;
      }

      console.log('📊 Fetched usage:', usageData?.length || 0);

      // Process and transform the data
      const processedUsers: UserWithDetails[] = profilesData.map(user => {
        const userRoles = rolesData?.filter(r => r.user_id === user.id) || [];
        // Default to 'user' role if no role is found
        const userRole = userRoles[0]?.role || 'user';
        
        console.log(`👤 Processing user ${user.email}: role = ${userRole} (from ${userRoles.length} role records)`);
        
        const userCredits = creditsData?.filter(c => c.user_id === user.id) || [];
        const totalWords = userCredits.reduce((sum, credit) => sum + credit.words_available, 0);
        const freeWords = userCredits.filter(c => c.is_free_credit).reduce((sum, credit) => sum + credit.words_available, 0);
        const purchasedWords = userCredits.filter(c => !c.is_free_credit).reduce((sum, credit) => sum + credit.words_available, 0);
        const nextExpiry = userCredits.filter(c => c.expiry_date).sort((a, b) => new Date(a.expiry_date!).getTime() - new Date(b.expiry_date!).getTime())[0]?.expiry_date;
        
        const userUsage = usageData?.filter(u => u.user_id === user.id) || [];
        const totalCorrections = userUsage.length;
        const wordsUsedTotal = userUsage.reduce((sum, usage) => sum + (usage.words_used || 0), 0);
        
        // Calculate today's usage
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const wordsUsedToday = userUsage
          .filter(u => new Date(u.created_at) >= today)
          .reduce((sum, usage) => sum + (usage.words_used || 0), 0);
        
        // Calculate this month's usage
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);
        const wordsUsedThisMonth = userUsage
          .filter(u => new Date(u.created_at) >= thisMonth)
          .reduce((sum, usage) => sum + (usage.words_used || 0), 0);
        
        // Calculate profile completion
        let completionScore = 0;
        if (user.name) completionScore += 25;
        if (user.email) completionScore += 25;
        if (user.avatar_url) completionScore += 25;
        if (user.bio) completionScore += 25;

        const lastLogin = user.created_at;
        const isActive = new Date(lastLogin) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
          avatar_url: user.avatar_url,
          phone: user.phone,
          bio: user.bio,
          last_login: lastLogin,
          is_active: isActive,
          role: userRole,
          word_balance: {
            total_words_available: totalWords,
            free_words: freeWords,
            purchased_words: purchasedWords,
            next_expiry_date: nextExpiry,
          },
          profile_completion: completionScore,
          usage_stats: {
            total_corrections: totalCorrections,
            words_used_today: wordsUsedToday,
            words_used_this_month: wordsUsedThisMonth,
          },
        };
      });

      console.log('🔄 Processed users before filtering:', processedUsers.length);
      console.log('📋 User roles found:', processedUsers.map(u => ({ email: u.email, role: u.role })));

      // Apply filters AFTER processing all users
      let filteredUsers = processedUsers;

      // Apply role filter
      if (filters.role !== 'all') {
        console.log(`🎯 Filtering by role: ${filters.role}`);
        const beforeCount = filteredUsers.length;
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
        console.log(`✅ Users after role filter: ${filteredUsers.length} (filtered out ${beforeCount - filteredUsers.length})`);
      }

      // Apply activity status filter
      if (filters.activity_status !== 'all') {
        console.log(`🎯 Filtering by activity: ${filters.activity_status}`);
        const beforeCount = filteredUsers.length;
        filteredUsers = filteredUsers.filter(user => 
          filters.activity_status === 'active' ? user.is_active : !user.is_active
        );
        console.log(`✅ Users after activity filter: ${filteredUsers.length} (filtered out ${beforeCount - filteredUsers.length})`);
      }

      // Apply word balance filter
      if (filters.word_balance_range !== 'all') {
        console.log(`🎯 Filtering by word balance: ${filters.word_balance_range}`);
        const beforeCount = filteredUsers.length;
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
        console.log(`✅ Users after word balance filter: ${filteredUsers.length} (filtered out ${beforeCount - filteredUsers.length})`);
      }

      // Apply profile completion filter
      if (filters.profile_completion !== 'all') {
        console.log(`🎯 Filtering by profile completion: ${filters.profile_completion}`);
        const beforeCount = filteredUsers.length;
        filteredUsers = filteredUsers.filter(user => 
          filters.profile_completion === 'complete' ? user.profile_completion === 100 : user.profile_completion < 100
        );
        console.log(`✅ Users after profile completion filter: ${filteredUsers.length} (filtered out ${beforeCount - filteredUsers.length})`);
      }

      // Apply sorting
      filteredUsers.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (filters.sort_by) {
          case 'name':
            aValue = (a.name || 'अनाम उपयोगकर्ता').toLowerCase();
            bValue = (b.name || 'अनाम उपयोगकर्ता').toLowerCase();
            break;
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

      console.log('🎯 Final filtered users:', filteredUsers.length);
      return filteredUsers;
    },
  });

  // Separate admin and regular users
  const adminUsers = users?.filter(user => user.role === 'admin' || user.role === 'moderator') || [];
  const regularUsers = users?.filter(user => user.role === 'user') || [];

  console.log('👑 Admin users count:', adminUsers.length);
  console.log('👤 Regular users count:', regularUsers.length);
  console.log('📊 All users by role:', users?.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>));

  // Bulk operations
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ userIds, action, value }: { userIds: string[]; action: string; value?: any }) => {
      if (action === 'add_credits' || action === 'deduct_credits') {
        const amount = value.amount;
        const reason = value.reason;
        const isFree = value.is_free;
        const expiryDate = value.expiry_date;

        if (action === 'add_credits') {
          // Add credits to selected users
          const creditEntries = userIds.map(userId => ({
            user_id: userId,
            words_available: amount,
            words_purchased: amount,
            is_free_credit: isFree,
            expiry_date: expiryDate,
            purchase_date: new Date().toISOString(),
          }));

          const { error } = await supabase
            .from('user_word_credits')
            .insert(creditEntries);
          if (error) throw error;
        } else {
          // Deduct credits (implementation needed based on requirements)
          throw new Error('Credit deduction not implemented yet');
        }
      } else if (action === 'assign_role') {
        // Update user roles
        const roleEntries = userIds.map(userId => ({
          user_id: userId,
          role: value.role,
        }));

        // Delete existing roles first
        await supabase
          .from('user_roles')
          .delete()
          .in('user_id', userIds);

        // Insert new roles
        const { error } = await supabase
          .from('user_roles')
          .insert(roleEntries);
        if (error) throw error;
      } else if (action === 'delete') {
        // Delete users (this will cascade to related data)
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
          'Name,Email,Created At,Role,Word Balance,Profile Completion,Total Corrections,Words Used Today,Last Login',
          ...exportData.map(user => 
            `"${user.name || 'अनाम उपयोगकर्ता'}","${user.email}","${user.created_at}","${user.role}",${user.word_balance.total_words_available},${user.profile_completion},${user.usage_stats.total_corrections},${user.usage_stats.words_used_today},"${user.last_login}"`
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
