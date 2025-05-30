
import { UserWithDetails } from '@/types/userManagement';

export const calculateProfileCompletion = (user: any): number => {
  let completionScore = 0;
  if (user.email) completionScore += 30;
  if (user.name) completionScore += 20;
  if (user.avatar_url) completionScore += 25;
  if (user.phone) completionScore += 25;
  return completionScore;
};

export const calculateUsageStats = (usageData: any[], userId: string) => {
  const userUsage = usageData?.filter(u => u.user_id === userId) || [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const wordsUsedToday = userUsage
    .filter(u => new Date(u.created_at) >= today)
    .reduce((sum, u) => sum + (u.words_used || 0), 0);
    
  const wordsUsedThisMonth = userUsage
    .filter(u => new Date(u.created_at) >= thisMonth)
    .reduce((sum, u) => sum + (u.words_used || 0), 0);

  return {
    total_corrections: userUsage.length,
    words_used_today: wordsUsedToday,
    words_used_this_month: wordsUsedThisMonth
  };
};

export const processUserData = (
  profilesData: any[],
  allRoles: any[],
  wordBalances: any[],
  usageData: any[]
): UserWithDetails[] => {
  return profilesData.map(user => {
    const userRole = allRoles?.find(r => r.user_id === user.id);
    const userWordBalance = wordBalances.find(b => b.userId === user.id)?.balance || {
      total_words_available: 0,
      free_words: 0,
      purchased_words: 0,
      next_expiry_date: null
    };
    
    const usageStats = calculateUsageStats(usageData, user.id);
    const profileCompletion = calculateProfileCompletion(user);

    return {
      id: user.id,
      name: user.name || undefined,
      email: user.email,
      created_at: user.created_at,
      avatar_url: user.avatar_url,
      phone: user.phone,
      bio: user.bio,
      last_login: user.created_at,
      is_active: true,
      role: userRole?.role || 'user',
      profile_completion: profileCompletion,
      word_balance: {
        total_words_available: userWordBalance.total_words_available,
        free_words: userWordBalance.free_words,
        purchased_words: userWordBalance.purchased_words,
        next_expiry_date: userWordBalance.next_expiry_date
      },
      usage_stats: usageStats
    };
  });
};
