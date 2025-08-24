
import { UserWithDetails, UserFilters } from '@/types/userManagement';

export const useUserFiltering = () => {
  const applyFilters = (users: UserWithDetails[], filters: UserFilters): UserWithDetails[] => {
    console.log('🔍 Starting filter process with:', {
      totalUsers: users.length,
      searchTerm: filters.search,
      role: filters.role,
      sampleUsers: users.slice(0, 2).map(u => ({ name: u.name, email: u.email, role: u.role }))
    });
    
    let filteredUsers = [...users];

    // Apply search filter first - improved search logic
    if (filters.search && filters.search.trim()) {
      console.log(`🎯 Filtering by search: "${filters.search.trim()}"`);
      const beforeCount = filteredUsers.length;
      const searchTerm = filters.search.trim().toLowerCase();
      
      filteredUsers = filteredUsers.filter(user => {
        // More comprehensive search including partial name matches
        const userName = (user.name || '').toLowerCase();
        const userEmail = (user.email || '').toLowerCase();
        const userId = (user.id || '').toLowerCase();
        
        // Check for exact matches
        const exactNameMatch = userName === searchTerm;
        const exactEmailMatch = userEmail === searchTerm;
        
        // Check for partial matches (includes)
        const partialNameMatch = userName.includes(searchTerm);
        const partialEmailMatch = userEmail.includes(searchTerm);
        const idMatch = userId.includes(searchTerm);
        
        // Split search term and check each word
        const searchWords = searchTerm.split(' ').filter(word => word.length > 0);
        const wordsMatch = searchWords.every(word => 
          userName.includes(word) || userEmail.includes(word)
        );
        
        const isMatch = exactNameMatch || exactEmailMatch || partialNameMatch || partialEmailMatch || idMatch || wordsMatch;
        
        if (isMatch) {
          const matchType = exactNameMatch ? 'exact name' : 
                           exactEmailMatch ? 'exact email' : 
                           partialNameMatch ? 'partial name' : 
                           partialEmailMatch ? 'partial email' : 
                           idMatch ? 'user ID' : 'word match';
          console.log(`✅ Search match found: "${user.name || 'No name'}" (${user.email}) - Matched: ${matchType}`);
        }
        
        return isMatch;
      });
      
      console.log(`✅ Users after search filter: ${filteredUsers.length} (filtered out ${beforeCount - filteredUsers.length})`);
      
      if (filteredUsers.length === 0 && beforeCount > 0) {
        console.log(`⚠️ No matches found for search term: "${searchTerm}"`);
        console.log('📋 Sample of available users:', users.slice(0, 5).map(u => ({ 
          name: u.name, 
          email: u.email,
          nameSearch: u.name?.toLowerCase(),
          emailSearch: u.email?.toLowerCase()
        })));
      }
    }

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

    return filteredUsers;
  };

  const applySorting = (users: UserWithDetails[], filters: UserFilters): UserWithDetails[] => {
    return users.sort((a, b) => {
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
  };

  return { applyFilters, applySorting };
};
