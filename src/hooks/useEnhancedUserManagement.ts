
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

  // Simplified query to fetch basic user data first
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['enhanced-users-simplified', filters],
    queryFn: async () => {
      console.log('Fetching users with filters:', filters);
      
      // Start with basic profiles query
      let profileQuery = supabase
        .from('profiles')
        .select('id, name, created_at, avatar_url, phone, bio');

      // Apply search filter if provided
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

      const { data: profilesData, error: profilesError } = await profileQuery
        .order(filters.sort_by === 'name' ? 'name' : 'created_at', { ascending: filters.sort_order === 'asc' });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('Fetched profiles:', profilesData?.length || 0);

      if (!profilesData || profilesData.length === 0) {
        return [];
      }

      // Get user roles for all users
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', profilesData.map(p => p.id));

      console.log('Fetched roles:', rolesData?.length || 0);

      // Transform the basic data with minimal processing
      const processedUsers: UserWithDetails[] = profilesData.map(user => {
        const userRole = rolesData?.find(r => r.user_id === user.id);
        
        // Calculate basic profile completion
        let completionScore = 0;
        if (user.name) completionScore += 25;
        if (user.avatar_url) completionScore += 25;
        if (user.phone) completionScore += 25;
        if (user.bio) completionScore += 25;

        // Basic defaults for now - we'll enhance these later
        return {
          id: user.id,
          name: user.name || 'Unknown User',
          email: `user-${user.id.slice(0, 8)}@example.com`, // Placeholder
          created_at: user.created_at,
          avatar_url: user.avatar_url,
          phone: user.phone,
          bio: user.bio,
          last_login: user.created_at, // Using created_at as fallback
          is_active: true, // Default to active for now
          role: userRole?.role || 'user',
          profile_completion: completionScore,
          word_balance: {
            total_words_available: 0, // We'll add this back later
            free_words: 0,
            purchased_words: 0,
            next_expiry_date: undefined
          },
          usage_stats: {
            total_corrections: 0, // We'll add this back later
            words_used_today: 0,
            words_used_this_month: 0
          }
        };
      });

      console.log('Processed users:', processedUsers.length);

      // Apply role filter
      let filteredUsers = processedUsers;
      if (filters.role !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }

      // Apply activity status filter
      if (filters.activity_status !== 'all') {
        filteredUsers = filteredUsers.filter(user => 
          filters.activity_status === 'active' ? user.is_active : !user.is_active
        );
      }

      // Apply profile completion filter
      if (filters.profile_completion !== 'all') {
        filteredUsers = filteredUsers.filter(user => {
          switch (filters.profile_completion) {
            case 'incomplete': return user.profile_completion < 100;
            case 'complete': return user.profile_completion === 100;
            default: return true;
          }
        });
      }

      console.log('Final filtered users:', filteredUsers.length);
      return filteredUsers;
    },
  });

  // Simplified bulk operations
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ userIds, action, value }: { userIds: string[]; action: string; value?: any }) => {
      console.log('Bulk action:', action, 'for users:', userIds);
      
      if (action === 'activate') {
        // Ensure users have 'user' role
        const promises = userIds.map(userId => 
          supabase.from('user_roles').upsert({
            user_id: userId,
            role: 'user'
          })
        );
        await Promise.all(promises);
      } else if (action === 'suspend') {
        // For now, just log this action
        console.log('Suspend action requested for users:', userIds);
        toast({
          title: "सूचना",
          description: "सस्पेंड फीचर अभी विकसित किया जा रहा है।",
        });
        return;
      } else if (action === 'delete') {
        // Delete users
        const { error } = await supabase
          .from('profiles')
          .delete()
          .in('id', userIds);
        if (error) throw error;
      }
    },
    onSuccess: (_, { action, userIds }) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-users-simplified'] });
      setSelectedUsers([]);
      toast({
        title: "बल्क ऑपरेशन सफल",
        description: `${userIds.length} उपयोगकर्ताओं पर ${action} सफलतापूर्वक लागू किया गया।`,
      });
    },
    onError: (error) => {
      console.error('Bulk operation error:', error);
      toast({
        title: "त्रुटि",
        description: "बल्क ऑपरेशन में त्रुटि हुई।",
        variant: "destructive",
      });
    },
  });

  // Simplified export function
  const exportUsers = async (format: 'csv' | 'json' = 'csv') => {
    try {
      const exportData = users || [];
      
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users-basic-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const csvContent = [
          'Name,Created At,Role,Profile Completion,Phone',
          ...exportData.map(user => 
            `"${user.name}","${user.created_at}","${user.role}",${user.profile_completion}%,"${user.phone || 'N/A'}"`
          )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users-basic-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }

      toast({
        title: "एक्सपोर्ट सफल",
        description: `उपयोगकर्ता डेटा ${format.toUpperCase()} फॉर्मेट में डाउनलोड हो गया।`,
      });
    } catch (error) {
      console.error('Export error:', error);
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
