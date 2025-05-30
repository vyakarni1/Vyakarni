
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserFilters, UserWithDetails } from '@/types/userManagement';
import { processUserData } from '@/utils/userDataProcessing';

export const useUserData = (filters: UserFilters) => {
  return useQuery({
    queryKey: ['enhanced-users-complete', filters],
    queryFn: async (): Promise<UserWithDetails[]> => {
      console.log('Fetching complete user data with filters:', filters);
      
      try {
        // Get all profiles with email
        let profileQuery = supabase
          .from('profiles')
          .select('id, name, email, created_at, avatar_url, phone, bio');

        // Apply search filter if provided
        if (filters.search) {
          profileQuery = profileQuery.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,id.ilike.%${filters.search}%`);
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

        if (!profilesData || profilesData.length === 0) {
          return [];
        }

        const userIds = profilesData.map(p => p.id);

        // Get existing roles
        const { data: existingRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('user_id', userIds);

        if (rolesError) {
          console.error('Error fetching roles:', rolesError);
        }

        // Find users without roles and create default 'user' role for them
        const usersWithRoles = existingRoles?.map(r => r.user_id) || [];
        const usersWithoutRoles = userIds.filter(id => !usersWithRoles.includes(id));
        
        if (usersWithoutRoles.length > 0) {
          console.log('Creating roles for users without roles:', usersWithoutRoles);
          
          try {
            const rolesToInsert = usersWithoutRoles.map(userId => ({
              user_id: userId,
              role: 'user' as const
            }));
            
            const { error: roleInsertError } = await supabase
              .from('user_roles')
              .insert(rolesToInsert);
              
            if (roleInsertError) {
              console.error('Error creating default roles:', roleInsertError);
            }
          } catch (error) {
            console.error('Exception creating roles:', error);
          }
        }

        // Get all roles again
        const { data: allRoles } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('user_id', userIds);

        // Get word balances for all users
        const wordBalancePromises = userIds.map(async (userId) => {
          try {
            const { data } = await supabase.rpc('get_user_word_balance', { user_uuid: userId });
            return {
              userId,
              balance: data?.[0] || {
                total_words_available: 0,
                free_words: 0,
                purchased_words: 0,
                next_expiry_date: null
              }
            };
          } catch (error) {
            console.error(`Error fetching word balance for user ${userId}:`, error);
            return {
              userId,
              balance: {
                total_words_available: 0,
                free_words: 0,
                purchased_words: 0,
                next_expiry_date: null
              }
            };
          }
        });

        const wordBalances = await Promise.all(wordBalancePromises);

        // Get usage stats for all users
        const { data: usageData } = await supabase
          .from('word_usage_history')
          .select('user_id, words_used, created_at')
          .in('user_id', userIds);

        // Process the complete user data
        const processedUsers = processUserData(profilesData, allRoles, wordBalances, usageData || []);

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

        if (filters.profile_completion !== 'all') {
          filteredUsers = filteredUsers.filter(user => {
            switch (filters.profile_completion) {
              case 'incomplete': return user.profile_completion < 100;
              case 'complete': return user.profile_completion === 100;
              default: return true;
            }
          });
        }

        if (filters.word_balance_range !== 'all') {
          filteredUsers = filteredUsers.filter(user => {
            const balance = user.word_balance.total_words_available;
            switch (filters.word_balance_range) {
              case 'zero': return balance === 0;
              case 'low': return balance > 0 && balance <= 100;
              case 'medium': return balance > 100 && balance <= 1000;
              case 'high': return balance > 1000;
              default: return true;
            }
          });
        }

        return filteredUsers;
        
      } catch (error) {
        console.error('Error in user management query:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 30000,
  });
};
