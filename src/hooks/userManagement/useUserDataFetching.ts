
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserWithDetails, UserFilters } from '@/types/userManagement';
import { useUserFiltering } from './useUserFiltering';

export const useUserDataFetching = (filters: UserFilters) => {
  const { applyFilters, applySorting } = useUserFiltering();

  // Create query key without search to prevent refetch on every keystroke
  const queryKey = ['advanced-users', {
    role: filters.role,
    activity_status: filters.activity_status,
    word_balance_range: filters.word_balance_range,
    profile_completion: filters.profile_completion,
    date_range: filters.date_range,
    sort_by: filters.sort_by,
    sort_order: filters.sort_order,
  }];

  return useQuery({
    queryKey,
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

      // Apply date range filter if it's not 'all'
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

      // Search will be applied client-side, not server-side to avoid query refetch

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

      // Get user roles
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
        // Prioritize highest role - admin > moderator > user
        const userRole = userRoles.find(r => r.role === 'admin')?.role || 
                        userRoles.find(r => r.role === 'moderator')?.role || 
                        userRoles[0]?.role || 'user';
        
        console.log(`👤 Processing user ${user.email}: role = ${userRole} (from ${userRoles.length} role records, all roles: ${userRoles.map(r => r.role).join(', ')})`);
        
        const userCredits = creditsData?.filter(c => c.user_id === user.id) || [];
        const totalWords = userCredits.reduce((sum, credit) => sum + credit.words_available, 0);
        const freeWords = userCredits.filter(c => c.is_free_credit).reduce((sum, credit) => sum + credit.words_available, 0);
        const purchasedWords = userCredits.filter(c => !c.is_free_credit).reduce((sum, credit) => sum + credit.words_available, 0);
        const nextExpiry = userCredits.filter(c => c.expiry_date).sort((a, b) => new Date(a.expiry_date!).getTime() - new Date(b.expiry_date!).getTime())[0]?.expiry_date;
        
        const userUsage = usageData?.filter(u => u.user_id === user.id) || [];
        const totalCorrections = userUsage.length;
        
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
      
      // Apply filters and sorting
      const filteredUsers = applyFilters(processedUsers, filters);
      const sortedUsers = applySorting(filteredUsers, filters);

      console.log('🎯 Final filtered users:', sortedUsers.length);
      return sortedUsers;
    },
  });
};
